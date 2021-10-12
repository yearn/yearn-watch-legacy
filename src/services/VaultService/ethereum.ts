import {
    NetworkId,
    Network,
    VaultService,
    Vault,
    QueryParam,
    DEFAULT_NETWORK,
} from '../../types';
import {
    getTotalVaults,
    getVaultsWithPagination,
    getVault,
    getEndorsedVaults,
} from '../../utils/vaults';

// TODO: refactor to use SDK instead of utils and move utils common mappings to service
export default class EthereumService implements VaultService {
    public getNetwork = (): Network => {
        return DEFAULT_NETWORK;
    };

    public getNetworkId = (): NetworkId => {
        return NetworkId.mainnet;
    };

    public getTotalVaults = (): Promise<number> => {
        return getTotalVaults();
    };

    public getVaultsWithPagination = (
        queryParams?: QueryParam
    ): Promise<Vault[]> => {
        return getVaultsWithPagination(queryParams);
    };

    public getVault = (address: string): Promise<Vault> => {
        return getVault(address);
    };

    public getEndorsedVaults = (
        allowList?: string[],
        queryParams?: QueryParam
    ) => {
        return getEndorsedVaults(allowList, queryParams);
    };
}
