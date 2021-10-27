import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
} from 'ethereum-multicall';
import { utils } from 'ethers';
import { omit, memoize } from 'lodash';

import { getEthersDefaultProvider } from './ethers';
import {
    Strategy,
    StrategyAddressQueueIndex,
    VaultApi,
    StrategyParams,
} from '../types';
import { getABI } from './abi';
import { mapStrategyParams } from './strategyParams';
import { mapContractCalls } from './commonUtils';

import StratABI from './ABI/Strategy.json';
import TokenABI from './ABI/Token.json';
import { querySubgraphData } from './apisRequest';

const buildHealthCheckQuery = (strategy: string): string => `
{
    strategies(where: {
      id: "${strategy.toLowerCase()}"
    }) {
        id
        healthCheck
        doHealthCheck
      }
  }
`;

const buildAllHealthCheckQuery = (
    strategiesAddressFormatted: string
): string => `
{
    strategies(where: {
      id_in: ${strategiesAddressFormatted}
    }) {
        id
        healthCheck
        doHealthCheck
      }
  }
`;

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
const filterList = ['0x2923a58c1831205c854dbea001809b194fdb3fa5'];
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
    strategyMap: Map<string, string>,
    healthCheckMap: Map<string, StrategyHealthCheck>
): Strategy[] => {
    return strategies.map((address) => {
        const stratData = contractCallsResults.results[address];
        const vaultStratData =
            contractCallsResults.results[
                `${address}_${strategyMap.get(address)}`
            ];
        const mappedStrat: any = mapContractCalls(stratData);
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
            mappedStrat.token = token;
        }
        const strategyWithdrawalQueueIndex = strategiesQueueIndexes.find(
            (queueIndex) =>
                queueIndex.address.toLowerCase() === address.toLowerCase()
        );
        const healthCheckInfo = healthCheckMap.get(address);
        const withdrawalQueueIndex =
            strategyWithdrawalQueueIndex === undefined
                ? -1
                : strategyWithdrawalQueueIndex.queueIndex;
        return {
            ...mappedVaultStratInfo,
            ...mappedStrat,
            ...healthCheckInfo,
            address,
            params: mappedStratParams,
            withdrawalQueueIndex,
        };
    });
};

export type StrategyHealthCheck = {
    id: string;
    healthCheck: string | null;
    doHealthCheck: boolean;
};

type StrategyHealthCheckGraphResult = {
    data: {
        strategies: [
            {
                id: string;
                doHealthCheck: boolean;
                healthCheck: string;
            }
        ];
    };
};

export const getHealthCheckForStrategy = async (
    strategy: string
): Promise<StrategyHealthCheck> => {
    if (!strategy || strategy === '') {
        throw new Error(
            'Error: getHealthCheckForStrategy expected valid strategy address'
        );
    }
    const reportResults: StrategyHealthCheckGraphResult = await querySubgraphData(
        buildHealthCheckQuery(strategy.toLowerCase())
    );
    const hasData =
        reportResults.data &&
        reportResults.data.strategies &&
        reportResults.data.strategies.length > 0;

    const healthCheckInfo: StrategyHealthCheck = {
        doHealthCheck: false,
        healthCheck: null,
        id: strategy,
    };
    if (hasData) {
        const strategyInfo = reportResults.data.strategies[0];
        healthCheckInfo.doHealthCheck = strategyInfo.doHealthCheck;
        healthCheckInfo.healthCheck = strategyInfo.healthCheck;
    }
    return healthCheckInfo;
};

export const getHealthCheckForAllStrategies = async (
    allStratAddresses: string[]
): Promise<StrategyHealthCheck[]> => {
    if (!allStratAddresses || allStratAddresses.length === 0) {
        throw new Error(
            'Error: getHealthCheckForAllStrategies expected valid strategy addresses array'
        );
    }
    const healthCheckInfos: StrategyHealthCheck[] = [];
    for (
        let bigIndex = 0;
        bigIndex <= allStratAddresses.length / 100;
        bigIndex++
    ) {
        let addressArrayFormatted = '[';
        for (
            let index = 100 * bigIndex;
            index < allStratAddresses.length && index < (bigIndex + 1) * 100;
            index++
        ) {
            addressArrayFormatted += '"' + allStratAddresses[index] + '"';
            if (
                index < allStratAddresses.length - 1 &&
                index < (bigIndex + 1) * 100
            ) {
                addressArrayFormatted += ',';
            }
        }
        addressArrayFormatted += ']';
        const healthCheckResults: StrategyHealthCheckGraphResult = await querySubgraphData(
            buildAllHealthCheckQuery(addressArrayFormatted)
        );
        const hasData =
            healthCheckResults.data &&
            healthCheckResults.data.strategies &&
            healthCheckResults.data.strategies.length > 0;

        if (hasData) {
            healthCheckResults.data.strategies.map((strategy) => {
                healthCheckInfos.push({
                    doHealthCheck: strategy.doHealthCheck,
                    healthCheck: strategy.healthCheck,
                    id: strategy.id,
                });
            });
        }
    }

    return healthCheckInfos;
};

const innerGetStrategies = async (addresses: string[]): Promise<Strategy[]> => {
    if (addresses.length === 0) {
        throw new Error('Error: expect a valid strategy address');
    }

    addresses.forEach((address) => {
        if (!address || !utils.isAddress(address)) {
            throw new Error('Error: expect a valid strategy address');
        }
    });

    const provider = getEthersDefaultProvider();

    const multicall = new Multicall({ ethersProvider: provider });

    // do call to strategy apiVersion and vault
    const stratCalls: ContractCallContext[] = buildViewMethodsCall(addresses);

    const resultsViewMethods: ContractCallResults = await multicall.call(
        stratCalls
    );
    const vaultMap = new Map<string, VaultVersionInfo>();
    const strategyMap = new Map<string, string>();

    addresses.forEach((address) => {
        const stratData = resultsViewMethods.results[address];
        const mappedStrat: any = mapContractCalls(stratData);
        strategyMap.set(address, mappedStrat.vault);
        vaultMap.set(mappedStrat.vault, {
            apiVersion: mappedStrat.apiVersion,
            want: mappedStrat.want,
        });
    });

    const strategyHealthCheckMap = new Map<string, StrategyHealthCheck>();
    const healthCheckPromisesResult = addresses.map((address) => {
        return getHealthCheckForStrategy(address);
    });
    const healthCheckResult = await Promise.all(healthCheckPromisesResult);
    healthCheckResult.forEach((healthCheckInfo) => {
        strategyHealthCheckMap.set(healthCheckInfo.id, healthCheckInfo);
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
        [], // Strategy Queue Indexes
        strategyMap,
        strategyHealthCheckMap
    );

    return mappedStrategies;
};

export const getStrategies = memoize(innerGetStrategies);
