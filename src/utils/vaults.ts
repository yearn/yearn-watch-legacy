import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
    ContractCallReturnContext,
} from 'ethereum-multicall';
import { BigNumber, utils } from 'ethers';
import { get, omit, memoize } from 'lodash';
import { getEthersDefaultProvider } from './ethers';
import { Vault, VaultApi, VaultVersion, Strategy } from '../types';
import { BuildGet } from '../utils/apisRequest';
import { vaultChecks } from '../utils/checks';
import { formatBPS } from '../utils/commonUtils';
import { getABI_032, getABI } from '../utils/abi';
import { mapStrategyParams, getTotalDebtUsage } from '../utils/strategyParams';
import StratABI from './ABI/Strategy.json';


const VAULT_VIEW_METHODS = [
    'management',
    'governance',
    'guardian',
    'depositLimit',
];

const STRAT_VIEW_METHODS = [
    'apiVersion',
    'emergencyExit',
    'isActive',
    'keeper',
    'rewards',
    'strategist',
    'name',
    'vault',
];

const STRAT_PARAM_METHODS: string[] = [
    'debtOutstanding',
    'creditAvailable',
    'expectedReturn',
    'strategies'
];

const internalGetVaults = async (): Promise<Vault[]> => {
    const provider = getEthersDefaultProvider();

    const multicall = new Multicall({ ethersProvider: provider });

    try {
        const response = await BuildGet('/all');
        let payload = response.data as VaultApi[];
        payload = payload.filter(
            (vault) => vault.endorsed && vault.type === VaultVersion.V2
        );

        const vaultMap = new Map<string, VaultApi>();
        const strategyMap = new Map<string, string>();

        payload.forEach((vault) => {
            vaultMap.set(vault.address, vault);
            vault.strategies.forEach((strat) =>
                strategyMap.set(strat.address, vault.address)
            );
        });

        const vaultCalls: ContractCallContext[] = payload.map(({ address }) => {
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
        });
        const stratCalls: ContractCallContext[] = payload.flatMap(
            ({ strategies }) => {
                
                const stratViewMethods = strategies.map((strat) => {
                    const calls = STRAT_VIEW_METHODS.map((method) => ({
                        reference: method,
                        methodName: method,
                        methodParameters: [] as string[],
                    }));
                    return {
                        reference: strat.address,
                        contractAddress: strat.address,
                        abi: StratABI.abi,
                        calls,
                    };
                });

                const stratParamMethods = strategies.map((strat) => {
                    const vaultAddress = (strategyMap.get(strat.address) as string);
                    const vaultInfo = (vaultMap.get(vaultAddress) as VaultApi);
                    const abiParams = getABI(vaultInfo.apiVersion);
                    const calls = STRAT_PARAM_METHODS.map((method) => ({
                        reference: method === 'strategies' ? 'strategyParams' : method,
                        methodName: method,
                        methodParameters: [strat.address],
                    }));
                    return {
                        reference: `${strat.address}_${vaultAddress}`,
                        contractAddress: vaultAddress,
                        abi: abiParams,
                        calls,
                    };
                });
                // @ts-ignore
                return stratViewMethods.concat(stratParamMethods);
            }
        );
        const results: ContractCallResults = await multicall.call(
            vaultCalls.concat(stratCalls)
        );

        return mapVaultData(results, vaultMap);
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
        (vault) => vault.address.toLowerCase() === address.toLowerCase()
    );

    if (!foundVault) {
        throw new Error('Error: vault not part of the endorsed list');
    }

    return foundVault;
};

export const mapContractCalls = (result: ContractCallReturnContext) => {
    let mappedObj: any = {};
    result.callsReturnContext.forEach(({ methodName, returnValues }) => {
        if (returnValues && returnValues.length > 0) {
            if (
                typeof returnValues[0] === 'string' ||
                typeof returnValues[0] === 'boolean'
            ) {
                mappedObj[methodName] = returnValues[0];
            } else if (get(returnValues[0], 'type') === 'BigNumber') {
                mappedObj[methodName] = BigNumber.from(
                    returnValues[0]
                ).toString();
            }
        }
    });
    return mappedObj;
};

const mapVaultData = (
    contractCallsResults: ContractCallResults,
    vaultMap: Map<string, VaultApi>
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
            totalAssets: get(vault, 'tvl.totalAssets', 'unknown') as string,
        };

        const mappedStrategies: Strategy[] = strategies.map(({ address }) => {
            const stratData = contractCallsResults.results[address];
            const vaultStratData = contractCallsResults.results[`${address}_${mappedVault.address}`];
            let mappedStrat: any = mapContractCalls(stratData);
            let mappedVaultStratInfo: any = omit(mapContractCalls(vaultStratData), 'strategies');
            let mappedStratParams: any = mapStrategyParams(vaultStratData, apiVersion);
 
            return {
                ...mappedVaultStratInfo,
                ...mappedStrat,
                address,
                params: mappedStratParams
            };
        });

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
