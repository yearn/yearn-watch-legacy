import { ContractCallReturnContext } from 'ethereum-multicall';
import { BigNumber } from 'ethers';
import { sortBy } from 'lodash';
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

const mapVersions = new Map<string, string[]>();
mapVersions.set('0.3.0', STRAT_PARAMS_V030);
mapVersions.set('0.3.1', STRAT_PARAMS_V030);
mapVersions.set('0.3.2', STRAT_PARAMS_V032);
mapVersions.set('0.3.3', STRAT_PARAMS_V032);
mapVersions.set('0.3.3.Edited', STRAT_PARAMS_V030);

export type ChartSeriesData = {
    name: string;
    y: number;
    sliced?: boolean;
    selected?: boolean;
};

export const getChartData = (vault: Vault): ChartSeriesData[] => {
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

    const sortedAllocs = sortBy(strategiesAllocations, [
        'y',
    ]) as ChartSeriesData[];

    sortedAllocs[sortedAllocs.length - 1].sliced = true;
    sortedAllocs[sortedAllocs.length - 1].selected = true;

    return sortedAllocs;
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
    const params: any = {};
    result.callsReturnContext.forEach(({ methodName, returnValues }) => {
        if (
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
        }
    });

    return mapParamDisplayValues(params);
};
