import { NetworkId, Network } from '../../types';
import { VaultService } from '.';

export default class ArbitrumService extends VaultService {
    constructor() {
        super(Network.arbitrum, NetworkId.arbitrum);
    }
}
