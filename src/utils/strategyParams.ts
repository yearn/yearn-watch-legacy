import {
    ContractCallReturnContext,
} from 'ethereum-multicall';
import { BigNumber } from 'ethers';
import { sortBy } from 'lodash';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import { formatBPS } from './commonUtils';
import { StrategyParams, Strategy, Vault } from '../types';

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime)

const STRATEGIES_METHOD = 'strategies';

const STRAT_PARAMS_V030: string[] = [
    'performanceFee',
    'activation',
    'debtRatio',
    'rateLimit',
    'lastReport',
    'totalDebt',
    'totalGain',
    'totalLoss'
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
    'totalLoss'
];

const mapVersions = new Map<string, string[]>();
mapVersions.set('0.3.0', STRAT_PARAMS_V030);
mapVersions.set('0.3.1', STRAT_PARAMS_V030);
mapVersions.set('0.3.2', STRAT_PARAMS_V032);
mapVersions.set('0.3.3', STRAT_PARAMS_V032);

export type ChartSeriesData = {
    name: string;
    y: number;
    sliced?: boolean;
    selected?: boolean;
}

export const getChartData = (vault: Vault): ChartSeriesData[] => {
    const strategiesAllocations = vault.strategies.map(({ name, params }) => {
        return {
            name,
            y: params.debtRatio.toNumber() / 100,
        }
    });

    const debtUsage = parseInt(vault.debtUsage) / 100;

    if (debtUsage < 100) {
        strategiesAllocations.push({
            name: 'not allocated',
            y: 100 - debtUsage,
        });
    }

    return sortBy(strategiesAllocations, ['y']);
}

const mapParamDisplayValues = (param: any): StrategyParams => {
    if (param.activation) {
        param.activation = dayjs.unix(parseInt(param.activation)).format('L LT');
    }
    if (param.lastReport) {
        param.lastReport = dayjs.unix(parseInt(param.lastReport)).toNow();
    }

    return param;
}

export const getTotalDebtUsage = (strategies: Strategy[]): string => {
    let debtUsed = BigNumber.from(0);
    strategies.forEach(({ params }) => {
        debtUsed = debtUsed.add(params.debtRatio);
    });
    return debtUsed.toString();
}

export const mapStrategyParams = (result: ContractCallReturnContext, apiVersion: string): StrategyParams  => {
    let params: any = {};
    result.callsReturnContext.forEach(({ methodName, returnValues }) => {
        if (methodName === STRATEGIES_METHOD && returnValues && returnValues.length > 0) {
            const props =  mapVersions.get(apiVersion) || STRAT_PARAMS_V032;

            returnValues.forEach((val, i) => {
                // @ts-ignore
                params[props[i]] = BigNumber.from(
                    val
                ).toString();
            });
        }
    });

    return mapParamDisplayValues(params);
}

