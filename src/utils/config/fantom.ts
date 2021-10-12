import {
    Network,
    NetworkConfig,
    toAddressConfig,
    toNetworkConfig,
} from '../../types';

const GOVERNANCE_ENS = 'governance';
const GOVERNANCE = '0xC0E2830724C946a6748dDFE09753613cd38f6767';

const GUARDIAN_ENS = 'dev';
const GUARDIAN = '';

const MANAGEMENT_ENS = 'brain';
const MANAGEMENT = '0x72a34AbafAB09b15E7191822A679f28E067C4a16';

const TREASURY_ENS = 'treasury';
const TREASURY = '0x89716ad7edc3be3b35695789c475f3e7a3deb12a';

const MANAGEMENT_FEE = 200;
const PERF_FEE = 2000;

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
};
