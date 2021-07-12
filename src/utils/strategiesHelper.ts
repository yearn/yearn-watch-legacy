import { Strategy } from '../types';
import { getStrategiesHelperInstance } from './abi';
import { getTokenPrice } from './oracle';
import BigNumber from 'bignumber.js';
import { ProtocolTVL } from '../types/protocol-tvl';
import { StrategyTVL } from '../types/strategy-tvl';
import { getStrategies } from './strategies';

export const getStrategyTVLsPerProtocol = async (
    protocol: string
): Promise<ProtocolTVL> => {
    const helper = getStrategiesHelperInstance();
    const result = await helper[
        'assetsStrategiesAddressesByFilter(string[][])'
    ]([
        ['KEY', 'name', 'STRING'],
        ['VALUE', protocol.toLowerCase(), 'STRING'],
        ['OPERATOR', 'LIKE'],
    ]);
    if (result.length === 0) {
        return new ProtocolTVL(protocol, new BigNumber(0), []);
    }
    const strategyAddresses = result.filter(
        (address: any) => address !== undefined
    );
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
    return new ProtocolTVL(protocol, protocolTVL, strategies);
};
