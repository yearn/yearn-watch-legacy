import axios from 'axios';
import { memoize } from 'lodash';
import { VaultVersion } from '../types';

export const { get, all, post, put, spread } = axios;

type ApiDataResponse = {
    data: any[];
};

const LEGACY_API_URL = 'https://vaults.finance';
const API_URL = 'https://api.yearn.finance/v1/chains/1';
const SUBGRAPH_URL =
    'https://api.thegraph.com/subgraphs/name/salazarguille/yearn-vaults-v2-subgraph-mainnet';

const filterToExperimentals = (res: any): ApiDataResponse => {
    const response = { data: [] };
    response.data =
        res &&
        res.data &&
        res.data.filter(
            (vault: any) =>
                vault.endorsed === false &&
                vault.type.toLowerCase() === VaultVersion.V2
        );
    return response;
};

const getData = async (
    url: string,
    useExperimentals = false
): Promise<ApiDataResponse> => {
    const payload: ApiDataResponse = { data: [] };
    const apiUrl = useExperimentals ? LEGACY_API_URL : API_URL;
    try {
        const response = await axios.get(`${apiUrl}${url}`);

        if (!useExperimentals) {
            return response;
        }

        return filterToExperimentals(response);
    } catch (error) {
        console.log('error fetching data', error);
    }

    return payload;
};

export const BuildGet = memoize(getData);
export const BuildGetExperimental = memoize((url: string) =>
    getData(url, true)
);

type SubgraphAPIResponse = {
    data: {
        data?: any;
        errors?: any[];
    };
    status: number;
    statusText: string;
    config: any;
    request: any;
    headers: any;
};

type SubgraphResponse = {
    data: any;
};

/*
config: {url: "https://api.thegraph.com/subgraphs/name/salazarguille/yearn-vaults-v2-subgraph-mainnet", method: "post", data: "{"query":"\n{\n\tvaults {\n    id\n    tags\n    t…it\n        debtAdded\n      }\n    }\n  }\n}\n"}", headers: {…}, transformRequest: Array(1), …}
data: {data: {…}}
headers: {content-type: "application/json"}
request: XMLHttpRequest {readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, onreadystatechange: ƒ, …}
status: 200
statusText: ""
*/
const querySubgraph = async (query: string): Promise<SubgraphResponse> => {
    try {
        const response: SubgraphAPIResponse = await axios.post(
            `${SUBGRAPH_URL}`,
            {
                query,
            }
        );
        if (response.data.errors && response.data.errors.length > 0) {
            throw Error(
                response.data.errors[0].message ||
                    'Error: retrieving data from subgraph'
            );
        }
        return {
            data: response.data.data,
        };
    } catch (error) {
        console.error('subgraph error', error);
        throw error;
    }
};

export const querySubgraphData = memoize(querySubgraph);
