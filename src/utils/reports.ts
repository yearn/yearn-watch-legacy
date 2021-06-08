import { get, omit } from 'lodash';
import { querySubgraphData } from './apisRequest';

const buildReportsQuery = (strategy: string): string => `
{
    strategies(where: {
      id: "${strategy}"
    }) {
        id
        reports(first: 5, orderBy: timestamp, orderDirection: desc)  {
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
          }
        }
      }
  }
`;

type StratReportGrahType = {
    debtAdded: string;
    debtLimit: string;
    debtPaid: string;
    gain: string;
    timestamp: string;
    totalDebt: string;
    totalGain: string;
    totalLoss: string;
    results: {
        apr: string;
        duration: string;
        durationPr: string;
        startTimestamp: string;
        endTimestamp: string;
    };
    transaction: {
        hash: string;
    };
};

type StratReportGraphResult = {
    data: [
        {
            id: string;
            reports: StratReportGrahType[];
        }
    ];
};

export type StrategyReport = {
    debtAdded: string;
    debtLimit: string;
    debtPaid: string;
    gain: string;
    timestamp: string;
    totalDebt: string;
    totalGain: string;
    totalLoss: string;
    transactionHash: string;
    // TODO: add later
    // apr: string;
};

export const getReportsForStrategy = async (
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
    console.log('reportResults', reportResults);
    const reports: StratReportGrahType[] = get(
        reportResults,
        'data.strategies[0].reports',
        []
    );

    const OMIT_FIELDS = ['results', 'transaction', 'id'];

    return reports.map((report) => {
        return {
            ...(omit(report, OMIT_FIELDS) as StratReportGrahType),
            transactionHash: report.transaction.hash,
            // TODO: add later
            // apr: get(report, 'results[0].apr'),
        };
    });
};
