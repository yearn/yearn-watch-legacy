import axios from 'axios';
import { Network, NetworkId } from '../types';
import { GroupingsList } from '../types/grouping';

const RISK_GH_URL =
    'https://raw.githubusercontent.com/yearn/yearn-data-analytics/master/src/risk_framework/risks.json';
const RISK_API_URL = 'https://d3971bp2359cnv.cloudfront.net/api/riskgroups/';

export const initRiskFrameworkScores = async (
    network: string
): Promise<GroupingsList> => {
    const index = Object.values(Network).indexOf(network as Network);
    const key = Object.keys(Network)[index];
    const networkId = NetworkId[key as keyof typeof NetworkId];

    // try to fetch directly from github first
    const responseGithub = await axios.get(RISK_GH_URL);
    if (responseGithub.status === 200) {
        const riskGroups = responseGithub.data as GroupingsList;
        const result = riskGroups.filter(
            (group) => parseInt(group.network) === networkId
        );
        return result;
    }
    // try to fetch from the api
    const responseApi = await axios.get(RISK_API_URL);
    if (responseApi.status === 200) {
        const riskGroups = responseApi.data as GroupingsList;
        const result = riskGroups.filter(
            (group) => parseInt(group.network) === networkId
        );
        return result;
    }
    // return empty array if not found
    return [];
};
