import { Network, VaultService } from '../../types';
import EthereumService from './ethereum';

import { checkNetworkSupported } from '../../utils/network';

export const getService = (network: string | Network): VaultService => {
    checkNetworkSupported(network);

    switch (network) {
        case Network.mainnet:
            return new EthereumService();
        default:
            throw new Error(`Network - ${network} is not supported`);
    }
};
