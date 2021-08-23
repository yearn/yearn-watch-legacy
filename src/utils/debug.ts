import { VaultApi } from '../types';

export const debugFilter = (vaults: VaultApi[]): VaultApi[] => {
    // normal functionality should return same list
    return vaults;

    // uncomment to do a binary search for specific vault failing
    // const half = Math.ceil(vaults.length / 2);
    // const first = true;
    // const second = false;

    // const firstHalf = vaults.slice(0, half);
    // const secondHalf = vaults.slice(-half);
    // const list1 = binarySearchHelper(firstHalf, first);
    // const list2 = binarySearchHelper(list1, first);
    // const list3 = binarySearchHelper(list2, first);
    // const list4 = binarySearchHelper(list3, first);
    // const list5 = binarySearchHelper(list4, second);

    // const result = list5;
    // console.log('result address', result);
    // console.log(
    //     'result address',
    //     result.map(({ address }) => address)
    // );
    // return result;
};

const binarySearchHelper = (vaults: VaultApi[], first: boolean): VaultApi[] => {
    const half = Math.ceil(vaults.length / 2);

    const firstHalf = vaults.slice(0, half);
    const secondHalf = vaults.slice(-half);

    if (first) {
        return firstHalf;
    } else {
        return secondHalf;
    }
};
