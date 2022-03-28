import { ContractCallResults, ContractCallContext } from 'ethereum-multicall';
import { utils } from 'ethers';
import { omit, memoize, values } from 'lodash';
import { getMulticallContract } from './multicall';
import {
    GenLenderStrategy,
    Strategy,
    StrategyAddressQueueIndex,
    VaultApi,
    StrategyParams,
    Network,
    toQueryParam,
    DEFAULT_BATCH_SIZE,
    Vault,
} from '../types';
import { mapStrategyParams } from './strategyParams';
import { mapContractCalls } from './commonUtils';
import StratABI from './contracts/ABI/Strategy.json';
import TokenABI from './contracts/ABI/Token.json';
import { getABI } from './contracts/ABI';
import { getVaultService } from '../services/VaultService/utils';

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
    'doHealthCheck',
    'healthCheck',
];

const STRAT_GEN_LENDER_VIEW_METHODS = [
    'lendStatuses',
    'lentTotalAssets',
    'estimatedAPR',
    'estimateAdjustPosition',
];

const STRAT_PARAM_METHODS: string[] = [
    'debtOutstanding',
    'creditAvailable',
    'expectedReturn',
    'strategies',
];

const TOKEN_VIEW_METHODS: string[] = ['decimals', 'symbol', 'name'];

const buildViewMethodsCall = (
    strategies: string[],
    viewMethods: string[] = STRAT_VIEW_METHODS
): ContractCallContext[] => {
    return strategies.map((stratAddres) => {
        const calls = viewMethods.map((method) => ({
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
        if (!mappedStrat.healthCheck) {
            mappedStrat.healthCheck = null;
        }
        if (!mappedStrat.doHealthCheck) {
            mappedStrat.doHealthCheck = false;
        }
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
    network: Network
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

// Functions with more than 2 parameters need a custom key defined for memoization to work correctly.
export const getStrategies = memoize(innerGetStrategies, (...args) =>
    values(args).join('_')
);

const _getAllStrategies = async (network: Network): Promise<Strategy[]> => {
    const vaultService = getVaultService(network);
    let vaults = [];
    let allVaults: Array<Vault> = [];

    for (
        let i = 0;
        (vaults = await vaultService.getVaults(
            [],
            toQueryParam(i * DEFAULT_BATCH_SIZE)
        )) && vaults.length > 0;
        i++
    ) {
        allVaults = allVaults.concat(vaults);
    }
    return allVaults.flatMap((vault) => vault.strategies);
};

// TODO include experimental flag
export const getAllStrategies = memoize(_getAllStrategies);

const _getGenLenderStrategy = async (
    address: string,
    network: Network
): Promise<GenLenderStrategy> => {
    if (!utils.isAddress(address)) {
        throw new Error('Expected a valid strategy address');
    }

    const multicall = getMulticallContract(network);
    const stratCalls: ContractCallContext[] = buildViewMethodsCall(
        [address],
        STRAT_GEN_LENDER_VIEW_METHODS
    );

    const resultsViewMethods: ContractCallResults = await multicall.call(
        stratCalls
    );
    const stratData = resultsViewMethods.results[address];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedStrat: any = mapContractCalls(stratData);
    return {
        ...mappedStrat,
        address,
    };
};

// Functions with more than 2 parameters need a custom key defined for memoization to work correctly.
export const getGenLenderStrategy = memoize(_getGenLenderStrategy, (...args) =>
    values(args).join('_')
);
