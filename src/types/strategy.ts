import { BigNumber } from 'ethers';

export type StrategyParams = {
    activation: BigNumber;
    debtRatio: BigNumber;
    lastReport: BigNumber;
}

export type Strategy = {
    apiVersion: string;
    name: string; 
    vaultAddress: string;

    emergencyExit: boolean;
    active: boolean;

    strategist: string;
    keeper: string;

    params: StrategyParams;
}
