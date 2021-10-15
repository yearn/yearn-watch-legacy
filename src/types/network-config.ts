import { AddressConfig, Network } from '.';

export type NetworkConfig = {
    network: Network;
    governance: AddressConfig;
    guardian: AddressConfig;
    management: AddressConfig;
    treasury: AddressConfig;
    managementFee: number;
    performanceFee: number;
    subgraphUrl: string;
    usdcAddress: string;
    oracleAddress: string;
    strategiesHelperAddress: string;
    isManagementFee: (fee: number) => boolean;
    isPerformanceFee: (fee: number) => boolean;
    toTokenExplorerUrl: (token: string) => string;
    toAddressExplorerUrl: (token: string) => string;
    toTxExplorerUrl: (token: string) => string;
};

export const toNetworkConfig = (
    network: Network,
    governance: AddressConfig,
    guardian: AddressConfig,
    management: AddressConfig,
    treasury: AddressConfig,
    managementFee: number,
    performanceFee: number
) => ({
    network,
    governance,
    guardian,
    management,
    treasury,
    managementFee,
    performanceFee,
    isManagementFee: (fee: number): boolean => {
        return fee === managementFee;
    },
    isPerformanceFee: (fee: number): boolean => {
        return fee === performanceFee;
    },
});
