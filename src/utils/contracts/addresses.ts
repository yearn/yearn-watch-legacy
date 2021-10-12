import { DEFAULT_NETWORK, Network } from '../../types';

const checkIfAddressIsConfiguredIn = (
    values: Map<string, string>,
    network: string = DEFAULT_NETWORK,
    message = `Contract is not supported in network ${network}`
) => {
    if (!values.has(network)) {
        throw new Error(message);
    }
};

export const USDC_DECIMALS = 6;
const ETH_USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const FTM_USDC_ADDRESS = '0x04068da6c83afcfa0e13ba15a6696662335d5b75';
const ETH_ORACLE_CONTRACT_ADDRESS =
    '0x83d95e0d5f402511db06817aff3f9ea88224b030';
const FTM_ORACLE_CONTRACT_ADDRESS =
    '0x57aa88a0810dfe3f9b71a9b179dd8bf5f956c46a';
const ETH_STRATEGIES_HELPER_CONTRACT_ADDRESS =
    '0x2114d9a16da30fa5b59795e4f8c9ead19e40f0a0';
const FTM_STRATEGIES_HELPER_CONTRACT_ADDRESS =
    '0x97d0be2a72fc4db90ed9dbc2ea7f03b4968f6938';

const USDC_ADDRESSES = new Map<Network, string>();
USDC_ADDRESSES.set(Network.mainnet, ETH_USDC_ADDRESS);
USDC_ADDRESSES.set(Network.fantom, FTM_USDC_ADDRESS);
export const getUSDCAddress = (network: Network): string => {
    checkIfAddressIsConfiguredIn(
        USDC_ADDRESSES,
        network,
        `Contract USDC is not supported in network '${network}'.`
    );
    return USDC_ADDRESSES.get(network) as string;
};

const ORACLE_ADDRESSES = new Map<Network, string>();
ORACLE_ADDRESSES.set(Network.mainnet, ETH_ORACLE_CONTRACT_ADDRESS);
ORACLE_ADDRESSES.set(Network.fantom, FTM_ORACLE_CONTRACT_ADDRESS);
export const getOracleAddress = (
    network: Network = Network.mainnet
): string => {
    checkIfAddressIsConfiguredIn(
        ORACLE_ADDRESSES,
        network,
        `Contract Oracle is not supported in network '${network}'.`
    );
    return ORACLE_ADDRESSES.get(network) as string;
};

const STRATEGIES_HELPER_ADDRESSES = new Map<string, string>();
STRATEGIES_HELPER_ADDRESSES.set(
    Network.mainnet,
    ETH_STRATEGIES_HELPER_CONTRACT_ADDRESS
);
STRATEGIES_HELPER_ADDRESSES.set(
    Network.fantom,
    FTM_STRATEGIES_HELPER_CONTRACT_ADDRESS
);
export const getStrategiesHelperAddress = (
    network: string = Network.mainnet
): string => {
    checkIfAddressIsConfiguredIn(
        STRATEGIES_HELPER_ADDRESSES,
        network,
        `Contract StrategiesHelper is not supported in network '${network}'.`
    );
    return STRATEGIES_HELPER_ADDRESSES.get(network) as string;
};
