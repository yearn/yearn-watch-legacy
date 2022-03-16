import BigNumber from 'bignumber.js';
import { StrategyTVL } from './strategy-tvl';

export class ProtocolTVL {
    constructor(
        public name: string,
        public tvl: BigNumber,
        public activation: number,
        public strategies: Array<StrategyTVL>
    ) {}

    getLongevityDays(): number {
        if (this.activation === 0) {
            return 0;
        }
        const diffMs = Date.now() - this.activation;
        const diffDays = diffMs / 1000 / 60 / 60 / 24;
        return diffDays;
    }

    hasName(name: string): boolean {
        return this.name.toLowerCase() === name.toLowerCase();
    }
}
