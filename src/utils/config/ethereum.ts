import {
    Network,
    NetworkConfig,
    toAddressConfig,
    toNetworkConfig,
} from '../../types';

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
};
