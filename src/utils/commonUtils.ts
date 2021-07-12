import {
    ContractCallContext,
    ContractCallReturnContext,
} from 'ethereum-multicall';
import { get } from 'lodash';
import { BigNumber, BigNumberish, constants } from 'ethers';
import { BigNumber as BN } from 'bignumber.js';
import { StrategyAddressQueueIndex, VaultApi } from '../types';
import {
    CallContext,
    ContractCallResults,
} from 'ethereum-multicall/dist/models';
import { getABIStrategiesHelper } from './abi';
import { values } from 'lodash';

export const USDC_DECIMALS = 6;
export const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

export const isUSDC = (token: string): boolean => {
    return token.toLowerCase() === USDC_ADDRESS;
};

export const toUnits = (amount: BigNumberish, decimals: number): BN => {
    return new BN(amount.toString()).div(new BN(10).pow(decimals));
};

export const toDecimals = (amount: BigNumberish, decimals: number): BN => {
    return new BN(amount.toString()).times(new BN(10).pow(decimals));
};

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

export const displayAmount = (amount: string, decimals: number): string => {
    if (amount === constants.MaxUint256.toString()) return ' ∞';
    const tokenBits = BigNumber.from(10).pow(decimals);

    const display = new BN(amount)
        .div(tokenBits.toString())
        .toFormat(5)
        // strip trailing zeros for display
        .replace('.00000', '');

    return display;
};

export const msToHours = (ms: number): number => {
    return ms / 1000 / 60 / 24;
};

export const sub = (amountA: string, amountB: string): string => {
    return BigNumber.from(amountA).sub(amountB).toString();
};

export const formatBPS = (val: string): string => {
    return (parseInt(val, 10) / 100).toString();
};

export const mapContractCalls = (result: ContractCallReturnContext) => {
    const mappedObj: any = {};
    result.callsReturnContext.forEach(({ methodName, returnValues }) => {
        if (returnValues && returnValues.length > 0) {
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
        }
    });
    return mappedObj;
};

export const ORACLE_CONTRACT_ADDRESS =
    '0x83d95e0D5f402511dB06817Aff3f9eA88224B030';

export const STRATEGIES_HELPER_CONTRACT_ADDRESS =
    '0x2114d9a16da30fA5B59795e4f8C9eAd19E40f0a0';

export const createStrategiesHelperCallAssetStrategiesAddresses = (
    vaults: VaultApi[]
): ContractCallContext => {
    const strategiesHelperCalls: CallContext[] = vaults.map((vault) => {
        return {
            methodName: 'assetStrategiesAddresses',
            methodParameters: [vault.address],
            reference: STRATEGIES_HELPER_CONTRACT_ADDRESS,
        };
    });
    return {
        reference: STRATEGIES_HELPER_CONTRACT_ADDRESS,
        contractAddress: STRATEGIES_HELPER_CONTRACT_ADDRESS,
        abi: getABIStrategiesHelper(),
        calls: strategiesHelperCalls,
    };
};

export const mapToStrategyAddressQueueIndex = (
    vaultAddress: string,
    strategiesHelperCallsResults: ContractCallResults
): StrategyAddressQueueIndex[] => {
    const strategiesHelperCallsReturnContext =
        strategiesHelperCallsResults.results[STRATEGIES_HELPER_CONTRACT_ADDRESS]
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

/*
    Extreme	> 100M	5
    Very High	less than 100M	4
    High	less than 50M	3
    Medium 	less than 10M	2
    Low	less than 1M	1
*/
export const getTVLRiskLevel = (tvl: number): number => {
    if (tvl < 1) {
        return 1;
    }
    if (tvl < 10) {
        return 2;
    }
    if (tvl < 50) {
        return 3;
    }
    if (tvl < 100) {
        return 4;
    }
    return 5;
};
