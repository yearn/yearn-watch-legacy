import { BigNumber } from 'ethers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { Strategy, Vault, VaultApi } from '../types';
import {
    ContractCallContext,
    ContractCallResults,
    Multicall,
} from 'ethereum-multicall';
import { getABI_032 } from './abi';
import { buildStrategyCalls, mapStrategiesCalls } from './strategies';
import {
    createStrategiesHelperCallAssetStrategiesAddresses,
    mapContractCalls,
    mapToStrategyAddressQueueIndex,
} from './commonUtils';
import { getEthersDefaultProvider } from './ethers';
import { getTotalDebtUsage } from './strategyParams';
import { toHumanDateText } from './dateUtils';
import { vaultChecks } from './checks';

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

export const mapVaultDataToVault = async (payload: any): Promise<Vault[]> => {
    const provider = getEthersDefaultProvider();

    const multicall = new Multicall({ ethersProvider: provider });

    const vaultMap = new Map<string, VaultApi>();
    const strategyMap = new Map<string, string>();

    payload.forEach((vault: any) => {
        vaultMap.set(vault.address, vault);
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
        ({ strategies }: any) => {
            const stratAddresses = strategies.map(
                ({ address }: any) => address
            );
            return buildStrategyCalls(stratAddresses, vaultMap, strategyMap);
        }
    );
    const strategiesHelperCallResults: ContractCallResults = await multicall.call(
        createStrategiesHelperCallAssetStrategiesAddresses(payload)
    );
    const results: ContractCallResults = await multicall.call(
        vaultCalls.concat(stratCalls)
    );

    return mapVaultData(
        results,
        strategiesHelperCallResults,
        vaultMap,
        strategyMap
    );
};

const mapVaultData = (
    contractCallsResults: ContractCallResults,
    strategiesHelperCallsResults: ContractCallResults,
    vaultMap: Map<string, VaultApi>,
    strategyMap: Map<string, string>
): Vault[] => {
    const vaults: Vault[] = [];

    vaultMap.forEach((vault, key) => {
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
            strategiesHelperCallsResults
        );

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

        mappedVault.debtUsage = getTotalDebtUsage(mappedStrategies);

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

        vaults.push(
            vaultChecks({
                ...mappedVault,
                ...mappedVaultContractCallsConverted,
                strategies: mappedStrategies,
            })
        );
    });

    return vaults;
};
