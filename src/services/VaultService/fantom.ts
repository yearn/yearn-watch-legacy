import { Yearn } from '@yfi/sdk';
import { utils } from 'ethers';
import memoize from 'lodash/memoize';
import { JsonRpcProvider } from '@ethersproject/providers';
import { getEthersDefaultProvider } from '../../utils/ethers';
import { mapVaultDataToVault } from '../../utils/vaultDataMapping';
import { mapVaultSdkToVaultApi, sortVaultsByVersion } from './mappings';

import {
    NetworkId,
    Network,
    VaultService,
    Vault,
    VaultApi,
    QueryParam,
    DEFAULT_QUERY_PARAM,
} from '../../types';

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
        console.log('results', results);
        const filterList = new Set(allowList.map((addr) => addr.toLowerCase()));
        const filteredVaults = results.filter((vault) =>
            filterList.has(vault.address.toLowerCase())
        );
        console.log('filteredVaults', filteredVaults);
        const vaults = await mapVaultDataToVault(
            filterList.size > 0 ? filteredVaults : results,
            this.getNetwork()
        );

        console.log('vaults', vaults);

        return vaults;
    };

    private _getInnerVaults = async (): Promise<VaultApi[]> => {
        const results = await this.sdk.vaults.get();

        console.log('sdk ftm vaults', results);

        const vaults = mapVaultSdkToVaultApi(results);

        const sortedVaultList = sortVaultsByVersion([...vaults]);

        console.log('sortedVaultList', sortedVaultList);

        return sortedVaultList;
    };

    private _getVaults = memoize(this._getInnerVaults);

    // TODO: implement this
    // private _getExperimentalVaults = memoize(this._getInnerVaults);
}
