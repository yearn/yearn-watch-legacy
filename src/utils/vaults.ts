import { utils } from 'ethers';
import { uniqBy, memoize } from 'lodash';
import BigNumber from 'bignumber.js';
import compareVersions from 'compare-versions';
import { Yearn } from '@yfi/sdk';

import {
    Vault,
    VaultApi,
    VaultVersion,
    VaultData,
    Network,
    NetworkId,
} from '../types';
import { getTokenPrice } from './oracle';
import { BuildGet, VAULTS_ALL, VAULTS_ALL_EXPERIMENTAL } from './apisRequest';
import { DEFAULT_QUERY_PARAM, QueryParam } from '../types';
import { fillVaultData, mapVaultDataToVault } from './vaultDataMapping';
import { amountToMMs, EMPTY_ADDRESS } from './commonUtils';
import { getTvlImpact } from './risk';

// sort in desc by version
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sortVaultsByVersion = (vaults: VaultData[]): any[] => {
    const uniqueVaults = uniqBy(vaults, 'address');
    uniqueVaults.sort((x, y) => {
        const xVersion = x.version || x.apiVersion;
        const yVersion = y.version || y.apiVersion;
        return compareVersions(xVersion || '0.0.0', yVersion || '0.0.0');
    });

    return uniqueVaults.reverse();
};

// this list is for testing or debugging an issue when loading vault data
const FILTERED_VAULTS: Set<string> = new Set(
    [
        // '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
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

export const filterAndMapVaultsData = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    filterList: Set<string> = new Set<string>()
): VaultApi[] => {
    const vaultData: VaultApi[] = data
        .filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (vault: any) =>
                (filterList.size === 0 &&
                    vault.endorsed &&
                    vault.type.toLowerCase() === VaultVersion.V2 &&
                    hasValidVersion(vault) &&
                    !FILTERED_VAULTS.has(vault.address.toLowerCase())) ||
                filterList.has(vault.address.toLowerCase())
        )
        .map(fillVaultData);
    // DEV NOTE: this is a helper method from debug.ts for debugging the data, should do nothing in prod
    // vaultData = debugFilter(vaultData);

    return vaultData;
};

export const getTotalVaults = async (): Promise<number> => {
    const response = await BuildGet(VAULTS_ALL);

    const payload: VaultApi[] = filterAndMapVaultsData(response.data);

    return payload.length;
};

// TODO Refactor this function. Use it in the (network) services.
const _getEndorsedVaults = async (
    allowList: string[] = [],
    queryParams: QueryParam = DEFAULT_QUERY_PARAM
): Promise<Vault[]> => {
    const network = Network.mainnet;
    // accepts non endorsed experimental vaults to access
    const filterList = new Set(allowList.map((addr) => addr.toLowerCase()));
    // TODO Move to a service
    const response = await BuildGet(VAULTS_ALL);
    // DEV NOTE: we need to copy the response.data array since its memoized and we don't want to mutate the original
    const sortedVaultList = sortVaultsByVersion([...response.data]);
    let payload: VaultApi[] = filterAndMapVaultsData(
        sortedVaultList,
        filterList
    );

    if (queryParams.pagination.offset >= payload.length) {
        return [];
    }
    payload = payload.slice(
        Math.max(0, queryParams.pagination.offset),
        Math.min(
            payload.length,
            queryParams.pagination.offset + queryParams.pagination.limit
        )
    );
    const vaults: Vault[] = await mapVaultDataToVault(payload, network);

    return vaults;
};

// TODO Refactor this function. Use it in the (network) services.
const _getExperimentalVaults = async (
    allowList: string[] = [],
    queryParams: QueryParam = DEFAULT_QUERY_PARAM
): Promise<Vault[]> => {
    const network = Network.mainnet;
    const {
        pagination: { offset, limit },
    } = queryParams;
    // accepts non endorsed experimental vaults to access
    const filterList = new Set(allowList.map((addr) => addr.toLowerCase()));

    const response = await BuildGet(VAULTS_ALL_EXPERIMENTAL);
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
    const vaults: Vault[] = await mapVaultDataToVault(payload, network);

    return vaults;
};

export const getVaultsWithPagination = memoize(
    (queryParams: QueryParam = DEFAULT_QUERY_PARAM) =>
        _getEndorsedVaults([], queryParams)
);
export const getEndorsedVaults = memoize(_getEndorsedVaults);

const _getEndorsedOrExperimentalVault = async (
    address: string
): Promise<Vault> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Expected a valid vault address');
    }

    const vaults = await getEndorsedVaults([address]);

    let [foundVault]: Vault[] = vaults.filter(
        (vault) => vault.address.toLowerCase() === address.toLowerCase()
    );
    if (!foundVault) {
        [foundVault] = await _getExperimentalVaults([address]);
    }

    if (!foundVault) {
        throw new Error('Requested address not recognized as a yearn vault');
    }

    return foundVault;
};

/**
 * @dev It tries to find an endorsed vault first. If it is not found, it will try to find it as experimental vault.
 *
 * @dev If vault is not found, it throws an error.
 */
export const getVault = memoize(_getEndorsedOrExperimentalVault);

export const filterStrategiesByHealthCheck = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    network: Network
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredStrategies: any = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vaultData: any[] = data;
    vaultData.forEach((vault) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vault.strategies.forEach((strategy: any) => {
            if (
                strategy.healthCheck === null ||
                strategy.healthCheck.toLowerCase() == EMPTY_ADDRESS ||
                strategy.doHealthCheck === false
            ) {
                filteredStrategies.push({
                    vault: strategy.vault,
                    network,
                    name: strategy.name,
                    address: strategy.address,
                    token: vault.token,
                    activation: Date.parse(strategy.params.activation),
                    activationStr: strategy.params.activation,
                    estimatedTotalAssets: strategy.estimatedTotalAssets,
                });
            }
        });
    });
    const resultStrategiesPromises = filteredStrategies.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (strategy: any): Promise<any> => {
            if (strategy.estimatedTotalAssets) {
                const estimatedTotalAssetsUsdc = await getTokenPrice(
                    strategy.token,
                    strategy.estimatedTotalAssets,
                    network
                );
                const amountInMMs = amountToMMs(estimatedTotalAssetsUsdc);
                return {
                    ...strategy,
                    estimatedTotalAssetsUsdc,
                    estimatedTotalAssetsUsdcNumber: amountInMMs,
                    tvlImpact: getTvlImpact(amountInMMs),
                };
            } else {
                const estimatedTotalAssetsUsdc = new BigNumber(0);
                const amountInMMs = amountToMMs(estimatedTotalAssetsUsdc);
                return {
                    ...strategy,
                    estimatedTotalAssetsUsdc,
                    estimatedTotalAssetsUsdcNumber: amountInMMs,
                    tvlImpact: getTvlImpact(amountInMMs),
                };
            }
        }
    );

    const resultStrategies = await Promise.all(resultStrategiesPromises);

    return resultStrategies;
};

const _getVaultStrategyMetadata = async (
    sdk: Yearn<NetworkId>,
    address: string
) => {
    const result = await sdk.strategies.vaultsStrategiesMetadata([address]);
    const metadata = result[0].strategiesMetadata;
    return metadata;
};

export const getVaultStrategyMetadata = memoize(_getVaultStrategyMetadata);
