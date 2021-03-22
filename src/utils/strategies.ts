import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
    ContractCallReturnContext,
} from 'ethereum-multicall';
import { utils } from 'ethers';

import { getEthersDefaultProvider } from './ethers';
import { Strategy } from '../types';
import { mapContractCalls } from './vaults';

import StratABI from './ABI/Strategy.json';

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


const buildStrategyCalls = (addresses: string[]): ContractCallContext<any>[] => {
    return addresses.map((address) => {
        const calls = STRAT_VIEW_METHODS.map((method) => ({
            reference: method,
            methodName: method,
            methodParameters: [],
        }));
        return {
            reference: address,
            contractAddress: address,
            abi: StratABI.abi,
            calls,
        };
    });
}

export const getStrategies = async (
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

    const stratCalls: ContractCallContext[] = buildStrategyCalls(addresses);

    const results: ContractCallResults = await multicall.call(stratCalls);
    const mappedStrategies: Strategy[] = addresses.map((address) => {
        const stratData = results.results[address];
        let mappedStrat: any = mapContractCalls(stratData);

        return {
            ...mappedStrat,
            address,
        };
    });

    return mappedStrategies;
};


