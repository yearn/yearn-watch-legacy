import { Network } from '../types';

export const isNetworkSupported = (network: string | Network): boolean => {
    if (!(Object.values(Network) as string[])?.includes(network)) {
        return false;
    }

    return true;
};
