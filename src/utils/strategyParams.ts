import { StrategyMetadata } from '@yfi/sdk';
import { ContractCallReturnContext } from 'ethereum-multicall';
import { BigNumber } from 'ethers';
import { get, sortBy } from 'lodash';

import { BarChartData } from '../components/app/Charts/BarChart';
import { StrategyParams, Strategy, Vault } from '../types';
import { isValidTimestamp, toIsoString, toHumanDateText } from './dateUtils';

const STRATEGIES_METHOD = 'strategies';

const STRAT_PARAMS_V030: string[] = [
    'performanceFee',
    'activation',
    'debtRatio',
    'rateLimit',
    'lastReport',
    'totalDebt',
    'totalGain',
    'totalLoss',
];

const STRAT_PARAMS_V032: string[] = [
    'performanceFee',
    'activation',
    'debtRatio',
    'minDebtPerHarvest',
    'maxDebtPerHarvest',
    'lastReport',
    'totalDebt',
    'totalGain',
    'totalLoss',
];

// Used if strategy protocols are not in Yearn Meta
const UNKNOWN_PROTOCOL = 'Unknown';

const mapVersions = new Map<string, string[]>();
mapVersions.set('0.3.0', STRAT_PARAMS_V030);
mapVersions.set('0.3.1', STRAT_PARAMS_V030);
mapVersions.set('0.3.2', STRAT_PARAMS_V032);
mapVersions.set('0.3.3', STRAT_PARAMS_V032);
mapVersions.set('0.3.3.Edited', STRAT_PARAMS_V030);

export const getStrategyAllocation = (vault: Vault): BarChartData[] => {
    const strategiesAllocations = vault.strategies.map(({ name, params }) => {
        return {
            name,
            y: Number(
                (parseInt(params.debtRatio.toString(), 10) / 100).toFixed(2)
            ),
        };
    });

    const debtUsage = parseInt(vault.debtUsage) / 100;
    if (debtUsage < 100) {
        strategiesAllocations.push({
            name: 'Not Allocated',
            y: Number((100 - debtUsage).toFixed(2)),
        });
    }

    return sortBy(strategiesAllocations, ['y']) as BarChartData[];
};

export const getProtocolAllocation = (
    vault: Vault,
    metadata: StrategyMetadata[]
): BarChartData[] => {
    // Strategies may allocate to multiple protocol but for simplicity,
    // this calculation assumes that allocations are split equally
    const strategyToProtocols: { [key: string]: string[] } = {};
    metadata.forEach(({ address, protocols }) => {
        strategyToProtocols[address.toLowerCase()] = protocols;
    });

    const protocolDebtRatios: { [key: string]: number } = {};
    let totalDebtRatio = 0;

    vault.strategies.forEach(({ address, params }) => {
        const protocols = get(strategyToProtocols, address.toLowerCase(), []);
        if (protocols.length === 0) {
            totalDebtRatio += updateProtocolDebtRatios(
                protocolDebtRatios,
                UNKNOWN_PROTOCOL,
                params
            );
        } else {
            protocols.forEach((protocol) => {
                totalDebtRatio += updateProtocolDebtRatios(
                    protocolDebtRatios,
                    protocol,
                    params
                );
            });
        }
    });

    if (totalDebtRatio === 0) {
        return [
            {
                name: 'Not Allocated',
                y: Number((100).toFixed(2)),
            },
        ];
    }

    const protocolAllocations: BarChartData[] = [];
    const debtUsage = parseInt(vault.debtUsage) / 100;
    if (debtUsage < 100) {
        protocolAllocations.push({
            name: 'Not Allocated',
            y: Number((100 - debtUsage).toFixed(2)),
        });
    }

    // Normalize protocol debt ratios to debtUsage
    const protocols = Object.keys(protocolDebtRatios);
    protocols.forEach((protocol) => {
        if (protocolDebtRatios[protocol] > 0) {
            protocolAllocations.push({
                name: protocol,
                y: Number(
                    (
                        (protocolDebtRatios[protocol] / totalDebtRatio) *
                        debtUsage
                    ).toFixed(2)
                ),
            });
        }
    });

    return sortBy(protocolAllocations, ['y']) as BarChartData[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapParamDisplayValues = (param: any): StrategyParams => {
    if (param.activation && isValidTimestamp(param.activation)) {
        param.activation = toIsoString(param.activation);
    }
    if (param.lastReport && isValidTimestamp(param.lastReport)) {
        const { lastReport } = param;
        param.lastReport = toIsoString(lastReport);
        param.lastReportText = toHumanDateText(lastReport);
    }

    return param;
};

export const getTotalDebtUsage = (strategies: Strategy[]): string => {
    let debtUsed = BigNumber.from(0);
    strategies.forEach(({ params }) => {
        debtUsed = debtUsed.add(params.debtRatio);
    });
    return debtUsed.toString();
};

export const mapStrategyParams = (
    result: ContractCallReturnContext,
    apiVersion: string
): StrategyParams => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { errors: [] };
    result.callsReturnContext.forEach(
        ({ methodName, returnValues, success }) => {
            if (
                success &&
                methodName === STRATEGIES_METHOD &&
                returnValues &&
                returnValues.length > 0
            ) {
                // TODO: resolve version ABI based on vault instead of strategy
                const props = mapVersions.get(apiVersion) || STRAT_PARAMS_V032;

                returnValues.forEach((val, i) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    params[props[i]] = BigNumber.from(val).toString();
                });
            } else {
                params.errors.push(methodName);
            }
        }
    );

    return mapParamDisplayValues(params);
};

const updateProtocolDebtRatios = (
    protocolDebtRatios: { [key: string]: number },
    protocol: string,
    params: StrategyParams
) => {
    const cur = get(protocolDebtRatios, protocol, 0);
    const debtRatio = Number(parseInt(params.debtRatio.toString(), 10));
    protocolDebtRatios[protocol] = cur + debtRatio;
    return debtRatio;
};
