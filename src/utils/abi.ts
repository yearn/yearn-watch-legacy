import VaultABI_030 from './ABI/VaultAPI_030.json';
import VaultABI_032 from './ABI/VaultAPI_032.json';
import StrategiesHelper from './ABI/StrategiesHelper.json';
import Oracle from './ABI/Oracle.json';
import { Contract } from 'ethers';
import { STRATEGIES_HELPER_CONTRACT_ADDRESS } from './commonUtils';
import { getEthersDefaultProvider } from './ethers';

import { Network } from '../types';

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

export const ORACLE_CONTRACT_ADDRESS =
    '0x83d95e0D5f402511dB06817Aff3f9eA88224B030';

export const FTM_ORACLE_CONTRACT_ADDRESS =
    '0x57AA88A0810dfe3f9b71a9b179Dd8bF5F956C46A';

const oracleMap = new Map<Network, string>();
oracleMap.set(Network.mainnet, ORACLE_CONTRACT_ADDRESS);
oracleMap.set(Network.fantom, FTM_ORACLE_CONTRACT_ADDRESS);

export const getOracleInstance = (
    network: Network = Network.mainnet
): Contract => {
    const provider = getEthersDefaultProvider(network);
    return new Contract(oracleMap.get(network) || '', getABIOracle(), provider);
};

const helperMap = new Map<Network, string>();
helperMap.set(Network.mainnet, STRATEGIES_HELPER_CONTRACT_ADDRESS);

export const getStrategiesHelperInstance = (
    network: Network = Network.mainnet
): Contract => {
    const provider = getEthersDefaultProvider(network);
    return new Contract(
        helperMap.get(network) || '',
        getABIStrategiesHelper(),
        provider
    );
};
