import BigNumber from 'bignumber.js';
import { StrategyTVL } from './strategy-tvl';

export class ProtocolTVL {
    constructor(
        public name: string,
        public tvl: BigNumber,
        public strategies: Array<StrategyTVL>
    ) {}

    hasName(name: string): boolean {
        return this.name.toLowerCase() === name.toLowerCase();
    }
}
