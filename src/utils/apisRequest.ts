import axios from 'axios';
import { memoize } from 'lodash';

export const { get, all, post, put, spread } = axios;

const API_URL = 'https://api.yearn.finance/v1/chains/1';
const SUBGRAPH_URL =
    'https://api.thegraph.com/subgraphs/name/salazarguille/yearn-vaults-v2-subgraph-mainnet';

const getData = async (url: string) => {
    const payload: any = [];
    try {
        const response = await axios.get(`${API_URL}${url}`);

        return response;
    } catch (error) {
        console.log('error');
    }
    return payload.data;
};

export const BuildGet = memoize(getData);

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
