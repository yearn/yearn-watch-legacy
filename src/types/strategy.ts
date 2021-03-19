import { BigNumber } from 'ethers';

export type StrategyParams = {
    activation: BigNumber;
    debtRatio: BigNumber;
    lastReport: BigNumber;
}

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

    params?: StrategyParams;
}
