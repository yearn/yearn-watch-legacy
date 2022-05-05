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
import { getEthersDefaultProvider } from './ethers';
import { Contract } from 'ethers';
import TokenABI from './contracts/ABI/Token.json';

export const getAssetsStrategiesAddressesByFilterNames = async (
    names: string[],
    network: Network
): Promise<string[]> => {
    // FIXME: temporary fix for fantom chain
    if (network === Network.fantom) {
        const allStrategies = await getAllStrategies(network);
        if (names.map((name) => name.toLowerCase()).includes('all')) {
            return allStrategies.map((strategy) => strategy.address);
        }
        const filteredStrategies = names.map((name) =>
            allStrategies
                .filter((strategy) =>
                    strategy.name.toLowerCase().includes(name.toLowerCase())
                )
                .map((strategy) => strategy.address)
        );
        const flattenResults = flattenArrays(filteredStrategies);
        return Array.from(new Set(flattenResults));
    }

    if (names.map((name) => name.toLowerCase()).includes('all')) {
        const allStrategies = await getAllStrategies(network);
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
            const nameAddresses =
                await getAssetsStrategiesAddressesByFilterNames(
                    [nameOrAddress],
                    network
                );
            addresses.push(...nameAddresses);
        }
    }
    return Array.from(new Set<string>(addresses));
};

export const getDust = async (strategy: Strategy, network: Network) => {
    const provider = getEthersDefaultProvider(network);
    const token = new Contract(strategy.token.address, TokenABI.abi, provider);
    return await token.balanceOf(strategy.address);
};

export const getStrategyTVLsPerProtocol = async (
    protocolName: string,
    aliases: string[],
    network: Network,
    includeStrategies: string[] = [],
    excludeStrategies: string[] = []
): Promise<ProtocolTVL> => {
    const [excludeStrategyAddresses, includeStrategyAddresses] =
        await Promise.all([
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
                const dust = await getDust(strategy, network);
                const [
                    estimatedTotalAssetsUsdc,
                    debtOutstandingUsdc,
                    dustUsdc,
                ] = await Promise.all([
                    getTokenPrice(
                        strategy.token,
                        strategy.estimatedTotalAssets,
                        network
                    ),
                    getTokenPrice(
                        strategy.token,
                        strategy.debtOutstanding,
                        network
                    ),
                    getTokenPrice(strategy.token, dust, network),
                ]);
                return {
                    ...strategy,
                    estimatedTotalAssetsUsdc,
                    debtOutstandingUsdc,
                    dustUsdc,
                };
            } else {
                // estimatedTotalAssets failed, do not request USDC value
                return {
                    ...strategy,
                    estimatedTotalAssetsUsdc: new BigNumber(0),
                    debtOutstandingUsdc: new BigNumber(0),
                    dustUsdc: new BigNumber(0),
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

export const getWarnings = (strategies: Strategy[]): string[] => {
    let warnings: string[] = [];
    strategies.forEach((strat) => {
        if (strat.errors.length > 0) {
            warnings = warnings.concat(strat.errors);
        }
    });

    return warnings;
};

export const getAssetsStrategiesAddressesByFilterKeepCRV = async (
    network: Network
): Promise<string[]> => {
    const helper = getStrategiesHelperInstance(network);
    const results = await helper[
        'assetsStrategiesAddressesByFilter(string[][])'
    ]([
        ['VALUE', '1000', 'DECIMAL'],
        ['KEY', 'keepCRV', 'DECIMAL'],
        ['OPERATOR', 'GTE'],
    ]);
    const flattenResults = flattenArrays(results);
    return Array.from(new Set(flattenResults));
};

export const getKeepCRVStrategyTVLsPerProtocol = async (network: Network) => {
    const result = await getAssetsStrategiesAddressesByFilterKeepCRV(network);
    const strategyAddresses = [...result];
    return strategyAddresses;
};
