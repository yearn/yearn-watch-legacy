import { Vault, VaultApi, VaultVersion, Strategy } from '../types';

export type VaultCheck = {
    checkOK: boolean;
    errors?: string[];
};

// ychad.eth
const GOVERNANCE = '0xfeb4acf3df3cdea7399794d0869ef76a6efaff52';
// dev.ychad.eth
const GUARDIAN = '0x846e211e8ba920b353fb717631c015cf04061cc9';
// strategist MultiSig
const MANAGEMENT = '0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7';

const MANAGEMENT_FEE = 200;

const PERF_FEE = 2000;

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
];

export const vaultChecks = (vault: Vault): Vault => {
    let result: VaultCheck = { checkOK: true };

    checks.forEach((check) => {
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
