import { BigNumber } from 'ethers';
import { Strategy } from './strategy';

export type Token = {
    address: string;
    symbol: string;
}



export type Vault = {
    apiVersion: string;
    name: string;
    symbol: string;
    want: Token;

    emergencyShutdown: boolean;
    management: string;
    governance: string;
    guardian:string;


    depositLimit: BigNumber;
    debtRatio: BigNumber;
    managementFee: BigNumber;
    performanceFee: BigNumber;
    strategies: Strategy[];
}

export type VaultApi = {
   // TODO: fill this type with API payload schema
}