import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
} from 'ethereum-multicall';
import { utils } from 'ethers';
import { get, memoize } from 'lodash';
import { getEthersDefaultProvider } from './ethers';
import { Vault, VaultApi, VaultVersion, Strategy } from '../types';
import { BuildGet } from './apisRequest';
import { vaultChecks } from './checks';
import {
    mapContractCalls,
    createStrategiesHelperCallAssetStrategiesAddresses,
    mapToStrategyAddressQueueIndex,
} from './commonUtils';
import { toHumanDateText } from './dateUtils';
import { getABI_032 } from './abi';
import {
    mapStrategiesCalls,
    buildStrategyCalls,
    StrategyHealthCheck,
    getHealthCheckForStrategy,
    getHealthCheckForAllStrategies,
} from './strategies';
import { getTotalDebtUsage } from './strategyParams';

const VAULT_VIEW_METHODS = [
    'management',
    'governance',
    'guardian',
    'depositLimit',
    'totalAssets',
    'debtRatio',
    'totalDebt',
    'lastReport',
    'rewards',
];

const internalGetVaults = async (
    allowList: string[] = []
): Promise<Vault[]> => {
    const provider = getEthersDefaultProvider();

    const multicall = new Multicall({ ethersProvider: provider });
    // accepts non endorsed experimental vaults to access
    const additional = new Set(allowList.map((addr) => addr.toLowerCase()));

    try {
        const response = await BuildGet('/all');
        let payload = response.data as VaultApi[];
        console.log('payload', payload);
        payload = payload.filter(
            (vault) =>
                (vault.endorsed && vault.type === VaultVersion.V2) ||
                additional.has(vault.address.toLowerCase())
        );

        const vaultMap = new Map<string, VaultApi>();
        const strategyMap = new Map<string, string>();

        payload.forEach((vault) => {
            vaultMap.set(vault.address, vault);
            vault.strategies.forEach((strat) =>
                strategyMap.set(strat.address, vault.address)
            );
        });

        const vaultCalls: ContractCallContext[] = payload.map(({ address }) => {
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
        });
        const stratCalls: ContractCallContext[] = payload.flatMap(
            ({ strategies }) => {
                const stratAddresses = strategies.map(({ address }) => address);
                return buildStrategyCalls(
                    stratAddresses,
                    vaultMap,
                    strategyMap
                );
            }
        );
        const strategiesHelperCallResults: ContractCallResults = await multicall.call(
            createStrategiesHelperCallAssetStrategiesAddresses(payload)
        );
        const results: ContractCallResults = await multicall.call(
            vaultCalls.concat(stratCalls)
        );

        return await mapVaultData(
            results,
            strategiesHelperCallResults,
            vaultMap,
            strategyMap
        );
    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
};

export const getVaults = memoize(internalGetVaults);

const _getVault = async (address: string): Promise<Vault> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid vault address');
    }

    const vaults = await getVaults([address]);

    const [foundVault]: Vault[] = vaults.filter(
        (vault) => vault.address.toLowerCase() === address.toLowerCase()
    );

    if (!foundVault) {
        throw new Error('Error: vault not recognized as a yearn vault');
    }

    return foundVault;
};

export const getVault = memoize(_getVault);

const mapVaultData = async (
    contractCallsResults: ContractCallResults,
    strategiesHelperCallsResults: ContractCallResults,
    vaultMap: Map<string, VaultApi>,
    strategyMap: Map<string, string>
): Promise<Vault[]> => {
    const vaults: Vault[] = [];
    const allStratAddresses: string[] = [];

    for (const vault of Array.from(vaultMap.values())) {
        const { strategies } = vault;
        strategies.map(({ address }) =>
            allStratAddresses.push(address.toLowerCase())
        );
    }

    const allHealthCheckInfos: StrategyHealthCheck[] = await getHealthCheckForAllStrategies(
        allStratAddresses
    );

    for (const vault of Array.from(vaultMap.values())) {
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
            managementFee: get(
                vault,
                'fees.general.managementFee',
                'unknown'
            ) as string,
            performanceFee: get(
                vault,
                'fees.general.performanceFee',
                'unknown'
            ) as string,
            // totalAssets: get(vault, 'tvl.value', 'unknown') as string,
        };

        const strategyHealthCheckMap = new Map<string, StrategyHealthCheck>();
        const stratAddresses = strategies.map(({ address }) => address);
        stratAddresses.map((address) => {
            const healthCheckInfo = allHealthCheckInfos.find(
                (healthInfo) => healthInfo.id === address
            );
            strategyHealthCheckMap.set(
                address,
                healthCheckInfo
                    ? healthCheckInfo
                    : {
                          doHealthCheck: false,
                          healthCheck: null,
                          id: address,
                      }
            );
        });
        const mappedStrategies: Strategy[] = mapStrategiesCalls(
            stratAddresses,
            contractCallsResults,
            strategiesQueueIndexes,
            strategyMap,
            strategyHealthCheckMap
        );

        mappedVault.debtUsage = getTotalDebtUsage(mappedStrategies);

        const vaultData = contractCallsResults.results[address];

        const mappedVaultContractCalls = mapContractCalls(vaultData);

        mappedVault.lastReportText = toHumanDateText(
            mappedVaultContractCalls.lastReport
        );

        vaults.push(
            vaultChecks({
                ...mappedVault,
                ...mappedVaultContractCalls,
                strategies: mappedStrategies,
            })
        );
    }

    return vaults;
};
