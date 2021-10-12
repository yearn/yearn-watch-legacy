import { Vault } from './vault';
import { QueryParam } from './query-param';

export enum Network {
    mainnet = 'ethereum',
    fantom = 'fantom',
}

export const DEFAULT_NETWORK = Network.mainnet;

export enum NetworkId {
    mainnet = 1,
    fantom = 250,
}

export interface VaultService {
    getNetwork: () => Network;
    getNetworkId: () => NetworkId;
    getTotalVaults: () => Promise<number>;
    getVaultsWithPagination: (queryParams?: QueryParam) => Promise<Vault[]>;
    getVault: (address: string) => Promise<Vault>;
    getEndorsedVaults: (
        allowList?: string[],
        queryParams?: QueryParam
    ) => Promise<Vault[]>;
}
