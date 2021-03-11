import { BigNumber } from 'ethers';
import { Token, StrategyParams, Strategy, Vault } from '../types';


const API = 'https://vaults.finance/all';

export const loadVaults = async (): Promise<Vault[]> => {
    return Promise.resolve([]);
}