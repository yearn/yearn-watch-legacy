import { NetworkId, Network } from '../../types';
import { VaultService } from '.';

export default class FantomService extends VaultService {
    constructor() {
        super(Network.fantom, NetworkId.fantom);
    }
}
