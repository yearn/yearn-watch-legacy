import { Multicall } from 'ethereum-multicall';
import { getEthersDefaultProvider } from './ethers';
import { Network } from '../types';

const FTM_MULTICALL = '0x6cAfA5f64476769aAEc7c0Ae8D8E14c2a77272a2';

export const getMulticallContract = (
    network: Network | string = Network.mainnet
): Multicall => {
    const provider = getEthersDefaultProvider(network);
    let multicall: Multicall;
    switch (network) {
        case Network.mainnet:
            multicall = new Multicall({
                ethersProvider: provider,
                tryAggregate: true,
            });
            return multicall;
        case Network.fantom:
            multicall = new Multicall({
                multicallCustomContractAddress: FTM_MULTICALL,
                ethersProvider: provider,
                tryAggregate: true,
            });
            return multicall;
        default:
            throw new Error(`Network - ${network} is not supported`);
    }
};
