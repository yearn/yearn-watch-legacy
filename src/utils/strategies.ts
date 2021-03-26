import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
} from 'ethereum-multicall';
import { utils } from 'ethers';
import { omit, memoize } from 'lodash';

import { getEthersDefaultProvider } from './ethers';
import { Strategy, VaultApi } from '../types';
import { getABI } from './abi';
import { mapStrategyParams } from './strategyParams';
import { mapContractCalls } from './commonUtils';

import StratABI from './ABI/Strategy.json';

interface VaultVersionInfo {
    apiVersion: string;
}

const STRAT_VIEW_METHODS = [
    'apiVersion',
    'emergencyExit',
    'isActive',
    'keeper',
    'rewards',
    'strategist',
    'name',
    'vault',
    'estimatedTotalAssets',
    'delegatedAssets'
];

const STRAT_PARAM_METHODS: string[] = [
    'debtOutstanding',
    'creditAvailable',
    'expectedReturn',
    'strategies'
];



const buildViewMethodsCall = (strategies: string[]): ContractCallContext[] =>  {
    return strategies.map((stratAddres) => {
        const calls = STRAT_VIEW_METHODS.map((method) => ({
            reference: method,
            methodName: method,
            methodParameters: [] as string[],
        }));
        return {
            reference: stratAddres,
            contractAddress: stratAddres,
            abi: StratABI.abi,
            calls,
        };
    });
}

const buildParamMethodsCall = (
    strategies: string[], 
    strategyMap: Map<string, string>, 
    vaultMap: Map<string, VaultVersionInfo>
): ContractCallContext[] =>  {
    return strategies.map((stratAddres) => {
        const vaultAddress = (strategyMap.get(stratAddres) as string);
        const vaultInfo = (vaultMap.get(vaultAddress) as VaultVersionInfo);
        const abiParams = getABI(vaultInfo.apiVersion);
        const calls = STRAT_PARAM_METHODS.map((method) => ({
            reference: method === 'strategies' ? 'strategyParams' : method,
            methodName: method,
            methodParameters: [stratAddres],
        }));
        return {
            reference: `${stratAddres}_${vaultAddress}`,
            contractAddress: vaultAddress,
            abi: abiParams,
            calls,
        };
    });
}

export const buildStrategyCalls = (
    strategies: string[], 
    vaultMap: Map<string, VaultApi>, 
    strategyMap: Map<string, string>
): ContractCallContext[] => {
    const stratViewMethods = buildViewMethodsCall(strategies);

    const stratParamMethods = buildParamMethodsCall(strategies, strategyMap, vaultMap);
    // @ts-ignore
    return stratViewMethods.concat(stratParamMethods);
}

export const mapStrategiesCalls = (
    strategies: string[], 
    contractCallsResults: ContractCallResults, 
    strategyMap: Map<string, string>,
): Strategy[] => {
    return strategies.map(( address ) => {
        const stratData = contractCallsResults.results[address];
        const vaultStratData = contractCallsResults.results[`${address}_${strategyMap.get(address)}`];
        let mappedStrat: any = mapContractCalls(stratData);
        let mappedVaultStratInfo: any = omit(mapContractCalls(vaultStratData), 'strategies');
        let mappedStratParams: any = mapStrategyParams(vaultStratData, mappedStrat.apiVersion);

        return {
            ...mappedVaultStratInfo,
            ...mappedStrat,
            address,
            params: mappedStratParams
        };
    });
}

const innerGetStrategies = async (
    addresses: string[]
): Promise<Strategy[]> => {
    if (addresses.length === 0) {
        throw new Error('Error: expect a valid strategy address');
    }

    addresses.forEach((address) => {
        if (!address || !utils.isAddress(address)) {
            throw new Error('Error: expect a valid strategy address');
        }
    });

    const provider = getEthersDefaultProvider();

    const multicall = new Multicall({ ethersProvider: provider });

    // do call to strategy apiVersion and vault
    const stratCalls: ContractCallContext[] = buildViewMethodsCall(addresses);

    const resultsViewMethods: ContractCallResults = await multicall.call(stratCalls);
    const vaultMap = new Map<string, VaultVersionInfo>();
    const strategyMap = new Map<string, string>();

    addresses.forEach((address) => {
        const stratData = resultsViewMethods.results[address];
        let mappedStrat: any = mapContractCalls(stratData);
        strategyMap.set(address, mappedStrat.vault);
        vaultMap.set(mappedStrat.vault, { apiVersion: mappedStrat.apiVersion })
    });

    const stratParamCalls = buildParamMethodsCall(addresses, strategyMap, vaultMap);
    const stratParamResults: ContractCallResults = await multicall.call(stratParamCalls);

    const mergedResults: ContractCallResults = {
        results: {
            ...resultsViewMethods.results, 
            ...stratParamResults.results
        },
        blockNumber: stratParamResults.blockNumber,
    }

    const mappedStrategies = mapStrategiesCalls(
        addresses,
        mergedResults,
        strategyMap,
    );

    return mappedStrategies;
};

export const getStrategies = memoize(innerGetStrategies);




