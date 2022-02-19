/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { memoize } from 'lodash';

import getNetworkConfig from './config';
import { Network } from '../types';

export const { get, all, post, put, spread } = axios;

type ApiDataResponse = {
    data: any[];
};

export const VAULTS_ALL_EXPERIMENTAL = '/vaults/experimental';
export const VAULTS_ALL = '/vaults/all';
const API_URL = 'https://api.yearn.finance/v1/chains/1';

const _getApiData = async (endpoint: string): Promise<ApiDataResponse> => {
    try {
        const response = await axios.get(`${API_URL}${endpoint}`);
        return response as ApiDataResponse;
    } catch (error) {
        console.log('error fetching data', error);
        throw error;
    }
};

export const getApiData = memoize(_getApiData);

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

const querySubgraph = async (
    query: string,
    network: Network = Network.mainnet
): Promise<SubgraphResponse> => {
    const { subgraphUrl } = getNetworkConfig(network);
    try {
        const response: SubgraphAPIResponse = await axios.post(
            `${subgraphUrl}`,
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
