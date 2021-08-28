import VaultABI_030 from './ABI/VaultAPI_030.json';
import VaultABI_032 from './ABI/VaultAPI_032.json';
import StrategiesHelper from './ABI/StrategiesHelper.json';
import Oracle from './ABI/Oracle.json';
import { Contract } from 'ethers';
import {
    ORACLE_CONTRACT_ADDRESS,
    STRATEGIES_HELPER_CONTRACT_ADDRESS,
} from './commonUtils';
import { getEthersDefaultProvider } from './ethers';

export const v0_3_2 = '0.3.2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const abiMap = new Map<string, any>();
abiMap.set('0.3.0', VaultABI_030.abi);
abiMap.set('0.3.1', VaultABI_030.abi);
abiMap.set(v0_3_2, VaultABI_032.abi);
abiMap.set('0.3.3', VaultABI_032.abi);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getABI_032 = (): any => {
    return getABI(v0_3_2);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getABI = (apiVersion: string = v0_3_2): any => {
    return abiMap.get(apiVersion) || abiMap.get(v0_3_2);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getABIStrategiesHelper = (): any => StrategiesHelper;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getABIOracle = (): any => Oracle;

export const getOracleInstance = (): Contract => {
    const provider = getEthersDefaultProvider();
    return new Contract(ORACLE_CONTRACT_ADDRESS, getABIOracle(), provider);
};

export const getStrategiesHelperInstance = (): Contract => {
    const provider = getEthersDefaultProvider();
    return new Contract(
        STRATEGIES_HELPER_CONTRACT_ADDRESS,
        getABIStrategiesHelper(),
        provider
    );
};
