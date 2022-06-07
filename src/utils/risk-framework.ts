import axios from 'axios';
import { Network, NetworkId } from '../types';
import { GroupingsList } from '../types/grouping';
import riskFrameworkJson from './config/risks.json';

const RISK_GH_URL =
    'https://raw.githubusercontent.com/yearn/yearn-data-analytics/master/src/risk_framework/risks.json';
const RISK_API_URL = 'https://d3971bp2359cnv.cloudfront.net/api/riskgroups/';

export const initRiskFrameworkScores = async (
    network: string
): Promise<GroupingsList> => {
    const index = Object.values(Network).indexOf(network as Network);
    const key = Object.keys(Network)[index];
    const networkId = NetworkId[key as keyof typeof NetworkId];

    // try to fetch data in the following order
    const endpoints = [RISK_GH_URL, RISK_API_URL];
    for (const endpoint of endpoints) {
        const response = await axios.get(endpoint);
        if (response.status === 200) {
            const riskGroups = response.data as GroupingsList;
            const result = riskGroups.filter(
                (group) => parseInt(group.network) === networkId
            );
            return result;
        }
    }
    // return directly from the json file
    const riskFramework = riskFrameworkJson as unknown as GroupingsList;
    return riskFramework.filter(
        (group) => parseInt(group.network) === networkId
    );
};
