import { ethers, providers } from 'ethers';
import { getEnv } from './env';

export const getEthersDefaultProvider = (
    network = 'homestead',
): ethers.providers.BaseProvider => {
    const { infuraProjectId } = getEnv();
    return new providers.InfuraProvider(
        network,
        infuraProjectId
    );
};
