import axios from 'axios';
import { memoize } from 'lodash';

export const { get, all, post, put, spread } = axios;

const API_URL = 'https://vaults.finance';

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
