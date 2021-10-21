import { Network } from '../../types';
import getNetworkConfig from '../config';

export const USDC_DECIMALS = 6;

export const getUSDCAddress = (network: Network): string => {
    const { usdcAddress } = getNetworkConfig(network);
    return usdcAddress;
};

export const getOracleAddress = (network: Network): string => {
    const { oracleAddress } = getNetworkConfig(network);
    return oracleAddress;
};

export const getStrategiesHelperAddress = (network: Network): string => {
    const { strategiesHelperAddress } = getNetworkConfig(network);
    return strategiesHelperAddress;
};
