import { BigNumber } from 'ethers';
import { isNumber } from 'lodash';
 
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
    if (isNumber(val)) return val;
    
    return BigNumber.from(val).div(100).toString();
} 
