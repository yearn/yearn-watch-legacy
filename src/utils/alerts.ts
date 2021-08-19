import { Strategy } from '../types';

// warning utils
export const isStrategyActiveWithZeroDebt = (strat: Strategy): boolean => {
    return strat.isActive && strat.params.debtRatio.toString() === '0';
};

export const isDebtRatioTotalDebtMismatch = (strat: Strategy): boolean => {
    return (
        strat.params.debtRatio.toString() === '0' &&
        strat.params.totalDebt.toString() !== '0'
    );
};
