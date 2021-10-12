import { Vault as VaultSDK } from '@yfi/sdk';
import { BigNumber } from 'ethers';
import { uniqBy } from 'lodash';
import compareVersions from 'compare-versions';
import { VaultApi, VaultVersion, StrategyApi, VaultData } from '../../types';

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
