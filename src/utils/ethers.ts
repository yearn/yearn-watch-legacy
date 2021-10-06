import { providers, BigNumber } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { getEnv } from './env';

export const getEthersDefaultProvider = (network = 'homestead'): Provider => {
    const { alchemyKey } = getEnv();
    // return new providers.InfuraProvider(network, infuraProjectId);
    return new providers.AlchemyProvider(network, alchemyKey);
};

export const formatAmount = (amount: string, decimals: number) => {
    const [whole, fraction] = amount.split('.');
    return `${whole}${fraction ? '.' + fraction.substring(0, decimals) : ''}`;
};

export const weiToUnits = (amount: string) => BigNumber.from(amount);
