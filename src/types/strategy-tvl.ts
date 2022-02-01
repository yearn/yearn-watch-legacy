import BigNumber from 'bignumber.js';
import { Strategy } from '.';

export type StrategyTVL = Strategy & {
    estimatedTotalAssetsUsdc: BigNumber;
    debtOutstandingUsdc: BigNumber;
    dustUsdc: BigNumber;
};
