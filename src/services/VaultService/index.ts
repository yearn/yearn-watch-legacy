import { JsonRpcProvider } from '@ethersproject/providers';
import { StrategyMetadata, Yearn } from '@yfi/sdk';
import { isAddress } from 'ethers/lib/utils';
import { memoize } from 'lodash';
import {
    DEFAULT_QUERY_PARAM,
    Network,
    NetworkId,
    QueryParam,
    Vault,
    VaultApi,
} from '../../types';
import { getEthersDefaultProvider } from '../../utils/ethers';
import {
    filterVaultApiData,
    mapVaultApiDataToVault,
    mapVaultSdkToVaultApi,
} from '../../utils/vaultMappings';
import {
    getVaultStrategyMetadata,
    sortVaultsByVersion,
} from '../../utils/vaults';

export abstract class VaultService {
    public network: Network;
    public networkId: NetworkId;
    protected provider: JsonRpcProvider;
    protected sdk: Yearn<NetworkId>;
    protected apiVaults: VaultApi[] | undefined;

    constructor(network: Network, networkId: NetworkId) {
        this.network = network;
        this.networkId = networkId;

        const provider = getEthersDefaultProvider(this.network);
        this.provider = provider;
        this.sdk = new Yearn(this.networkId, {
            provider,
            cache: { useCache: false },
        });
    }

    public getNetwork = (): Network => {
        return this.network;
    };

    public getNetworkId = (): NetworkId => {
        return this.networkId;
    };

    public getVault = async (address: string): Promise<Vault> => {
        if (!address || !isAddress(address)) {
            throw new Error('Invalid vault address');
        }

        const vaults = await this.getVaults([address]);
        if (vaults.length > 0) {
            return vaults[0];
        }

        // Try experimental vaults if not found in endorsed
        const experimentalVaults = await this.getVaults(
            [address],
            DEFAULT_QUERY_PARAM,
            true
        );
        if (experimentalVaults.length > 0) {
            return experimentalVaults[0];
        }
        throw new Error('Address not recognized as a Yearn vault');
    };

    public getVaults = async (
        allowList: string[] = [],
        queryParams: QueryParam = DEFAULT_QUERY_PARAM,
        experimental = false
    ): Promise<Vault[]> => {
        const apiVaults = await memoize(() =>
            this.getApiVaults(experimental)
        )();
        const filterList = new Set(allowList.map((addr) => addr.toLowerCase()));

        let filteredVaults = filterVaultApiData(apiVaults, filterList);
        if (queryParams.pagination.offset >= filteredVaults.length) {
            return [];
        }
        filteredVaults = filteredVaults.slice(
            Math.max(0, queryParams.pagination.offset),
            Math.min(
                filteredVaults.length,
                queryParams.pagination.offset + queryParams.pagination.limit
            )
        );
        const vaults = await mapVaultApiDataToVault(
            filteredVaults,
            this.network
        );
        return vaults;
    };

    public getVaultStrategyMetadata = async (
        vaultAddress: string
    ): Promise<StrategyMetadata[]> => {
        return getVaultStrategyMetadata(this.sdk, vaultAddress);
    };

    protected getApiVaults = async (
        experimental = false
    ): Promise<VaultApi[]> => {
        let vaults: VaultApi[];
        if (experimental) {
            vaults = await memoize(this.fetchExperimentalVaultData)();
        } else {
            vaults = await memoize(this.fetchVaultData)();
        }
        const sortedApiVaults = sortVaultsByVersion(vaults);
        return sortedApiVaults;
    };

    protected fetchVaultData = async (): Promise<VaultApi[]> => {
        const vaults = await this.sdk.vaults.get();
        return mapVaultSdkToVaultApi(vaults);
    };

    protected fetchExperimentalVaultData = async (): Promise<VaultApi[]> => {
        return [];
    };
}
