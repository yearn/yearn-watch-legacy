import { Vault as VaultSDK } from '@yfi/sdk';
import { BigNumber } from 'ethers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';

import {
    Strategy,
    Vault,
    VaultApi,
    Network,
    StrategyApi,
    VaultVersion,
    VaultData,
} from '../types';
import { buildStrategyCalls, mapStrategiesCalls } from './strategies';
import {
    createStrategiesHelperCallAssetStrategiesAddresses,
    mapContractCalls,
    mapToStrategyAddressQueueIndex,
} from './commonUtils';
import { getMulticallContract } from './multicall';
import { getTotalDebtUsage } from './strategyParams';
import { toHumanDateText } from './dateUtils';
import { vaultChecks } from './checks';
import { getABI_032 } from './contracts/ABI';
import getNetworkConfig from './config';

const VAULT_VIEW_METHODS = [
    'management',
    'managementFee',
    'performanceFee',
    'governance',
    'guardian',
    'depositLimit',
    'totalAssets',
    'debtRatio',
    'totalDebt',
    'lastReport',
    'rewards',
];

export const mapVaultApiDataToVault = async (
    vaults: VaultApi[],
    network: Network
): Promise<Vault[]> => {
    const multicall = getMulticallContract(network);

    const vaultMap = new Map<string, VaultApi>();
    const strategyMap = new Map<string, string>();

    vaults.forEach((vault: VaultApi) => {
        vaultMap.set(vault.address, vault);
        vault.strategies.forEach((strat: StrategyApi) =>
            strategyMap.set(strat.address, vault.address)
        );
    });

    const vaultCalls: ContractCallContext[] = vaults.map(
        ({ address }: VaultApi) => {
            const calls = VAULT_VIEW_METHODS.map((method) => ({
                reference: method,
                methodName: method,
                methodParameters: [],
            }));
            return {
                reference: address,
                contractAddress: address,
                abi: getABI_032(), // only this abi version has the vault view methods
                calls,
            };
        }
    );
    const stratCalls: ContractCallContext[] = vaults.flatMap(
        ({ strategies }: VaultApi) => {
            const stratAddresses = strategies.map(
                ({ address }: StrategyApi) => address
            );
            return buildStrategyCalls(stratAddresses, vaultMap, strategyMap);
        }
    );

    const strategiesHelperCallResults: ContractCallResults =
        await multicall.call(
            createStrategiesHelperCallAssetStrategiesAddresses(vaults, network)
        );

    const results: ContractCallResults = await multicall.call(
        vaultCalls.concat(stratCalls)
    );

    return mapVaultData(
        results,
        vaultMap,
        strategyMap,
        network,
        strategiesHelperCallResults
    );
};

export const mapVaultSdkToVaultApi = (vaults: VaultSDK[]): VaultApi[] => {
    const results: VaultApi[] = vaults.map((result: VaultSDK) => {
        const strategies: StrategyApi[] =
            result.metadata.strategies?.strategiesMetadata.map((strat) => ({
                name: strat.name,
                address: strat.address,
            })) || [];
        return {
            ...result,
            decimals: parseInt(result.decimals, 10),
            apiVersion: result.version,
            endorsed: true,
            icon: result.metadata.displayIcon,
            want: result.token,
            token: {
                address: result.tokenId,
                decimals: parseInt(result.decimals),
                symbol: result.metadata.displayName,
                name: result.metadata.displayName,
            },
            type: VaultVersion.V2,
            emergencyShutdown: result.metadata.emergencyShutdown,
            tvl: {
                totalAssets: BigNumber.from(result.metadata.totalAssets),
            },
            strategies,
        };
    });

    return results;
};

export const filterVaultApiData = (
    data: VaultApi[],
    filterList: Set<string> = new Set<string>()
): VaultApi[] => {
    const vaultData: VaultApi[] = data.filter(
        (vault: VaultApi) =>
            (filterList.size === 0 &&
                vault.endorsed &&
                vault.type.toLowerCase() === VaultVersion.V2 &&
                vaultHasValidVersion(vault)) ||
            filterList.has(vault.address.toLowerCase())
    );
    return vaultData;
};

export const fillVaultApiData = (data: VaultApi[]): VaultApi[] => {
    return data.map(fillVaultData);
};

const vaultHasValidVersion = (vault: VaultData): boolean => {
    if (vault.apiVersion && vault.apiVersion.startsWith('0.2')) {
        return false;
    }

    if (vault.version && vault.version.startsWith('0.2')) {
        return false;
    }

    return true;
};

const mapVaultData = (
    contractCallsResults: ContractCallResults,
    vaultMap: Map<string, VaultApi>,
    strategyMap: Map<string, string>,
    network: Network,
    strategiesHelperCallsResults?: ContractCallResults
): Vault[] => {
    const vaults: Vault[] = [];
    vaultMap.forEach((vault) => {
        const {
            address,
            apiVersion,
            symbol,
            name,
            token,
            icon,
            emergencyShutdown,
            strategies,
        } = vault;

        const strategiesQueueIndexes = mapToStrategyAddressQueueIndex(
            address,
            network,
            strategiesHelperCallsResults
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedVault: any = {
            address,
            apiVersion,
            symbol,
            name,
            token,
            icon,
            emergencyShutdown,
        };

        const stratAddresses = strategies.map(({ address }) => address);
        const mappedStrategies: Strategy[] = mapStrategiesCalls(
            stratAddresses,
            contractCallsResults,
            strategiesQueueIndexes,
            strategyMap
        );

        const sortedStrategies: Strategy[] = mappedStrategies.sort(function (
            a: Strategy,
            b: Strategy
        ) {
            if (a.withdrawalQueueIndex === -1) {
                // put "a" last (out of queue)
                return 1;
            } else if (b.withdrawalQueueIndex === -1) {
                // put "b" last (out of queue)
                return -1;
            } else {
                // numerical sort order (0, 1, 2, etc.)
                return a.withdrawalQueueIndex - b.withdrawalQueueIndex;
            }
        });

        mappedVault.debtUsage = getTotalDebtUsage(sortedStrategies);

        const vaultData = contractCallsResults.results[address];

        const mappedVaultContractCalls = mapContractCalls(vaultData);
        const mappedVaultContractCallsConverted = {
            ...mappedVaultContractCalls,
            managementFee: parseInt(mappedVaultContractCalls.managementFee),
            performanceFee: parseInt(mappedVaultContractCalls.performanceFee),
        };

        mappedVault.lastReportText = toHumanDateText(
            mappedVaultContractCalls.lastReport
        );
        const networkConfig = getNetworkConfig(network);
        vaults.push(
            vaultChecks(
                {
                    ...mappedVault,
                    ...mappedVaultContractCallsConverted,
                    strategies: sortedStrategies,
                },
                networkConfig
            )
        );
    });

    return vaults;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fillVaultData = (vault: any): VaultApi => {
    return {
        ...vault,
        apiVersion: vault.version,
        name: vault.display_name,
        emergencyShutdown: vault.emergency_shutdown,
        tvl: {
            totalAssets: BigNumber.from(
                new BigNumberJS(vault.tvl.total_assets.toString()).toFixed(0)
            ),
        },
    } as VaultApi;
};
