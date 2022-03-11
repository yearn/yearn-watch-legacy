import { NetworkId, Network, VaultApi } from '../../types';
import { VaultService } from '.';
import { getApiData, VAULTS_ALL_EXPERIMENTAL } from '../../utils/apisRequest';
import { fillVaultApiData } from '../../utils/vaultMappings';

export default class EtherumService extends VaultService {
    constructor() {
        super(Network.mainnet, NetworkId.mainnet);
    }

    protected fetchExperimentalVaultData = async (): Promise<VaultApi[]> => {
        // TODO: fetch ape.tax vaults as well
        const response = await getApiData(VAULTS_ALL_EXPERIMENTAL);
        return fillVaultApiData(response.data);
    };
}
