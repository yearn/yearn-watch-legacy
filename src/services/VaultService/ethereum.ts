import { Yearn } from '@yfi/sdk';
import {
    NetworkId,
    Network,
    VaultService,
    Vault,
    QueryParam,
    DEFAULT_NETWORK,
    StrategyMetaData,
} from '../../types';
import { getEthersDefaultProvider } from '../../utils/ethers';
import {
    getTotalVaults,
    getVaultsWithPagination,
    getVault,
    getEndorsedVaults,
} from '../../utils/vaults';

// TODO: refactor to use SDK instead of utils and move utils common mappings to service
export default class EthereumService implements VaultService {
    private sdk: Yearn<NetworkId.fantom>;
    constructor() {
        const provider = getEthersDefaultProvider(this.getNetwork());
        this.sdk = new Yearn(this.getNetworkId(), {
            provider,
            cache: { useCache: false },
        });
    }

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

    public getStrategyMetaData = async (
        vaultAddress: string,
        strategyAddress: string
    ): Promise<StrategyMetaData> => {
        const result = await this.sdk.strategies.vaultsStrategiesMetadata([
            vaultAddress,
        ]);
        const res = result[0];
        const metaData = res.strategiesMetadata.find(
            (strategy) => strategy.address === strategyAddress
        );
        return {
            description: metaData?.description,
        };
    };
}
