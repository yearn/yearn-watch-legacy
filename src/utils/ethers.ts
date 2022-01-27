import { providers, BigNumber } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { getEnv } from './env';
import { Network } from '../types';

const getAlchemyMainnetProvider = (): JsonRpcProvider => {
    const { alchemyKey } = getEnv();
    // return new providers.InfuraProvider(network, infuraProjectId);
    return new providers.AlchemyProvider('homestead', alchemyKey);
};

const getFantomProvider = (): JsonRpcProvider => {
    const { fantomNode } = getEnv();
    let rpcUrl: string;
    if (fantomNode === undefined) {
        rpcUrl = 'https://rpc.ftm.tools/';
    } else {
        rpcUrl = fantomNode;
    }
    const provider = new JsonRpcProvider(rpcUrl);

    return provider;
};

const getArbitrumProvider = (): JsonRpcProvider => {
    const { alchemyKey } = getEnv();
    let url = 'https://arb1.arbitrum.io/rpc';
    if (alchemyKey !== undefined) {
        url = `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`;
    }
    const provider = new JsonRpcProvider(url);
    return provider;
};

export const getEthersDefaultProvider = (
    network: Network | string = Network.mainnet
): JsonRpcProvider => {
    switch (network) {
        case Network.mainnet:
            return getAlchemyMainnetProvider();
        case Network.fantom:
            return getFantomProvider();
        case Network.arbitrum:
            return getArbitrumProvider();
        default:
            throw new Error(`Network - ${network} is not supported`);
    }
};

export const formatAmount = (amount: string, decimals: number) => {
    const [whole, fraction] = amount.split('.');
    return `${whole}${fraction ? '.' + fraction.substring(0, decimals) : ''}`;
};

export const weiToUnits = (amount: string) => BigNumber.from(amount);
