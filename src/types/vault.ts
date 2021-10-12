import { BigNumber } from 'ethers';
import { Token } from './token';
import { Strategy } from './strategy';

export enum VaultVersion {
    V2 = 'v2',
    V1 = 'v1',
}

export interface VaultData {
    apiVersion: string;
    version?: string;
    address: string;
}

export type Vault = {
    address: string;
    apiVersion: string;
    name: string;
    symbol: string;
    token: Token;
    icon?: string;

    emergencyShutdown: boolean;
    management: string;
    governance: string;
    guardian: string;
    rewards: string;

    depositLimit: string;
    debtRatio: string;
    totalDebt: string;
    lastReport: string;
    lastReportText: string;
    pricePerShare: string;

    managementFee: string;
    performanceFee: string;
    totalAssets: string;
    strategies: Strategy[];
    debtUsage: string;
    configOK: boolean;
    configErrors?: string[];
};

export interface StrategyApi {
    name: string;
    address: string;
}

export type VaultApi = {
    address: string;
    apiVersion: string;
    decimals: number;
    endorsed: boolean;
    icon?: string;
    symbol: string;
    name: string;
    want: string;
    token: Token;
    type: VaultVersion;
    emergencyShutdown: boolean;
    fees?: {
        general: {
            managementFee: number;
            performanceFee: number;
        };
    };
    tvl: {
        totalAssets: BigNumber | number;
    };
    strategies: StrategyApi[];
};
