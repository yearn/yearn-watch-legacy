import BigNumber from 'bignumber.js';
import { StrategyTVL } from './strategy-tvl';
import { isValidTimestamp } from '../utils/dateUtils';

export class ProtocolTVL {
    constructor(
        public name: string,
        public tvl: BigNumber,
        public activation: number,
        public strategies: Array<StrategyTVL>
    ) {}

    getLongevityDays(): number {
        if (this.activation && isValidTimestamp(this.activation.toString())) {
            const diffMs = Date.now() - this.activation;
            const diffDays = diffMs / 1000 / 60 / 60 / 24;
            return diffDays;
        }
        return 0;
    }

    hasName(name: string): boolean {
        return this.name.toLowerCase() === name.toLowerCase();
    }
}
