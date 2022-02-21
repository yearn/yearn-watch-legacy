import {
    Network,
    NetworkConfig,
    toAddressConfig,
    toNetworkConfig,
} from '../../types';

const SUBGRAPH_URL =
    'https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-subgraph-mainnet';

const GOVERNANCE_ENS = 'ychad.eth';
const GOVERNANCE = '0xfeb4acf3df3cdea7399794d0869ef76a6efaff52';

const GUARDIAN_ENS = 'dev.ychad.eth';
const GUARDIAN = '0x846e211e8ba920b353fb717631c015cf04061cc9';

const MANAGEMENT_ENS = 'brain.ychad.eth';
const MANAGEMENT = '0x16388463d60FFE0661Cf7F1f31a7D658aC790ff7';

const TREASURY_ENS = 'treasury.ychad.eth';
const TREASURY = '0x93a62da5a14c80f265dabc077fcee437b1a0efde';

const MANAGEMENT_FEE = 200;
const PERF_FEE = 1000;
const ETH_USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
const ETH_ORACLE_CONTRACT_ADDRESS =
    '0x83d95e0d5f402511db06817aff3f9ea88224b030';
const ETH_STRATEGIES_HELPER_CONTRACT_ADDRESS =
    '0x2114d9a16da30fa5b59795e4f8c9ead19e40f0a0';

export const mainnet: NetworkConfig = {
    ...toNetworkConfig(
        Network.mainnet,
        toAddressConfig(GOVERNANCE, GOVERNANCE_ENS),
        toAddressConfig(GUARDIAN, GUARDIAN_ENS),
        toAddressConfig(MANAGEMENT, MANAGEMENT_ENS),
        toAddressConfig(TREASURY, TREASURY_ENS),
        MANAGEMENT_FEE,
        PERF_FEE
    ),
    toTokenExplorerUrl: (token: string): string =>
        `https://etherscan.io/token/${token}`,
    toAddressExplorerUrl: (token: string): string =>
        `https://etherscan.io/address/${token}`,
    toTxExplorerUrl: (tx: string): string => `https://etherscan.io/tx/${tx}`,
    subgraphUrl: SUBGRAPH_URL,
    usdcAddress: ETH_USDC_ADDRESS,
    oracleAddress: ETH_ORACLE_CONTRACT_ADDRESS,
    strategiesHelperAddress: ETH_STRATEGIES_HELPER_CONTRACT_ADDRESS,
};
