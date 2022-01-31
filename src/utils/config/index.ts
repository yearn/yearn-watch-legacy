import { Network, NetworkConfig } from '../../types';
import { mainnet } from './ethereum';
import { fantom } from './fantom';
import { arbitrum } from './arbitrum';
import { checkNetworkSupported } from '../network';

const NETWORK_CONFIGS = new Map<Network, NetworkConfig>();
NETWORK_CONFIGS.set(Network.mainnet, mainnet);
NETWORK_CONFIGS.set(Network.fantom, fantom);
NETWORK_CONFIGS.set(Network.arbitrum, arbitrum);

export default (network: Network): NetworkConfig => {
    checkNetworkSupported(network);
    if (!NETWORK_CONFIGS.has(network)) {
        throw new Error(`Network configuration not found for '${network}'`);
    }
    return NETWORK_CONFIGS.get(network) as NetworkConfig;
};
