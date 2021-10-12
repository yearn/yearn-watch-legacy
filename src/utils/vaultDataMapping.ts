import { BigNumber } from 'ethers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { Strategy, Vault, VaultApi, Network } from '../types';
import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fillVaultData = (vault: any): VaultApi => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapVaultDataToVault = async (
    payload: VaultApi[],
    network: Network
): Promise<Vault[]> => {
    const multicall = getMulticallContract(network);

    const vaultMap = new Map<string, VaultApi>();
    const strategyMap = new Map<string, string>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.forEach((vault: any) => {
        vaultMap.set(vault.address, vault);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vault.strategies.forEach((strat: any) =>
            strategyMap.set(strat.address, vault.address)
        );
    });

    // TODO: uncomment and improve this
    // // check if we have missing vaults from requested
    // if (vaultsAreMissing(vaultMap, additional)) {
    //     // need to fetch experimental data
    //     console.log('...fetching experimental vaults data');
    //     const response = await BuildGetExperimental('/vaults/all');
    //     const experimentalPayload: VaultApi[] = filterAndMapVaultsData(
    //         response.data,
    //         additional
    //     );
    //     experimentalPayload.forEach((vault) => {
    //         vaultMap.set(vault.address, vault);
    //         vault.strategies.forEach((strat) =>
    //             strategyMap.set(strat.address, vault.address)
    //         );
    //     });
    // }

    const vaultCalls: ContractCallContext[] = payload.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ address }: any) => {
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
    const stratCalls: ContractCallContext[] = payload.flatMap(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ strategies }: any) => {
            const stratAddresses = strategies.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ({ address }: any) => address
            );
            return buildStrategyCalls(stratAddresses, vaultMap, strategyMap);
        }
    );

    const strategiesHelperCallResults: ContractCallResults = await multicall.call(
        createStrategiesHelperCallAssetStrategiesAddresses(payload, network)
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
