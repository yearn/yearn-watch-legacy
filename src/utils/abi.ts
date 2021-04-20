import VaultABI_030 from './ABI/VaultAPI_030.json';
import VaultABI_032 from './ABI/VaultAPI_032.json';

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
