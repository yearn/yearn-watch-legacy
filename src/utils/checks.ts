import { Vault } from '../types';

export type VaultCheck = {
    checkOK: boolean;
    errors?: string[];
};

// ychad.eth
const GOVERNANCE = '0xfeb4acf3df3cdea7399794d0869ef76a6efaff52';
// dev.ychad.eth
const GUARDIAN = '0x846e211e8ba920b353fb717631c015cf04061cc9';
// brain.ychad.eth
const MANAGEMENT = '0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7';
// treasury.ychad.eth
const TREASURY = '0x93a62da5a14c80f265dabc077fcee437b1a0efde';

const MANAGEMENT_FEE = 200;

const PERF_FEE = 1000;

const addressMap = new Map<string, string>();
addressMap.set(GOVERNANCE.toLowerCase(), 'ychad.eth');
addressMap.set(GUARDIAN.toLowerCase(), 'dev.ychad.eth');
addressMap.set(MANAGEMENT.toLowerCase(), 'brain.ychad.eth');
addressMap.set(TREASURY.toLowerCase(), 'treasury.ychad.eth');

export const checkLabel = (address: string) => {
    if (addressMap.has(address.toLowerCase())) {
        return addressMap.get(address.toLowerCase());
    }
    return address;
};

const INCOMPATIBLE_VERSIONS_API = new Set(['0.3.0', '0.3.1']);

export const isLegacyVault = (apiVersion: string): boolean => {
    return INCOMPATIBLE_VERSIONS_API.has(apiVersion);
};

const checks = [
    {
        field: 'governance',
        validate: (value: any): boolean =>
            typeof value === 'string' &&
            value.toLowerCase() === GOVERNANCE.toLowerCase(),
        error: 'value incorrect for governance',
    },
    {
        field: 'guardian',
        validate: (value: any): boolean =>
            typeof value === 'string' &&
            value.toLowerCase() === GUARDIAN.toLowerCase(),
        error: 'value incorrect for guardian',
    },
    {
        field: 'management',
        validate: (value: any): boolean =>
            typeof value === 'string' &&
            value.toLowerCase() === MANAGEMENT.toLowerCase(),
        error: 'value incorrect for management',
    },
    {
        field: 'managementFee',
        validate: (value: any): boolean =>
            typeof value === 'number' && value === MANAGEMENT_FEE,
        error: 'value incorrect for management fee',
    },
    {
        field: 'performanceFee',
        validate: (value: any): boolean =>
            typeof value === 'number' && value === PERF_FEE,
        error: 'value incorrect for performance fee',
    },
    {
        field: 'rewards',
        validate: (value: any): boolean =>
            typeof value === 'string' &&
            value.toLowerCase() === TREASURY.toLowerCase(),
        error: 'value incorrect for rewards',
    },
];

export const vaultChecks = (vault: Vault): Vault => {
    const result: VaultCheck = { checkOK: true };

    checks.forEach((check) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!check.validate(vault[check.field])) {
            result.checkOK = false;
            result.errors = result.errors
                ? [...result.errors, check.error]
                : [check.error];
        }
    });

    return {
        ...vault,
        configOK: result.checkOK,
        configErrors: result.errors,
    };
};
