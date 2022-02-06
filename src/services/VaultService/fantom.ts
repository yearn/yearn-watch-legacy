import { Yearn } from '@yfi/sdk';
import { utils } from 'ethers';
import memoize from 'lodash/memoize';
import { JsonRpcProvider } from '@ethersproject/providers';
import { getEthersDefaultProvider } from '../../utils/ethers';
import { mapVaultDataToVault } from '../../utils/vaultDataMapping';
import { querySubgraphData } from '../../utils/apisRequest';
import { mapVaultSdkToVaultApi, sortVaultsByVersion } from './mappings';

import {
    NetworkId,
    Network,
    VaultService,
    Vault,
    VaultApi,
    StrategyApi,
    QueryParam,
    DEFAULT_QUERY_PARAM,
    StrategyMetaData,
} from '../../types';

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

export default class FantomService implements VaultService {
    private provider: JsonRpcProvider;
    private sdk: Yearn<NetworkId.fantom>;
    constructor() {
        const provider = getEthersDefaultProvider(this.getNetwork());
        this.provider = provider;
        this.sdk = new Yearn(this.getNetworkId(), {
            provider,
            cache: { useCache: false },
        });
    }

    public getNetwork = (): Network => {
        return Network.fantom;
    };

    public getNetworkId = (): NetworkId => {
        return NetworkId.fantom;
    };

    public getTotalVaults = async (): Promise<number> => {
        const vaults = await this._getVaults();
        return vaults.length;
    };

    public getVaultsWithPagination = memoize(
        (queryParams: QueryParam = DEFAULT_QUERY_PARAM) =>
            this.getEndorsedVaults([], queryParams)
    );

    public getVault = async (address: string): Promise<Vault> => {
        if (!address || !utils.isAddress(address)) {
            throw new Error('Expected a valid vault address');
        }

        const vaults = await this.getEndorsedVaults([address]);

        const [foundVault]: Vault[] = vaults.filter(
            (vault) => vault.address.toLowerCase() === address.toLowerCase()
        );

        if (!foundVault) {
            throw new Error(
                'Requested address not recognized as a yearn vault'
            );
        }

        return foundVault;
    };

    // TODO: implement filters and query params
    public getEndorsedVaults = async (
        allowList: string[] = [],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        queryParams?: QueryParam
    ): Promise<Vault[]> => {
        const results = await this._getVaults();
        const filterList = new Set(allowList.map((addr) => addr.toLowerCase()));
        const filteredVaults = results.filter(
            (vault) =>
                filterList.size === 0 ||
                filterList.has(vault.address.toLowerCase())
        );

        const vaultAddresses = filteredVaults.map((vault) =>
            vault.address.toLowerCase()
        );

        const strategyResultsByVaults = await this._getStrategiesByVaults(
            vaultAddresses
        );

        const mergedVaults = filteredVaults.map((vault) => ({
            ...vault,
            strategies: strategyResultsByVaults[vault.address.toLowerCase()],
        }));

        // map strategies to vaults as results
        const vaults = await mapVaultDataToVault(
            mergedVaults,
            this.getNetwork()
        );

        return vaults;
    };

    private _getInnerVaults = async (): Promise<VaultApi[]> => {
        const results = await this.sdk.vaults.get();

        const vaults = mapVaultSdkToVaultApi(results);

        const sortedVaultList = sortVaultsByVersion([...vaults]);

        return sortedVaultList;
    };

    private _getVaults = memoize(this._getInnerVaults);

    private _getInnerStrategiesByVaults = async (
        vaults: string[]
    ): Promise<StrategyBasicData> => {
        if (!vaults || vaults.length === 0) {
            throw new Error(
                'Error: _getInnerStrategiesByVaults expected valid vaults argument'
            );
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

        const results: GQLResult = (await querySubgraphData(
            query,
            this.getNetwork()
        )) as GQLResult;

        const result: StrategyBasicData = {};

        results.data.vaults.forEach(({ id, strategies }) => {
            result[id] = strategies;
        });

        return result;
    };

    private _getStrategiesByVaults = memoize(this._getInnerStrategiesByVaults);

    // TODO: implement this
    // private _getExperimentalVaults = memoize(this._getInnerVaults);

    public getStrategyMetaData = async (
        vaultAddress: string,
        strategyAddress: string
    ): Promise<StrategyMetaData> => {
        const result = await this.sdk.strategies.vaultsStrategiesMetadata([
            vaultAddress,
        ]);
        const res = result[0];
        const metaData = res.strategiesMetadata.find((strategy) => {
            strategy.address == strategyAddress;
        });
        return {
            description: metaData?.description,
        };
    };
}
