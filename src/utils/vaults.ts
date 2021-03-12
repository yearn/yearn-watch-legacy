import { BigNumber } from 'ethers';
import { Token, StrategyParams, Strategy, Vault, VaultApi } from '../types';
import { BuildGet } from '../utils/apisRequest';


const API = 'https://vaults.finance/all';


export const getVaults = async (): Promise<Vault[]> => {
    try {
      const vaults: Vault[] = [];
      const payload = await BuildGet("/all") as VaultApi;
      // TODO: map payload to vault list
      // if vault == endorsed true && type = v2
      // add vault to list
      return Promise.resolve(vaults);
    } catch (error) {
      console.error(error)
      return Promise.resolve([]);
    }
}

const sum = (x: number, y: number): number => {
 
}