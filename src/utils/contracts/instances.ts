import { Contract } from 'ethers';
import { getEthersDefaultProvider } from '../ethers';
import { Network } from '../../types';
import { getOracleAddress, getStrategiesHelperAddress } from './addresses';
import { getABIOracle, getABIStrategiesHelper } from './ABI';

export const getOracleInstance = (network: Network): Contract => {
    const address = getOracleAddress(network);
    const provider = getEthersDefaultProvider(network);
    return new Contract(address, getABIOracle(), provider);
};

export const getStrategiesHelperInstance = (network: Network): Contract => {
    const address = getStrategiesHelperAddress(network);
    const provider = getEthersDefaultProvider(network);
    return new Contract(address, getABIStrategiesHelper(), provider);
};
