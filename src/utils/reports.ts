import { difference, get, omit, memoize, values } from 'lodash';
import { Network } from '../types';

import { StrategyReportContextValue } from '../contexts/StrategyReportContext';

const OMIT_FIELDS = ['results', 'transaction', 'id'];

const buildReportsQuery = (strategies: string[]): string => `
{
    strategies(where: {
      id_in: ["${strategies.join('","')}"]
    }) {
        id
        reports(first: 10, orderBy: timestamp, orderDirection: desc)  {
          id
          transaction {
            hash
          }
          timestamp
          gain
          loss
          totalGain
          totalLoss
          totalDebt
          debtLimit
          debtAdded
          debtPaid
          results {
            startTimestamp
            endTimestamp
            duration
            apr
            durationPr
            currentReport {
                id
                gain
                loss
                totalDebt
                totalGain
                totalLoss
                timestamp
                transaction { hash blockNumber }
            }
            previousReport {
                id
                gain
                loss
                totalDebt
                totalGain
                totalLoss
                timestamp
                transaction { hash blockNumber }
            }
          }
        }
      }
  }
`;

type StratReportGraphType = {
    debtAdded: string;
    debtLimit: string;
    debtPaid: string;
    gain: string;
    loss: string;
    timestamp: string;
    totalDebt: string;
    totalGain: string;
    totalLoss: string;
    results: Array<{
        apr: string;
        duration: string;
        durationPr: string;
        startTimestamp: string;
        endTimestamp: string;
        currentReport: {
            id: string;
            gain: string;
            loss: string;
            totalDebt: string;
            totalGain: string;
            totalLoss: string;
            timestamp: number;
            transaction: {
                hash: string;
            };
        };
        previousReport: {
            id: string;
            gain: string;
            loss: string;
            totalDebt: string;
            totalGain: string;
            totalLoss: string;
            timestamp: number;
            transaction: {
                hash: string;
            };
        };
    }>;
    transaction: {
        hash: string;
    };
};

type StratReportGraphResult = {
    data: {
        strategies: [
            {
                id: string;
                reports: StratReportGraphType[];
            }
        ];
    };
};

type Strategy = {
    id: string;
    reports: StratReportGraphType[];
};

export type StrategyReport = {
    debtAdded: string;
    debtLimit: string;
    debtPaid: string;
    profit: string;
    loss: string;
    timestamp: string;
    totalDebt: string;
    totalProfit: string;
    totalLoss: string;
    transactionHash: string;
    results?: {
        startTimestamp: number;
        endTimestamp: number;
        duration: number;
        apr: number;
        durationPr: number;
        currentReport: {
            id: string;
            gain: string;
            loss: string;
            totalDebt: string;
            totalGain: string;
            totalLoss: string;
            timestamp: number;
            transaction: {
                hash: string;
            };
        };
        previousReport: {
            id: string;
            gain: string;
            loss: string;
            totalDebt: string;
            totalGain: string;
            totalLoss: string;
            timestamp: number;
            transaction: {
                hash: string;
            };
        };
    };
};

export type AllStrategyReports = {
    [id: string]: StrategyReport[];
};

const _parseReportValues = (
    reports: StratReportGraphType[]
): StrategyReport[] => {
    return reports.map((report) => {
        let results;
        if (report.results.length > 0) {
            const result = report.results[0];
            results = {
                ...result,
                currentReport: {
                    ...result.currentReport,
                    timestamp: result.currentReport.timestamp,
                },
                previousReport: {
                    ...result.previousReport,
                    timestamp: result.previousReport.timestamp,
                },
                startTimestamp: parseInt(result.startTimestamp),
                endTimestamp: parseInt(result.endTimestamp),
                duration: parseInt(result.duration),
                durationPr: parseFloat(result.durationPr),
                apr: parseFloat(result.apr) * 100,
            };
        }
        return {
            ...(omit(report, OMIT_FIELDS) as StratReportGraphType),
            profit: report.gain,
            loss: report.loss,
            totalProfit: report.totalGain,
            transactionHash: report.transaction.hash,
            results,
        };
    });
};

export const _getReportsForStrategies = async (
    strategies: string[],
    network: Network,
    strategyReportContext: StrategyReportContextValue
): Promise<void> => {
    if (strategies.length === 0) {
        throw new Error(
            'Error: getReportsForStrategies expected valid strategy address'
        );
    }
    const { strategyReports, updateStrategyReports } = strategyReportContext;
    const cachedStrategies = strategies.filter(
        (s) => s.toLowerCase() in strategyReports
    );

    // Only query for uncached strategies
    const strategiesToQuery = difference(strategies, cachedStrategies);
    if (strategiesToQuery.length > 0) {
        const reportResults: StratReportGraphResult = await querySubgraphData(
            buildReportsQuery(strategiesToQuery.map((s) => s.toLowerCase())),
            network
        );

        const strategyResults: Strategy[] = get(
            reportResults,
            'data.strategies',
            []
        );
        strategyResults.forEach((results) => {
            strategyReports[results.id.toLowerCase()] = _parseReportValues(
                results.reports
            );
        });
        updateStrategyReports(strategyReports);
    }
};

// Functions with more than 2 parameters need a custom key defined for memoization to work correctly.
export const getReportsForStrategies = memoize(
    _getReportsForStrategies,
    (...args) => values(args).join('_')
);
