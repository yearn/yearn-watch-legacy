import { BigNumber } from 'ethers';
import { Token } from './token';

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
    minDebtPerHarvest?: BigNumber;
    maxDebtPerHarvest?: BigNumber;
    errors: string[];
};

export type Strategy = {
    apiVersion: string;
    name: string;
    address: string;
    vault: string;
    token: Token;

    emergencyExit: boolean;
    isActive?: boolean;

    strategist: string;
    keeper: string;
    rewards: string;
    healthCheck: string | null;
    doHealthCheck: boolean;

    withdrawalQueueIndex: number;
    // params
    estimatedTotalAssets?: BigNumber;
    delgatedAssets: BigNumber;
    debtOutstanding: BigNumber;
    creditAvailable: BigNumber;
    expectedReturn?: BigNumber;

    params: StrategyParams;
    errors: string[];
};

export type LendStatus = [
    name: string,
    assets: BigNumber,
    rate: BigNumber,
    add: string
];

export type EstimateAdjustPosition = [
    lowest: BigNumber,
    lowestApr: BigNumber,
    highest: BigNumber,
    potential: BigNumber
];

export type GenLenderStrategy = {
    address: string;
    lendStatuses: LendStatus[];
    lentTotalAssets: BigNumber;
    estimatedAPR: BigNumber;
    estimateAdjustPosition: EstimateAdjustPosition;
};
