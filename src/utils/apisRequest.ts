import axios from 'axios';
import { memoize } from 'lodash';

export const { get, all, post, put, spread } = axios;

const API_URL = 'https://vaults.finance';

interface ServerResponse {
    data: ServerData;
}

interface ServerData {
    id?: string;
    name?: number;
}

const getData = async (url: string) => {
    let payload: any = [];
    try {
        const response = await axios.get(`${API_URL}${url}`);

        return response;
    } catch (error) {
        console.log('error');
    }
    console.log('payload--', payload.data);
    return payload.data;
};

export const BuildGet = memoize(getData);
