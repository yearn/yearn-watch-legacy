export type AddressConfig = {
    address: string;
    ens: string;
    getEnsOrAddress: (account: string) => string;
    isAddress: (account: string) => boolean;
};

export const toAddressConfig = (address: string, ens: string) => ({
    address: address.toLowerCase(),
    ens,
    getEnsOrAddress: (account: string): string => {
        return account.toLowerCase() === address.toLowerCase() ? ens : account;
    },
    isAddress: (account: string): boolean => {
        return account.toLowerCase() === address.toLowerCase();
    },
});
