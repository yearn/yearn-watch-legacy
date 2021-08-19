import { constants } from 'ethers';
import { displayAmount, msToHours } from '../commonUtils';

describe('#DisplayAmount', () => {
    it.each([
        ['61776792004700431', 18, undefined, '0.06178'],
        ['559434119616550549964644', 18, undefined, '559,434.11962'],
        ['0', 18, undefined, '0'],
        ['553183935', 8, undefined, '5.53184'],
        ['20819427', 8, undefined, '0.20819'],
        ['1554848178', 18, undefined, '0'],
        [constants.MaxUint256.toString(), 18, undefined, ' ∞'],
        [constants.One.toString(), 18, undefined, '0'],
        [constants.One.toString(), 18, 18, '0.000000000000000001'],
    ])(
        'should display %s with %d decimals and precision %d to be %s',
        (amt, decimals, precision, expected) => {
            const res = displayAmount(amt, decimals, precision);
            expect(res).toBe(expected);
        }
    );
});

describe('#msToHours', () => {
    it.each([
        [1131227000, 314.23],
        [229752000, 63.82],
    ])('should display %i as %j', (ms, expected) => {
        const res = msToHours(ms);
        expect(res).toBe(expected);
    });
});
