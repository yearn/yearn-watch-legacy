import { Network } from '../types';

export const isNetworkSupported = (network: string | Network): boolean => {
    if (!(Object.values(Network) as string[])?.includes(network)) {
        return false;
    }

    return true;
};

export const checkNetworkSupported = (network: string | Network): void => {
    if (!isNetworkSupported(network)) {
        throw new Error(`Network ${network} not supported`);
    }
};
