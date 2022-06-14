import { memoize, values, omit } from 'lodash';
import { Env } from '../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: __dirname + '../../.env' });

export const getEnv = memoize(
    (): Env => ({
        env: process.env.NODE_ENV,
        ethereumNetwork: 'homestead',
        infuraProjectId: process.env.INFURA_PROJECT_ID,
        alchemyKey:
            process.env.ALCHEMY_KEY || process.env.REACT_APP_ALCHEMY_KEY,
        fantomNode:
            process.env.FANTOM_NODE || process.env.REACT_APP_FANTOM_NODE,
        theGraphKey:
            process.env.THE_GRAPH_API_KEY ||
            process.env.REACT_APP_THE_GRAPH_API_KEY,
        fbApiKey: process.env.REACT_APP_FB_API_KEY,
        fbAuthDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
        fbProjectId: process.env.REACT_APP_FB_PROJECT_ID,
        // TODO: replace apiKey for production key, get from ENV variable
        ethplorerKey: 'freekey',
        // risk framework api
        riskGithub: 
            'https://raw.githubusercontent.com/yearn/yearn-data-analytics/master/src/risk_framework/risks.json',
        riskApi: 'https://d3971bp2359cnv.cloudfront.net/api/riskgroups/',
    })
);

export const sanitizeErrors = (
    errorString: string,
    environment?: Env
): string => {
    const env = environment || getEnv();

    const filteredEnv = omit(env, ['env', 'ethereumNetwork']);

    let sanitizedError = errorString;
    values(filteredEnv).forEach((val) => {
        if (val) {
            sanitizedError = sanitizedError.replace(val, 'redacted');
        }
    });

    return sanitizedError;
};
