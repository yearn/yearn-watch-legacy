import { NetworkConfig, Strategy, Vault } from '../types';

export type VaultCheck = {
    checkOK: boolean;
    checkRiskOk: boolean;
    errors?: string[];
};

const INCOMPATIBLE_VERSIONS_API = new Set(['0.3.0', '0.3.1']);

export const isLegacyVault = (apiVersion: string): boolean => {
    return INCOMPATIBLE_VERSIONS_API.has(apiVersion);
};

type ValueLike = string | number;

const checks = [
    {
        field: 'governance',
        validate: (value: ValueLike, networkConfig: NetworkConfig): boolean =>
            typeof value === 'string' &&
            networkConfig.governance.isAddress(value),
        error: 'value incorrect for governance',
    },
    {
        field: 'guardian',
        validate: (value: ValueLike, networkConfig: NetworkConfig): boolean =>
            typeof value === 'string' &&
            networkConfig.guardian.isAddress(value),
        error: 'value incorrect for guardian',
    },
    {
        field: 'management',
        validate: (value: ValueLike, networkConfig: NetworkConfig): boolean =>
            typeof value === 'string' &&
            networkConfig.management.isAddress(value),
        error: 'value incorrect for management',
    },
    {
        field: 'managementFee',
        validate: (value: ValueLike, networkConfig: NetworkConfig): boolean =>
            typeof value === 'number' && networkConfig.isManagementFee(value),
        error: 'value incorrect for management fee',
    },
    {
        field: 'performanceFee',
        validate: (value: ValueLike, networkConfig: NetworkConfig): boolean =>
            typeof value === 'number' && networkConfig.isPerformanceFee(value),
        error: 'value incorrect for performance fee',
    },
    {
        field: 'rewards',
        validate: (value: ValueLike, networkConfig: NetworkConfig): boolean =>
            typeof value === 'string' &&
            networkConfig.treasury.isAddress(value),
        error: 'value incorrect for rewards',
    },
];

export const vaultChecks = (
    vault: Vault,
    strategiesOnRiskPage: Set<string>,
    networkConfig: NetworkConfig
): Vault => {
    const result: VaultCheck = { checkOK: true, checkRiskOk: true };
    checks.forEach((check) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!check.validate(vault[check.field], networkConfig)) {
            result.checkOK = false;
            result.errors = result.errors
                ? [...result.errors, check.error]
                : [check.error];
        }
    });

    vault.strategies.forEach((strategy: Strategy) => {
        if (
            !strategiesOnRiskPage.has(strategy.address) &&
            strategy.withdrawalQueueIndex != -1
        ) {
            result.checkRiskOk = false;
            strategy.isMissingRisk = true;
        }
    });

    return {
        ...vault,
        configOK: result.checkOK,
        checkRiskOk: result.checkRiskOk,
        configErrors: result.errors,
    };
};
