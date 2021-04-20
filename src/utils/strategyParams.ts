import { ContractCallReturnContext } from 'ethereum-multicall';
import { BigNumber } from 'ethers';
import { sortBy } from 'lodash';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { StrategyParams, Strategy, Vault } from '../types';

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);

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
            y: parseInt(params.debtRatio.toString(), 10) / 100,
        };
    });

    const debtUsage = parseInt(vault.debtUsage) / 100;

    if (debtUsage < 100) {
        strategiesAllocations.push({
            name: 'Not Allocated',
            y: 100 - debtUsage,
        });
    }

    const sortedAllocs = sortBy(strategiesAllocations, [
        'y',
    ]) as ChartSeriesData[];

    sortedAllocs[sortedAllocs.length - 1].sliced = true;
    sortedAllocs[sortedAllocs.length - 1].selected = true;

    return sortedAllocs;
};

const mapParamDisplayValues = (param: any): StrategyParams => {
    if (param.activation && dayjs.unix(parseInt(param.activation)).isValid()) {
        param.activation = dayjs.unix(parseInt(param.activation)).toISOString();
    }
    if (param.lastReport && dayjs.unix(parseInt(param.lastReport)).isValid()) {
        const unixTimestamp = dayjs.unix(parseInt(param.lastReport));
        param.lastReport = unixTimestamp.toISOString();
        param.lastReportText = unixTimestamp.toNow(true);
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
