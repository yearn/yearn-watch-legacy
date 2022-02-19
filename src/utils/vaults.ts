/* eslint-disable @typescript-eslint/no-explicit-any */
import { uniqBy, memoize } from 'lodash';
import BigNumber from 'bignumber.js';
import compareVersions from 'compare-versions';

import { VaultApi, Network, NetworkId } from '../types';
import { getTokenPrice } from './oracle';
import { amountToMMs, EMPTY_ADDRESS } from './commonUtils';
import { getTvlImpact } from './risk';
import { Yearn } from '@yfi/sdk';

export const sortVaultsByVersion = (
    vaults: VaultApi[],
    desc = true
): VaultApi[] => {
    const uniqueVaults = uniqBy(vaults, 'address');
    uniqueVaults.sort((x, y) => {
        return compareVersions(
            x.apiVersion || '0.0.0',
            y.apiVersion || '0.0.0'
        );
    });

    if (desc) {
        return uniqueVaults.reverse();
    }
    return uniqueVaults;
};

export const filterStrategiesByHealthCheck = async (
    data: any,
    network: Network
): Promise<any[]> => {
    const filteredStrategies: any = [];
    const vaultData: any[] = data;
    vaultData.forEach((vault) => {
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
