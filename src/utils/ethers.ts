import { ethers, providers, BigNumber } from 'ethers';
import { getEnv } from './env';

const { formatUnits } = ethers.utils;

export const getEthersDefaultProvider = (
    network = 'homestead'
): ethers.providers.BaseProvider => {
    const { infuraProjectId } = getEnv();
    return new providers.InfuraProvider(network, infuraProjectId);
};

export const formatAmount = (amount: string, decimals: number) => {
    const [whole, fraction] = amount.split('.');
    return `${whole}${fraction ? '.' + fraction.substring(0, decimals) : ''}`;
};

export const weiToUnits = (amount: string) => BigNumber.from(amount);
