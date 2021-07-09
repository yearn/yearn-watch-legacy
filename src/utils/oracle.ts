import { getOracleInstance } from './abi';
import BigNumber from 'bignumber.js';
import { Token } from '../types';
import { BigNumberish } from 'ethers';
import { toUnits, USDC_DECIMALS } from './commonUtils';

export const getTokenUnitPrice = async (token: Token): Promise<BigNumber> => {
    try {
        const oracle = getOracleInstance();
        const result = await oracle.getPriceUsdcRecommended(token.address);
        await new Promise((resolve, reject) => {
            setTimeout(() => resolve('done'), 10000);
        });
        return toUnits(result, USDC_DECIMALS);
    } catch (error) {
        console.error(error);
        return new BigNumber(0);
    }
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
