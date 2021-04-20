import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
} from 'ethereum-multicall';
import { utils } from 'ethers';
import { get, memoize } from 'lodash';
import { getEthersDefaultProvider } from './ethers';
import { Vault, VaultApi, VaultVersion, Strategy } from '../types';
import { BuildGet } from './apisRequest';
import { vaultChecks } from './checks';
import { mapContractCalls } from './commonUtils';
import { getABI_032 } from './abi';
import { mapStrategiesCalls, buildStrategyCalls } from './strategies';
import { getTotalDebtUsage } from './strategyParams';

const VAULT_VIEW_METHODS = [
    'management',
    'governance',
    'guardian',
    'depositLimit',
    'totalAssets',
];

const internalGetVaults = async (): Promise<Vault[]> => {
    const provider = getEthersDefaultProvider();

    const multicall = new Multicall({ ethersProvider: provider });

    try {
        const response = await BuildGet('/all');
        let payload = response.data as VaultApi[];
        payload = payload.filter(
            (vault) =>
                vault.endorsed && vault.type === VaultVersion.V2
        );

        const vaultMap = new Map<string, VaultApi>();
        const strategyMap = new Map<string, string>();

        payload.forEach((vault) => {
            vaultMap.set(vault.address, vault);
            vault.strategies.forEach((strat) =>
                strategyMap.set(strat.address, vault.address)
            );
        });

        const vaultCalls: ContractCallContext[] = payload.map(
            ({ address }) => {
                const calls = VAULT_VIEW_METHODS.map((method) => ({
                    reference: method,
                    methodName: method,
                    methodParameters: [],
                }));
                return {
                    reference: address,
                    contractAddress: address,
                    abi: getABI_032(),
                    calls,
                };
            }
        );
        const stratCalls: ContractCallContext[] = payload.flatMap(
            ({ strategies }) => {
                const stratAddresses = strategies.map(
                    ({ address }) => address
                );
                return buildStrategyCalls(
                    stratAddresses,
                    vaultMap,
                    strategyMap
                );
            }
        );
        const results: ContractCallResults = await multicall.call(
            vaultCalls.concat(stratCalls)
        );

        return mapVaultData(results, vaultMap, strategyMap);
    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
};

export const getVaults = memoize(internalGetVaults);

export const getVault = async (address: string): Promise<Vault> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid vault address');
    }

    const vaults = await getVaults();

    let [foundVault]: Vault[] = vaults.filter(
        (vault) =>
            vault.address.toLowerCase() === address.toLowerCase()
    );

    if (!foundVault) {
        throw new Error('Error: vault not part of the endorsed list');
    }

    return foundVault;
};

const mapVaultData = (
    contractCallsResults: ContractCallResults,
    vaultMap: Map<string, VaultApi>,
    strategyMap: Map<string, string>
): Vault[] => {
    const vaults: Vault[] = [];

    vaultMap.forEach((vault, key) => {
        const {
            address,
            apiVersion,
            symbol,
            name,
            token,
            icon,
            emergencyShutdown,
            strategies,
        } = vault;

        let mappedVault: any = {
            address,
            apiVersion,
            symbol,
            name,
            token,
            icon,
            emergencyShutdown,
            managementFee: get(
                vault,
                'fees.general.managementFee',
                'unknown'
            ) as string,
            performanceFee: get(
                vault,
                'fees.general.performanceFee',
                'unknown'
            ) as string,
            // totalAssets: get(vault, 'tvl.value', 'unknown') as string,
        };

        const stratAddresses = strategies.map(
            ({ address }) => address
        );
        const mappedStrategies: Strategy[] = mapStrategiesCalls(
            stratAddresses,
            contractCallsResults,
            strategyMap
        );

        mappedVault.debtUsage = getTotalDebtUsage(mappedStrategies);

        const vaultData = contractCallsResults.results[address];

        vaults.push(
            vaultChecks({
                ...mappedVault,
                ...mapContractCalls(vaultData),
                strategies: mappedStrategies,
            })
        );
    });

    return vaults;
};
