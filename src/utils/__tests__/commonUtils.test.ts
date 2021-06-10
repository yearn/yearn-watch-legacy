import { displayAmount } from '../commonUtils';

describe('#DisplayAmount', () => {
    it.each([
        ['61776792004700431', '0.06178'],
        ['559434119616550549964644', '559,434'],
        ['0', '0'],
    ])('should display %i to be %s', (amt, expected) => {
        const decimals = 18;

        const res = displayAmount(amt, decimals);
        expect(res).toBe(expected);
    });
});
