import { Strategy } from '../types';
import { getStrategiesHelperInstance } from './abi';
import { getTokenPrice } from './oracle';
import BigNumber from 'bignumber.js';
import { ProtocolTVL } from '../types/protocol-tvl';
import { StrategyTVL } from '../types/strategy-tvl';
import { getStrategies } from './strategies';
import { flattenArrays } from './commonUtils';

export const getAssetsStrategiesAddressesByFilterNames = async (
    ...names: string[]
): Promise<string[]> => {
    const helper = getStrategiesHelperInstance();

    const callPromises = names.map((name) =>
        helper['assetsStrategiesAddressesByFilter(string[][])']([
            ['KEY', 'name', 'STRING'],
            ['VALUE', name.toLowerCase(), 'STRING'],
            ['OPERATOR', 'LIKE'],
        ])
    );
    const results = await Promise.all(callPromises);
    const flattenResults = flattenArrays(results);
    return Array.from(new Set(flattenResults));
};

export const getStrategyTVLsPerProtocol = async (
    protocolName: string,
    aliases: string[],
    includeStrategies: string[] = [],
    excludeStrategies: string[] = []
): Promise<ProtocolTVL> => {
    const isExcluded = (strategy: string) =>
        excludeStrategies
            .map((address) => address.toLowerCase())
            .includes(strategy.toLowerCase());

    const result = await getAssetsStrategiesAddressesByFilterNames(...aliases);
    const filteredStrategyAddresses = result.filter(
        (address: any) => address !== undefined && !isExcluded(address)
    );
    const strategyAddresses = [
        ...filteredStrategyAddresses,
        ...includeStrategies.map((strategy) => strategy.toLowerCase()),
    ];
    if (strategyAddresses.length === 0) {
        return new ProtocolTVL(protocolName, new BigNumber(0), []);
    }
    const strategiesInfo = await getStrategies(strategyAddresses);
    const strategiesPromises = strategiesInfo.map(
        async (strategy: Strategy): Promise<StrategyTVL> => {
            return {
                ...strategy,
                estimatedTotalAssetsUsdc: await getTokenPrice(
                    strategy.token,
                    strategy.estimatedTotalAssets
                ),
            };
        }
    );
    const strategies = (await Promise.all(strategiesPromises)).sort(
        (a: StrategyTVL, b: StrategyTVL) => {
            return a.estimatedTotalAssetsUsdc > b.estimatedTotalAssetsUsdc
                ? -1
                : 1;
        }
    );

    let protocolTVL = new BigNumber(0);
    for (const strategy of strategies) {
        protocolTVL = protocolTVL.plus(strategy.estimatedTotalAssetsUsdc);
    }
    return new ProtocolTVL(protocolName, protocolTVL, strategies);
};
