import { Strategy } from '../types';
import { getStrategiesHelperInstance } from './abi';
import { getTokenPrice } from './oracle';
import BigNumber from 'bignumber.js';
import { ProtocolTVL } from '../types/protocol-tvl';
import { StrategyTVL } from '../types/strategy-tvl';
import { getAllStrategies, getStrategies } from './strategies';
import { flattenArrays } from './commonUtils';
import { isAddress } from 'ethers/lib/utils';

export const getAssetsStrategiesAddressesByFilterNames = async (
    ...names: string[]
): Promise<string[]> => {
    if (names.map((name) => name.toLowerCase()).includes('all')) {
        console.time('GetAllStrategies');
        const allStrategies = await getAllStrategies();
        console.timeLog('GetAllStrategies');
        console.log(`Total Strats: ${allStrategies.length}`);
        return allStrategies.map((strategy) => strategy.address);
    }
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

export const getStrategyAddresses = async (namesOrAddresses: string[]) => {
    const addresses = new Array<string>();
    for (const nameOrAddress of namesOrAddresses) {
        if (isAddress(nameOrAddress)) {
            if (!addresses.includes(nameOrAddress.toLowerCase())) {
                addresses.push(nameOrAddress.toLowerCase());
            }
        } else {
            const nameAddresses = await getAssetsStrategiesAddressesByFilterNames(
                nameOrAddress
            );
            addresses.push(...nameAddresses);
        }
    }
    return Array.from(new Set<string>(addresses));
};

export const getStrategyTVLsPerProtocol = async (
    protocolName: string,
    aliases: string[],
    includeStrategies: string[] = [],
    excludeStrategies: string[] = []
): Promise<ProtocolTVL> => {
    const [
        excludeStrategyAddresses,
        includeStrategyAddresses,
    ] = await Promise.all([
        getStrategyAddresses(excludeStrategies),
        getStrategyAddresses(includeStrategies),
    ]);
    const isStrategyAddressExcluded = (strategy: string) =>
        excludeStrategyAddresses
            .map((address) => address.toLowerCase())
            .includes(strategy.toLowerCase());

    const result = await getAssetsStrategiesAddressesByFilterNames(...aliases);
    const filteredStrategyAddresses = result.filter(
        (address: string) =>
            address !== undefined && !isStrategyAddressExcluded(address)
    );
    const strategyAddresses = [
        ...filteredStrategyAddresses,
        ...includeStrategyAddresses.map((strategy) => strategy.toLowerCase()),
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

export const groupStrategyTVLsPerProtocols = async (
    protocolsToGroup: string[],
    includeStrategies: string[] = [],
    excludeStrategies: string[] = [],
    alias?: string
): Promise<ProtocolTVL> => {
    const protocolName = alias ? alias : protocolsToGroup.join(' OR ');
    return await getStrategyTVLsPerProtocol(
        protocolName,
        protocolsToGroup,
        includeStrategies,
        excludeStrategies
    );
};
