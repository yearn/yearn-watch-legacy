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
        fbApiKey: process.env.REACT_APP_FB_API_KEY,
        fbAuthDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
        fbProjectId: process.env.REACT_APP_FB_PROJECT_ID,
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
