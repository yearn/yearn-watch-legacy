
/* eslint-disable @typescript-eslint/no-explicit-any */
import { utils } from 'ethers';
import { uniqBy, memoize, values } from 'lodash';
import BigNumber from 'bignumber.js';
import compareVersions from 'compare-versions';

import { VaultApi, Network, NetworkId, Vault } from '../types';
import { getTokenPrice } from './oracle';
import { amountToMMs, EMPTY_ADDRESS } from './commonUtils';
import { getTvlImpact } from './risk';
import { Yearn } from '@yfi/sdk';
import { GenericListItem } from '../components/app';

export const sortVaultsByVersion = (
    vaults: VaultApi[],
    desc = true
): VaultApi[] => {
    const uniqueVaults = uniqBy(vaults, 'address');
    uniqueVaults.sort((x, y) => {
        const versions = compareVersions(
            x.apiVersion || '0.0.0',
            y.apiVersion || '0.0.0'
        );
        if (versions !== 0) {
            return versions;
        } else {
            return x.strategies.length - y.strategies.length;
        }
    });

    if (desc) {
        return uniqueVaults.reverse();
    }
    return uniqueVaults;
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

// Functions with more than 2 parameters need a custom key defined for memoization to work correctly.
export const getEndorsedVaults = memoize(_getEndorsedVaults, (...args) =>
    values(args).join('_')
);

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
    vaults: Vault[],
    network: Network
): Promise<GenericListItem[]> => {
    const filteredStrategies: any[] = [];
    vaults.forEach((vault) => {
        vault.strategies.forEach((strategy) => {
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
        async (strategy) => {
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

// Functions with more than 2 parameters need a custom key defined for memoization to work correctly.
export const getVaultStrategyMetadata = memoize(
    _getVaultStrategyMetadata,
    (...args) => values(args).join('_')
);
