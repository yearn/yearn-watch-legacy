import {
    Network,
    NetworkConfig,
    toAddressConfig,
    toNetworkConfig,
} from '../../types';

const FANTOM_SUBGRAPH_URL =
    'https://api.thegraph.com/subgraphs/name/bsamuels453/yearn-fantom-validation-grafted';

const GOVERNANCE_ENS = 'governance';
const GOVERNANCE = '0xC0E2830724C946a6748dDFE09753613cd38f6767';

// NOTE: same as management at the moment
const GUARDIAN_ENS = 'guardian';
const GUARDIAN = '0x72a34AbafAB09b15E7191822A679f28E067C4a16';

const MANAGEMENT_ENS = 'brain';
const MANAGEMENT = '0x72a34AbafAB09b15E7191822A679f28E067C4a16';

const TREASURY_ENS = 'treasury';
const TREASURY = '0x89716ad7edc3be3b35695789c475f3e7a3deb12a';

const MANAGEMENT_FEE = 200;
const PERF_FEE = 2000;

const FTM_USDC_ADDRESS = '0x04068da6c83afcfa0e13ba15a6696662335d5b75';
const FTM_ORACLE_CONTRACT_ADDRESS =
    '0x57aa88a0810dfe3f9b71a9b179dd8bf5f956c46a';

const FTM_STRATEGIES_HELPER_CONTRACT_ADDRESS =
    '0x97d0be2a72fc4db90ed9dbc2ea7f03b4968f6938';

export const fantom: NetworkConfig = {
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
        `https://ftmscan.com/token/${token}`,
    toAddressExplorerUrl: (token: string): string =>
        `https://ftmscan.com/address/${token}`,
    toTxExplorerUrl: (tx: string): string => `https://ftmscan.com/tx/${tx}`,
    subgraphUrl: FANTOM_SUBGRAPH_URL,
    usdcAddress: FTM_USDC_ADDRESS,
    oracleAddress: FTM_ORACLE_CONTRACT_ADDRESS,
    strategiesHelperAddress: FTM_STRATEGIES_HELPER_CONTRACT_ADDRESS,
};
