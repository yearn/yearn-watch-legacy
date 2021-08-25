import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
} from 'ethereum-multicall';
import { BigNumber, utils } from 'ethers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { get, memoize } from 'lodash';
import compareVersions from 'compare-versions';
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
import { mapStrategiesCalls, buildStrategyCalls } from './strategies';
import { getTotalDebtUsage } from './strategyParams';

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

interface VaultData {
    apiVersion: string;
    version?: string;
}

// sort in desc by version
export const sortVaultsByVersion = (vaults: VaultData[]): any[] => {
    vaults.sort((x, y) => {
        const xVersion = x.version || x.apiVersion;
        const yVersion = y.version || y.apiVersion;
        return compareVersions(xVersion || '0.0.0', yVersion || '0.0.0');
    });

    return vaults.reverse();
};

// this list is for testing or debugging an issue when loading vault data
const FILTERED_VAULTS: Set<string> = new Set(
    [
        // '0xe2F6b9773BF3A015E2aA70741Bde1498bdB9425b',
        // '0xBFa4D8AA6d8a379aBFe7793399D3DdaCC5bBECBB',
    ].map((addr: string) => addr.toLowerCase())
);

const hasValidVersion = (vault: VaultData): boolean => {
    if (vault.apiVersion && vault.apiVersion.startsWith('0.2')) {
        return false;
    }

    if (vault.version && vault.version.startsWith('0.2')) {
        return false;
    }

    return true;
};

const filterAndMapVaultsData = (
    data: any,
    filterList: Set<string> = new Set<string>()
): VaultApi[] => {
    const vaultData: VaultApi[] = data
        .filter(
            (vault: any) =>
                (filterList.size === 0 &&
                    vault.endorsed &&
                    vault.type.toLowerCase() === VaultVersion.V2 &&
                    hasValidVersion(vault) &&
                    !FILTERED_VAULTS.has(vault.address.toLowerCase())) ||
                filterList.has(vault.address.toLowerCase())
        )
        .map((vault: any) => {
            return {
                ...vault,
                apiVersion: vault.version,
                name: vault.display_name,
                emergencyShutdown: vault.emergency_shutdown,
                tvl: {
                    totalAssets: BigNumber.from(
                        new BigNumberJS(
                            vault.tvl.total_assets.toString()
                        ).toFixed(0)
                    ),
                },
            } as VaultApi;
        });
    // DEV NOTE: this is a helper method from debug.ts for debugging the data, should do nothing in prod
    // vaultData = debugFilter(vaultData);

    return vaultData;
};

const vaultsAreMissing = (
    vaultMap: Map<string, VaultApi>,
    additional: Set<string>
): boolean => {
    let missing = false;
    additional.forEach((vaultAddr) => {
        if (vaultMap.has(vaultAddr.toLowerCase()) === false) {
            missing = true;
        }
    });

    return missing;
};

export const getTotalVaults = async (): Promise<number> => {
    const response = await BuildGet('/vaults/all');

    const payload: VaultApi[] = filterAndMapVaultsData(response.data);

    return payload.length;
};

const _internalGetVaults = async (
    allowList: string[] = [],
    offset = 0,
    limit = 200
): Promise<Vault[]> => {
    const provider = getEthersDefaultProvider();

    const multicall = new Multicall({ ethersProvider: provider });
    // accepts non endorsed experimental vaults to access
    const filterList = new Set(allowList.map((addr) => addr.toLowerCase()));

    const response = await BuildGet('/vaults/all');
    const sortedVaultList = sortVaultsByVersion(response.data);
    let payload: VaultApi[] = filterAndMapVaultsData(
        sortedVaultList,
        filterList
    );

    if (offset >= payload.length) {
        return [];
    }
    payload = payload.slice(
        Math.max(0, offset),
        Math.min(payload.length, offset + limit)
    );
    const vaultMap = new Map<string, VaultApi>();
    const strategyMap = new Map<string, string>();

    payload.forEach((vault) => {
        vaultMap.set(vault.address, vault);
        vault.strategies.forEach((strat) =>
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
export const getVaultsWithPagination = memoize((offset = 0, limit = 100) =>
    _internalGetVaults([], offset, limit)
);
export const getVaults = memoize(_internalGetVaults);

const _getVault = async (address: string): Promise<Vault> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Expected a valid vault address');
    }

    const vaults = await getVaults([address]);

    const [foundVault]: Vault[] = vaults.filter(
        (vault) => vault.address.toLowerCase() === address.toLowerCase()
    );

    if (!foundVault) {
        throw new Error('Requested address not recognized as a yearn vault');
    }

    return foundVault;
};

export const getVault = memoize(_getVault);

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
