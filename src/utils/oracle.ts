import BigNumber from 'bignumber.js';
import { Network, Token } from '../types';
import { BigNumberish } from 'ethers';
import { toUnits } from './commonUtils';
import { USDC_DECIMALS } from './contracts/addresses';
import { getOracleInstance } from './contracts/instances';

export const getTokenUnitPrice = async (
    token: Token,
    network: Network = Network.mainnet
): Promise<BigNumber> => {
    try {
        const oracle = getOracleInstance(network);
        const result = await oracle.getPriceUsdcRecommended(token.address);
        return toUnits(result, USDC_DECIMALS);
    } catch (error) {
        console.error(error);
        return new BigNumber(0);
    }
};

export const getTokenUnitPrices = async (
    tokens: Token[],
    network: Network
): Promise<BigNumber[]> => {
    const result = new Array<BigNumber>();
    for (const token of tokens) {
        result.push(await getTokenUnitPrice(token, network));
    }
    return result;
};

export const getTokenPrice = async (
    token: Token,
    amount: BigNumberish,
    network: Network
): Promise<BigNumber> => {
    try {
        const oracle = getOracleInstance(network);
        const result = await oracle['getNormalizedValueUsdc(address,uint256)'](
            token.address,
            amount.toString()
        );
        return toUnits(result, USDC_DECIMALS);
    } catch (error) {
        console.error(error);
        return new BigNumber(0);
    }
};
