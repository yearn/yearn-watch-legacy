import { ContractCallResults, ContractCallContext } from 'ethereum-multicall';
import { utils } from 'ethers';
import { omit, memoize } from 'lodash';

import { getMulticallContract } from './multicall';
import {
    Strategy,
    StrategyAddressQueueIndex,
    VaultApi,
    StrategyParams,
    Network,
} from '../types';
import { getABI } from './abi';
import { mapStrategyParams } from './strategyParams';
import { mapContractCalls } from './commonUtils';

import StratABI from './ABI/Strategy.json';
import TokenABI from './ABI/Token.json';
import { getEndorsedVaults } from './vaults';

interface VaultVersionInfo {
    apiVersion: string;
    want: string;
}

const STRAT_VIEW_METHODS = [
    'apiVersion',
    'emergencyExit',
    'isActive',
    'keeper',
    'rewards',
    'strategist',
    'name',
    'vault',
    'estimatedTotalAssets',
    'delegatedAssets',
    'want',
];

const STRAT_PARAM_METHODS: string[] = [
    'debtOutstanding',
    'creditAvailable',
    'expectedReturn',
    'strategies',
];

const TOKEN_VIEW_METHODS: string[] = ['decimals', 'symbol', 'name'];
// DEV NOTE: this filter was used in this strategy since it was failing to load the estimatedTotalAsset value
// const filterList = ['0x2923a58c1831205c854dbea001809b194fdb3fa5'];
const filterList: string[] = [];
const buildViewMethodsCall = (strategies: string[]): ContractCallContext[] => {
    return strategies.map((stratAddres) => {
        // TODO: this is a hack since a strategy is failing on this specific call
        // remove after on chain fix
        const filterCalls = STRAT_VIEW_METHODS.filter((viewMethod) => {
            return !(
                filterList.includes(stratAddres.toLowerCase()) &&
                viewMethod === 'estimatedTotalAssets'
            );
        });
        const calls = filterCalls.map((method) => ({
            reference: method,
            methodName: method,
            methodParameters: [] as string[],
        }));
        return {
            reference: stratAddres,
            contractAddress: stratAddres,
            abi: StratABI.abi,
            calls,
        };
    });
};

const buildParamMethodsCall = (
    strategies: string[],
    strategyMap: Map<string, string>,
    vaultMap: Map<string, VaultVersionInfo>
): ContractCallContext[] => {
    return strategies.map((stratAddres) => {
        const vaultAddress = strategyMap.get(stratAddres) as string;
        const vaultInfo = vaultMap.get(vaultAddress) as VaultVersionInfo;
        const abiParams = getABI(vaultInfo.apiVersion);
        const calls = STRAT_PARAM_METHODS.map((method) => ({
            reference: method === 'strategies' ? 'strategyParams' : method,
            methodName: method,
            methodParameters: [stratAddres],
        }));
        return {
            reference: `${stratAddres}_${vaultAddress}`,
            contractAddress: vaultAddress,
            abi: abiParams,
            calls,
        };
    });
};

const buildTokenCallMethods = (
    strategies: string[],
    strategyMap: Map<string, string>,
    vaultMap: Map<string, VaultVersionInfo>
): ContractCallContext[] => {
    return strategies.map((stratAddres) => {
        const vaultAddress = strategyMap.get(stratAddres) as string;
        const vaultInfo = vaultMap.get(vaultAddress) as VaultVersionInfo;

        const calls = TOKEN_VIEW_METHODS.map((method) => ({
            reference: method,
            methodName: method,
            methodParameters: [] as string[],
        }));
        return {
            reference: `${vaultInfo.want}`,
            contractAddress: vaultInfo.want,
            abi: TokenABI.abi,
            calls,
        };
    });
};

export const buildStrategyCalls = (
    strategies: string[],
    vaultMap: Map<string, VaultApi>,
    strategyMap: Map<string, string>
): ContractCallContext[] => {
    const stratViewMethods = buildViewMethodsCall(strategies);

    const stratParamMethods = buildParamMethodsCall(
        strategies,
        strategyMap,
        vaultMap
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return stratViewMethods.concat(stratParamMethods);
};

export const mapStrategiesCalls = (
    strategies: string[],
    contractCallsResults: ContractCallResults,
    strategiesQueueIndexes: Array<StrategyAddressQueueIndex>,
    strategyMap: Map<string, string>
): Strategy[] => {
    return strategies.map((address) => {
        const stratData = contractCallsResults.results[address];
        const vaultStratData =
            contractCallsResults.results[
                `${address}_${strategyMap.get(address)}`
            ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedStrat: any = mapContractCalls(stratData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedVaultStratInfo: any = omit(
            mapContractCalls(vaultStratData),
            'strategies'
        );
        const mappedStratParams: StrategyParams = mapStrategyParams(
            vaultStratData,
            mappedStrat.apiVersion
        );
        const tokenData = contractCallsResults.results[mappedStrat.want];
        if (tokenData) {
            const token = mapContractCalls(tokenData);
            mappedStrat.token = {
                ...token,
                address: mappedStrat.want,
            };
        }
        const strategyWithdrawalQueueIndex = strategiesQueueIndexes.find(
            (queueIndex) =>
                queueIndex.address.toLowerCase() === address.toLowerCase()
        );
        const withdrawalQueueIndex =
            strategyWithdrawalQueueIndex === undefined
                ? -1
                : strategyWithdrawalQueueIndex.queueIndex;
        return {
            ...mappedVaultStratInfo,
            ...mappedStrat,
            address,
            params: mappedStratParams,
            withdrawalQueueIndex,
        };
    });
};

const innerGetStrategies = async (
    addresses: string[],
    network: Network | string = Network.mainnet
): Promise<Strategy[]> => {
    if (addresses.length === 0) {
        throw new Error('Expected a valid strategy address');
    }

    addresses.forEach((address) => {
        if (!address || !utils.isAddress(address)) {
            throw new Error('Expected a valid strategy address');
        }
    });

    const multicall = getMulticallContract(network);

    // do call to strategy apiVersion and vault
    const stratCalls: ContractCallContext[] = buildViewMethodsCall(addresses);

    const resultsViewMethods: ContractCallResults = await multicall.call(
        stratCalls
    );
    const vaultMap = new Map<string, VaultVersionInfo>();
    const strategyMap = new Map<string, string>();

    addresses.forEach((address) => {
        const stratData = resultsViewMethods.results[address];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedStrat: any = mapContractCalls(stratData);
        strategyMap.set(address, mappedStrat.vault);
        vaultMap.set(mappedStrat.vault, {
            apiVersion: mappedStrat.apiVersion,
            want: mappedStrat.want,
        });
    });

    const stratParamCalls = buildParamMethodsCall(
        addresses,
        strategyMap,
        vaultMap
    );
    const tokenMethodCalls = buildTokenCallMethods(
        addresses,
        strategyMap,
        vaultMap
    );

    const stratParamResults: ContractCallResults = await multicall.call(
        stratParamCalls.concat(tokenMethodCalls)
    );

    const mergedResults: ContractCallResults = {
        results: {
            ...resultsViewMethods.results,
            ...stratParamResults.results,
        },
        blockNumber: stratParamResults.blockNumber,
    };

    const mappedStrategies = mapStrategiesCalls(
        addresses,
        mergedResults,
        [],
        strategyMap
    );

    return mappedStrategies;
};

export const getStrategies = memoize(innerGetStrategies);

export const _getAllStrategies = async (): Promise<Strategy[]> => {
    const allVaults = await getEndorsedVaults();
    return allVaults.flatMap((vault) => vault.strategies);
};

export const getAllStrategies = memoize(_getAllStrategies);
