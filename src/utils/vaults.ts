import { BigNumber } from 'ethers';
import axios from 'axios';
import { Token, StrategyParams, Strategy, Vault, VaultApi } from '../types';



const API = 'https://vaults.finance';


export const getVaults = async (): Promise<Vault[]> => {
    try {
        const vaults: Vault[] = [];
      const payload = await axios.get(`${API}/all`) as VaultApi;
      // TODO: map payload to vault list
      // if vault == endorsed true && type = v2
      // add vault to list
        console.log("payload", payload)
        // return payload;
      return Promise.resolve(payload);
    } catch (error) {
      console.error(error)
      return Promise.resolve([]);
    }
}

// const sum = (x: number, y: number): number => {
 
// }export const BuildGet = async (url: string) => {

