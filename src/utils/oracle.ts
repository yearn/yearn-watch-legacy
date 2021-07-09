import { getOracleInstance } from './abi';
import BigNumber from 'bignumber.js';
import { Token } from '../types';
import { BigNumberish } from 'ethers';
import { toUnits, USDC_DECIMALS } from './commonUtils';

export const getTokenUnitPrice = async (token: Token): Promise<BigNumber> => {
    try {
        const oracle = getOracleInstance();
        const result = await oracle.getPriceUsdcRecommended(token.address);
        return toUnits(result, USDC_DECIMALS);
    } catch (error) {
        console.error(error);
        return new BigNumber(0);
    }
};

export const getTokenUnitPrices = async (
    tokens: Token[]
): Promise<BigNumber[]> => {
    const result = new Array<BigNumber>();
    for (const token of tokens) {
        result.push(await getTokenUnitPrice(token));
    }
    return result;
};

export const getTokenPrice = async (
    token: Token,
    amount: BigNumberish
): Promise<BigNumber> => {
    try {
        const oracle = getOracleInstance();
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
