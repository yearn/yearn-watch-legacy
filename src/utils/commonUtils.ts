import {
    ContractCallReturnContext,
} from 'ethereum-multicall';
import { get } from 'lodash';
import { BigNumber } from 'ethers';

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


export const formatBPS = (val: string): string => {    
    return (parseInt(val, 10)/ 100).toString();
} 

export const mapContractCalls = (result: ContractCallReturnContext) => {
    let mappedObj: any = {};
    result.callsReturnContext.forEach(({ methodName, returnValues }) => {
        if (returnValues && returnValues.length > 0) {
            if (
                typeof returnValues[0] === 'string' ||
                typeof returnValues[0] === 'boolean'
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
