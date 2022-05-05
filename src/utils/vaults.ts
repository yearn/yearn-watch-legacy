/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const filterStrategiesByKeepCSV = async (
    vaults: Vault[],
    network: Network,
    csvStrategies: string[]
): Promise<GenericListItem[]> => {
    const filteredStrategies: any[] = [];
    vaults.forEach((vault) => {
        vault.strategies.forEach((strategy) => {
            if (csvStrategies.includes(strategy.address)) {
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
