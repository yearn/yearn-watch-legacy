import { JsonRpcProvider } from '@ethersproject/providers';
import { StrategyMetadata, Yearn } from '@yfi/sdk';
import { isAddress } from 'ethers/lib/utils';
import { memoize } from 'lodash';
import {
    DEFAULT_QUERY_PARAM,
    Network,
    NetworkId,
    QueryParam,
    StrategyApi,
    Vault,
    VaultApi,
} from '../../types';
import { querySubgraphData } from '../../utils/apisRequest';
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
import getNetworkConfig from '../../utils/config';

type StrategyBasicData = {
    [vault: string]: StrategyApi[];
};

type VaultGQLResult = {
    id: string;
    strategies: StrategyApi[];
};

type GQLResult = {
    data: {
        vaults: VaultGQLResult[];
    };
};

export abstract class VaultService {
    public network: Network;
    public networkId: NetworkId;
    protected provider: JsonRpcProvider;
    protected sdk: Yearn<NetworkId>;
    protected apiVaults: VaultApi[] | undefined;

    constructor(network: Network, networkId: NetworkId) {
        this.network = network;
        this.networkId = networkId;

        const mainnetConfig = getNetworkConfig(Network.mainnet);
        const fantomConfig = getNetworkConfig(Network.fantom);
        const arbitrumConfig = getNetworkConfig(Network.arbitrum);
        const provider = getEthersDefaultProvider(this.network);
        this.provider = provider;
        this.sdk = new Yearn(this.networkId, {
            provider,
            subgraph: {
                mainnetSubgraphEndpoint: mainnetConfig.subgraphUrl,
                fantomSubgraphEndpoint: fantomConfig.subgraphUrl,
                arbitrumSubgraphEndpoint: arbitrumConfig.subgraphUrl,
            },
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

        const vaults = await this.getVaults(
            [address],
            DEFAULT_QUERY_PARAM,
            false,
            [address]
        );
        if (vaults.length > 0) {
            return vaults[0];
        }

        // Try experimental vaults if not found in endorsed
        const experimentalVaults = await this.getVaults(
            [address],
            DEFAULT_QUERY_PARAM,
            true,
            [address]
        );
        if (experimentalVaults.length > 0) {
            return experimentalVaults[0];
        }
        throw new Error('Address not recognized as a Yearn vault');
    };

    public getVaults = async (
        allowList: string[] = [],
        queryParams: QueryParam = DEFAULT_QUERY_PARAM,
        experimental = false,
        addresses?: string[]
    ): Promise<Vault[]> => {
        const apiVaults = await memoize(() =>
            this.getApiVaults(experimental, addresses)
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

        // TODO: this is mainly slow because we need to do a multicall to get
        // healthcheck statuses for all strategies, if this information is added
        // to the subgraph, we can optimize this to be much faster by only
        // performing multicalls if a user expands the vault card
        const vaults = await mapVaultApiDataToVault(
            filteredVaults,
            this.network
        );
        return vaults;
    };

    public getNumVaults = async (experimental = false): Promise<number> => {
        const apiVaults = await memoize(() =>
            this.getApiVaults(experimental)
        )();
        return apiVaults.length;
    };

    public getVaultStrategyMetadata = async (
        vaultAddress: string
    ): Promise<StrategyMetadata[]> => {
        return getVaultStrategyMetadata(this.sdk, vaultAddress);
    };

    protected getApiVaults = async (
        experimental = false,
        addresses?: string[]
    ): Promise<VaultApi[]> => {
        let vaults: VaultApi[];
        if (experimental) {
            vaults = await memoize(this.fetchExperimentalVaultData)();
        } else {
            vaults = await memoize(() => this.fetchVaultData(addresses))();
        }

        // The SDK may not return all strategies, so we need to query the subgraph
        const strategiesByVaults = await this.getStrategiesByVaults(
            vaults.map((vault) => vault.address)
        );
        const mergedVaults = vaults.map((vault) => ({
            ...vault,
            strategies: strategiesByVaults[vault.address.toLowerCase()],
        }));
        const sortedApiVaults = sortVaultsByVersion(mergedVaults);
        return sortedApiVaults;
    };

    protected fetchVaultData = async (
        addresses?: string[]
    ): Promise<VaultApi[]> => {
        const vaults = await this.sdk.vaults.get(addresses);
        return mapVaultSdkToVaultApi(vaults);
    };

    protected fetchExperimentalVaultData = async (): Promise<VaultApi[]> => {
        return [];
    };

    protected getStrategiesByVaults = async (
        vaults: string[]
    ): Promise<StrategyBasicData> => {
        if (!vaults || vaults.length === 0) {
            return {};
        }

        const vaultsLower = vaults.map((vault) => vault.toLowerCase());
        const query = `
            {
                vaults(where:{
                  id_in: ${JSON.stringify(vaultsLower)}
                }){
                    id
                    strategies {
                        name
                        address
                    }
                }
            }
        `;

        const results: GQLResult = await querySubgraphData(query, this.network);
        const result: StrategyBasicData = {};
        results.data.vaults.forEach(({ id, strategies }) => {
            result[id] = strategies;
        });
        return result;
    };
}
