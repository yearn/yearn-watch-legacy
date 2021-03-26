import { BigNumber } from 'ethers';

export type StrategyParams = {
    activation: string;
    performanceFee: string;
    debtRatio: BigNumber;
    lastReport: BigNumber;
    lastReportText: string;
    totalDebt: BigNumber;
    totalGain: BigNumber;
    totalLoss: BigNumber;
    rateLimit?: BigNumber;
};

export type Strategy = {
    apiVersion: string;
    name: string;
    address: string;
    vault: string;

    emergencyExit: boolean;
    isActive: boolean;

    strategist: string;
    keeper: string;
    rewards: string;

    // params
    estimatedTotalAssets: BigNumber;
    delgatedAssets: BigNumber;
    debtOutstanding: BigNumber;
    creditAvailable: BigNumber;
    expectedReturn: BigNumber;

    params: StrategyParams;
};
