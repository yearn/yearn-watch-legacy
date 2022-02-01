import {
    ContractCallContext,
    ContractCallReturnContext,
    ContractCallResults,
} from 'ethereum-multicall';
import { get } from 'lodash';
import { BigNumber, BigNumberish, constants } from 'ethers';
import { BigNumber as BN } from 'bignumber.js';
import {
    StrategyAddressQueueIndex,
    VaultApi,
    CallContext,
    Network,
} from '../types';
import { values } from 'lodash';
import {
    getStrategiesHelperAddress,
    getUSDCAddress,
} from './contracts/addresses';
import { getABIStrategiesHelper } from './contracts/ABI';

export const isUSDC = (token: string, network: Network): boolean => {
    return token.toLowerCase() === getUSDCAddress(network);
};

export const toUnits = (amount: BigNumberish, decimals: number): BN => {
    return new BN(amount.toString()).div(new BN(10).pow(decimals));
};

export const toDecimals = (amount: BigNumberish, decimals: number): BN => {
    return new BN(amount.toString()).times(new BN(10).pow(decimals));
};

export const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
export const STRATEGY_APR_DECIMALS = 18;

export const extractAddress = (address: string) => {
    return (
        address.substring(0, 6) +
        '...' +
        address.substring(address.length - 4, address.length)
    );
};

export const extractText = (text: string) => {
    return text.substring(0, 20) + '...';
};

export const displayAmount = (
    amount: string,
    decimals: number,
    precision: number | undefined = 5
): string => {
    if (amount === constants.MaxUint256.toString()) return ' ∞';
    const tokenBits = BigNumber.from(10).pow(decimals);

    const trailingZeros = '.' + '0'.repeat(precision);

    const display = new BN(amount)
        .div(tokenBits.toString())
        .toFormat(precision)
        // strip trailing zeros for display
        .replace(trailingZeros, '');

    return display.toString();
};

export const displayAprAmount = (
    amount: string,
    decimals = STRATEGY_APR_DECIMALS
): string => {
    const newAmount = new BN(amount).times(100);
    return displayAmount(newAmount.toString(), decimals, 2);
};

export const msToHours = (ms: number): number => {
    return Number((ms / (1000 * 60 * 60)).toFixed(2));
};

export const sub = (amountA: string, amountB: string): string => {
    return BigNumber.from(amountA).sub(amountB).toString();
};

export const formatBPS = (val: string): string => {
    return (parseInt(val, 10) / 100).toString();
};

export const mapContractCalls = (result: ContractCallReturnContext) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedObj: any = { errors: [] };
    result.callsReturnContext.forEach(
        ({ methodName, returnValues, success }) => {
            if (success && returnValues && returnValues.length > 0) {
                if (
                    typeof returnValues[0] === 'string' ||
                    typeof returnValues[0] === 'boolean' ||
                    typeof returnValues[0] === 'number'
                ) {
                    mappedObj[methodName] = returnValues[0];
                } else if (get(returnValues[0], 'type') === 'BigNumber') {
                    mappedObj[methodName] = BigNumber.from(
                        returnValues[0]
                    ).toString();
                }
            } else {
                mappedObj.errors.push(methodName);
            }
        }
    );
    return mappedObj;
};

export const createStrategiesHelperCallAssetStrategiesAddresses = (
    vaults: VaultApi[],
    network: Network
): ContractCallContext => {
    const strategiesHelperAddress = getStrategiesHelperAddress(network);
    const strategiesHelperCalls: CallContext[] = vaults.map((vault) => {
        return {
            methodName: 'assetStrategiesAddresses',
            methodParameters: [vault.address],
            reference: strategiesHelperAddress,
        };
    });
    return {
        reference: strategiesHelperAddress,
        contractAddress: strategiesHelperAddress,
        abi: getABIStrategiesHelper(),
        calls: strategiesHelperCalls,
    };
};

export const mapToStrategyAddressQueueIndex = (
    vaultAddress: string,
    network: Network,
    strategiesHelperCallsResults?: ContractCallResults
): StrategyAddressQueueIndex[] => {
    if (!strategiesHelperCallsResults) {
        return [];
    }
    const strategiesHelperAddress = getStrategiesHelperAddress(network);
    const strategiesHelperCallsReturnContext =
        strategiesHelperCallsResults.results[strategiesHelperAddress]
            .callsReturnContext;

    const strategiesHelperCallsReturnContextList = values(
        strategiesHelperCallsReturnContext
    );
    const strategiesQueuePosition = strategiesHelperCallsReturnContextList.find(
        (item) =>
            item.methodParameters[0].toLowerCase() ===
            vaultAddress.toLowerCase()
    );
    let strategiesQueueIndexes: Array<StrategyAddressQueueIndex>;
    if (strategiesQueuePosition === undefined) {
        strategiesQueueIndexes = Array<{
            queueIndex: number;
            address: string;
        }>();
    } else {
        strategiesQueueIndexes = strategiesQueuePosition?.returnValues.map(
            (value: unknown, index: number) => {
                return {
                    queueIndex: index,
                    address: (value as string).toLowerCase(),
                };
            }
        );
    }
    return strategiesQueueIndexes;
};

export const amountToString = (amount: BN): string => {
    const amountInMMs = amount.div(new BN(1000000));
    if (amountInMMs.gt(0)) {
        return `${amountInMMs.toFixed(2)} MM`;
    }
    const amountInKs = amount.div(new BN(100000));
    if (amountInKs.gt(0)) {
        return `${amountInKs.toFixed(2)} K`;
    }
    return `${amount.toFixed(2)}`;
};

export const amountToMMs = (amount: BN): number => {
    return amount.div(new BN(1000000)).toNumber();
};

export const getMedian = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2),
        numbers = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0
        ? numbers[mid]
        : (numbers[mid - 1] + numbers[mid]) / 2;
};

export const getAverage = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const flattenArrays = (arr: any[]): string[] => {
    return arr.reduce((flat, toFlatten) => {
        return flat.concat(
            Array.isArray(toFlatten)
                ? flattenArrays(toFlatten)
                : toFlatten.toString().toLowerCase()
        );
    }, []);
};

export const sumAll = (items: number[]) =>
    items.reduce((sum, item) => {
        return sum + item;
    }, 0);
