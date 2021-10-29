import { Network, Strategy } from '../types';
import { getTokenPrice } from './oracle';
import BigNumber from 'bignumber.js';
import { ProtocolTVL } from '../types/protocol-tvl';
import { StrategyTVL } from '../types/strategy-tvl';
import { getAllStrategies, getStrategies } from './strategies';
import { flattenArrays } from './commonUtils';
import { isAddress } from 'ethers/lib/utils';
import _ from 'lodash';
import { getStrategiesHelperInstance } from './contracts/instances';

export const getAssetsStrategiesAddressesByFilterNames = async (
    names: string[],
    network: Network
): Promise<string[]> => {
    if (names.map((name) => name.toLowerCase()).includes('all')) {
        const allStrategies = await getAllStrategies();
        return allStrategies.map((strategy) => strategy.address);
    }
    const helper = getStrategiesHelperInstance(network);
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

export const getStrategyAddresses = async (
    namesOrAddresses: string[],
    network: Network
) => {
    const addresses = new Array<string>();
    for (const nameOrAddress of namesOrAddresses) {
        if (isAddress(nameOrAddress)) {
            if (!addresses.includes(nameOrAddress.toLowerCase())) {
                addresses.push(nameOrAddress.toLowerCase());
            }
        } else {
            const nameAddresses = await getAssetsStrategiesAddressesByFilterNames(
                [nameOrAddress],
                network
            );
            addresses.push(...nameAddresses);
        }
    }
    return Array.from(new Set<string>(addresses));
};

export const getStrategyTVLsPerProtocol = async (
    protocolName: string,
    aliases: string[],
    network: Network,
    includeStrategies: string[] = [],
    excludeStrategies: string[] = []
): Promise<ProtocolTVL> => {
    const [
        excludeStrategyAddresses,
        includeStrategyAddresses,
    ] = await Promise.all([
        getStrategyAddresses(excludeStrategies, network),
        getStrategyAddresses(includeStrategies, network),
    ]);
    const isStrategyAddressExcluded = (strategy: string) =>
        excludeStrategyAddresses
            .map((address) => address.toLowerCase())
            .includes(strategy.toLowerCase());
    const result = await getAssetsStrategiesAddressesByFilterNames(
        aliases,
        network
    );
    const filteredStrategyAddresses = result.filter(
        (address: string) =>
            address !== undefined && !isStrategyAddressExcluded(address)
    );
    const strategyAddresses = [
        ...filteredStrategyAddresses,
        ...includeStrategyAddresses.map((strategy) => strategy.toLowerCase()),
    ];
    if (strategyAddresses.length === 0) {
        return new ProtocolTVL(protocolName, new BigNumber(0), 0, []);
    }
    const strategiesInfo = await getStrategies(strategyAddresses, network);
    const strategiesPromises = strategiesInfo.map(
        async (strategy: Strategy): Promise<StrategyTVL> => {
            if (strategy.estimatedTotalAssets) {
                return {
                    ...strategy,
                    estimatedTotalAssetsUsdc: await getTokenPrice(
                        strategy.token,
                        strategy.estimatedTotalAssets,
                        network
                    ),
                };
            } else {
                // estimatedTotalAssets failed, do not request USDC value
                return {
                    ...strategy,
                    estimatedTotalAssetsUsdc: new BigNumber(0),
                };
            }
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
    const minActivation = _.min(
        strategies.map((strat) => Date.parse(strat.params.activation))
    ) as number;
    for (const strategy of strategies) {
        protocolTVL = protocolTVL.plus(strategy.estimatedTotalAssetsUsdc);
    }
    return new ProtocolTVL(
        protocolName,
        protocolTVL,
        minActivation,
        strategies
    );
};

export const groupStrategyTVLsPerProtocols = async (
    protocolsToGroup: string[],
    network: Network,
    includeStrategies: string[] = [],
    excludeStrategies: string[] = [],
    alias?: string
): Promise<ProtocolTVL> => {
    const protocolName = alias ? alias : protocolsToGroup.join(' OR ');
    return await getStrategyTVLsPerProtocol(
        protocolName,
        protocolsToGroup,
        network,
        includeStrategies,
        excludeStrategies
    );
};
