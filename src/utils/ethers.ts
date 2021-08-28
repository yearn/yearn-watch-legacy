import { ethers, providers, BigNumber } from 'ethers';
import { getEnv } from './env';

export const getEthersDefaultProvider = (
    network = 'homestead'
): ethers.providers.BaseProvider => {
    const { alchemyKey } = getEnv();
    // return new providers.InfuraProvider(network, infuraProjectId);
    return new providers.AlchemyProvider(network, alchemyKey);
};

export const formatAmount = (amount: string, decimals: number) => {
    const [whole, fraction] = amount.split('.');
    return `${whole}${fraction ? '.' + fraction.substring(0, decimals) : ''}`;
};

export const weiToUnits = (amount: string) => BigNumber.from(amount);
