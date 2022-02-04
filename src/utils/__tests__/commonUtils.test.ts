import {
    ContractCallContext,
    ContractCallReturnContext,
} from 'ethereum-multicall';
import { BigNumber, constants } from 'ethers';
import {
    displayAmount,
    displayAprAmount,
    mapContractCalls,
    msToHours,
    STRATEGY_APR_DECIMALS,
} from '../commonUtils';

describe('#displayAmount', () => {
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

describe('#displayAprAmount', () => {
    it.each([
        ['61776792004700431', '6.18%'],
        ['0', '0.00%'],
    ])('should display %s with to be %s', (amt, expected) => {
        const res = displayAprAmount(amt, STRATEGY_APR_DECIMALS);
        expect(res).toBe(expected);
    });
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

describe('#mapContractCalls', () => {
    const addr = '0xabc123';
    const zero = { type: 'BigNumber', hex: '0x00' };
    const largeNumber = { type: 'BigNumber', hex: '0xcfbd77d85df560' };
    const expectedZero = BigNumber.from(zero.hex).toString();
    const expectedLargeNumber = BigNumber.from(largeNumber.hex).toString();
    const originalContractCallContext: ContractCallContext = {
        reference: addr,
        contractAddress: addr,
        abi: [],
        calls: [],
    };

    it('should preserve nested arrays', () => {
        const inputResults: ContractCallReturnContext = {
            originalContractCallContext,
            callsReturnContext: [
                {
                    decoded: true,
                    methodName: 'nestedArray',
                    methodParameters: [],
                    reference: 'nestedArray',
                    returnValues: [
                        ['LenderIronBankSUSHI', zero, largeNumber, addr],
                    ],
                    success: true,
                },
            ],
        };
        const expectedResults = {
            errors: [],
            nestedArray: [
                [
                    'LenderIronBankSUSHI',
                    expectedZero,
                    expectedLargeNumber,
                    addr,
                ],
            ],
        };
        const res = mapContractCalls(inputResults);
        expect(res).toStrictEqual(expectedResults);
    });

    it('should parse unnested array', () => {
        const inputResults: ContractCallReturnContext = {
            originalContractCallContext,
            callsReturnContext: [
                {
                    decoded: true,
                    methodName: 'array',
                    methodParameters: [addr],
                    reference: 'array',
                    returnValues: [zero, largeNumber, zero],
                    success: true,
                },
            ],
        };
        const expectedResults = {
            errors: [],
            array: [expectedZero, expectedLargeNumber, expectedZero],
        };
        const res = mapContractCalls(inputResults);
        expect(res).toStrictEqual(expectedResults);
    });

    it('should parse single values correctly', () => {
        const inputResults: ContractCallReturnContext = {
            originalContractCallContext,
            callsReturnContext: [
                {
                    decoded: true,
                    methodName: 'bigNumberTest',
                    methodParameters: [addr],
                    reference: 'bigNumberTest',
                    returnValues: [largeNumber],
                    success: true,
                },
                {
                    decoded: true,
                    methodName: 'stringTest',
                    methodParameters: [addr],
                    reference: 'stringTest',
                    returnValues: ['test'],
                    success: true,
                },
                {
                    decoded: true,
                    methodName: 'booleanTest',
                    methodParameters: [addr],
                    reference: 'booleanTest',
                    returnValues: [false],
                    success: true,
                },
            ],
        };
        const expectedResults = {
            errors: [],
            bigNumberTest: expectedLargeNumber,
            stringTest: 'test',
            booleanTest: false,
        };
        const res = mapContractCalls(inputResults);
        expect(res).toStrictEqual(expectedResults);
    });
});
