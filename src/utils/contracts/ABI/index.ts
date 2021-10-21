/* eslint-disable @typescript-eslint/no-explicit-any */
import Oracle from './Oracle.json';
import StrategiesHelper from './StrategiesHelper.json';
import Strategy from './Strategy.json';
import Token from './Token.json';
import Vault from './Vault.json';
import VaultABI_030 from './VaultAPI_030.json';
import VaultABI_032 from './VaultAPI_032.json';

export const v0_3_2 = '0.3.2';

const abiMap = new Map<string, any>();
abiMap.set('0.3.0', VaultABI_030.abi);
abiMap.set('0.3.1', VaultABI_030.abi);
abiMap.set(v0_3_2, VaultABI_032.abi);
abiMap.set('0.3.3', VaultABI_032.abi);

export const getABI_032 = (): any => {
    return getABI(v0_3_2);
};

export const getABI = (apiVersion: string = v0_3_2): any => {
    return abiMap.get(apiVersion) || abiMap.get(v0_3_2);
};

export const getABIStrategiesHelper = (): any => StrategiesHelper;

export const getABIOracle = (): any => Oracle;

export const getABIStrategy = (): any => Strategy;

export const getABIToken = (): any => Token;

export const getABIVault = (): any => Vault;
