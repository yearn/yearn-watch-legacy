import { memoize } from 'lodash';
import { Env } from '../types';
require('dotenv').config();

export const getEnv = memoize(
    (): Env => ({
        env: process.env.NODE_ENV,
        ethereumNetwork: 'homestead',
        infuraProjectId: process.env.INFURA_PROJECT_ID,
    })
);
