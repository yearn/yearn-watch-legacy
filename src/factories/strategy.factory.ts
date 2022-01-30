import * as Factory from 'factory.ts';
import { Strategy, StrategyParams } from '../types';
import { tokenFactory } from './token.factory';
import { BigNumber } from 'ethers';

const strategyParamsFactory = Factory.Sync.makeFactory<StrategyParams>({
    activation: 'str',
    performanceFee: 'str',
    debtRatio: BigNumber.from(1),
    lastReport: BigNumber.from(1),
    lastReportText: 'str',
    totalDebt: BigNumber.from(1),
    totalGain: BigNumber.from(1),
    totalLoss: BigNumber.from(1),
    rateLimit: BigNumber.from(1),
    minDebtPerHarvest: BigNumber.from(1),
    maxDebtPerHarvest: BigNumber.from(1),
    errors: [],
});

export const strategyFactory = Factory.Sync.makeFactory<Strategy>({
    apiVersion: 'str',
    name: 'str',
    address: 'str',
    vault: 'str',
    token: tokenFactory.build(),

    emergencyExit: false,
    isActive: true,

    strategist: 'str',
    keeper: 'str',
    rewards: 'str',
    healthCheck: null,
    doHealthCheck: false,

    withdrawalQueueIndex: 1,
    // params
    estimatedTotalAssets: BigNumber.from(1),
    delgatedAssets: BigNumber.from(1),
    debtOutstanding: BigNumber.from(1),
    creditAvailable: BigNumber.from(1),
    expectedReturn: BigNumber.from(1),

    params: strategyParamsFactory.build(),
    errors: [],
});
