import {
    Network,
    NetworkConfig,
    toAddressConfig,
    toNetworkConfig,
} from '../../types';

const ARB_SUBGRAPH_URL =
    'https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-arbitrum';

const GOVERNANCE_ENS = 'governance';
const GOVERNANCE = '0xb6bc033D34733329971B938fEf32faD7e98E56aD';

// NOTE: same as management at the moment
const GUARDIAN_ENS = 'guardian';
const GUARDIAN = '0x6346282DB8323A54E840c6C772B4399C9c655C0d';

const MANAGEMENT_ENS = 'brain';
const MANAGEMENT = '0x6346282DB8323A54E840c6C772B4399C9c655C0d';

const TREASURY_ENS = 'treasury';
const TREASURY = '0x1DEb47dCC9a35AD454Bf7f0fCDb03c09792C08c1';

const MANAGEMENT_FEE = 200;
const PERF_FEE = 2000;

const ARB_USDC_ADDRESS = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';
const ARB_ORACLE_CONTRACT_ADDRESS =
    '0x043518AB266485dC085a1DB095B8d9C2Fc78E9b9';

const ARB_STRATEGIES_HELPER_CONTRACT_ADDRESS =
    '0x66a1A27f4b22DcAa24e427DCFFbf0cdDd9D35e0f';

export const arbitrum: NetworkConfig = {
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
        `https://arbiscan.io/token/${token}`,
    toAddressExplorerUrl: (token: string): string =>
        `https://arbiscan.io/address/${token}`,
    toTxExplorerUrl: (tx: string): string => `https://arbiscan.io/tx/${tx}`,
    subgraphUrl: ARB_SUBGRAPH_URL,
    usdcAddress: ARB_USDC_ADDRESS,
    oracleAddress: ARB_ORACLE_CONTRACT_ADDRESS,
    strategiesHelperAddress: ARB_STRATEGIES_HELPER_CONTRACT_ADDRESS,
};
