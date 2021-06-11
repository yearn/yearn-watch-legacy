import { get, omit, memoize } from 'lodash';
import { querySubgraphData } from './apisRequest';

const buildReportsQuery = (strategy: string): string => `
{
    strategies(where: {
      id: "${strategy}"
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
    data: [
        {
            id: string;
            reports: StratReportGraphType[];
        }
    ];
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

const _getReportsForStrategy = async (
    strategy: string
): Promise<StrategyReport[]> => {
    if (!strategy || strategy === '') {
        throw new Error(
            'Error: getReportsForStrategy expected valid strategy address'
        );
    }
    const reportResults: StratReportGraphResult = await querySubgraphData(
        buildReportsQuery(strategy.toLowerCase())
    );

    const reports: StratReportGraphType[] = get(
        reportResults,
        'data.strategies[0].reports',
        []
    );

    const OMIT_FIELDS = ['results', 'transaction', 'id'];
    const values = reports.map((report) => {
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
    return values;
};

export const getReportsForStrategy = memoize(_getReportsForStrategy);
