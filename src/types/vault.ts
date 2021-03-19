import { BigNumber } from 'ethers';
import { Strategy } from './strategy';

export enum VaultVersion {
    V2 = 'v2',
    V1 = 'v1',
}

export type Token = {
    address: string;
    decimals: number;
    symbol: string;
    icon: string;
    name: string;
};

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

    depositLimit: string;
    // TODO: add this
    // debtRatio: BigNumber;
    managementFee: string;
    performanceFee: string;
    totalAssets: string;
    strategies: Strategy[];
    configOK: boolean;
    configErrors?: string[];
};

export type VaultApi = {
    address: string;
    apiVersion: string;
    decimals: number;
    endorsed: boolean;
    icon?: string;
    symbol: string;
    name: string;
    token: Token;
    type: VaultVersion;
    emergencyShutdown: boolean;
    fees: {
        general: {
            managementFee: number;
            performanceFee: number;
        };
    };
    tvl: {
        totalAssets: BigNumber | number;
    };
    strategies: [
        {
            name: string;
            address: string;
        }
    ];
};
