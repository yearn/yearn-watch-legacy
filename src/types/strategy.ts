import { BigNumber } from 'ethers';

export type StrategyParams = {
    activation: BigNumber;
    performanceFee: string;
    debtRatio: BigNumber;
    lastReport: BigNumber;
    totalDebt: BigNumber;
    totalGain: BigNumber;
    totalLoss: BigNumber;
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
    debtOutstanding: BigNumber;
    creditAvailable: BigNumber;
    expectedReturn: BigNumber;

    params: StrategyParams;
};
