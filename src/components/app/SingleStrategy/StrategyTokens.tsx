import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import EtherScanLink from '../../common/EtherScanLink';
import TokenCard from './TokenCard';
import { Network, Strategy } from '../../../types';
import request from '../../../utils/request';
import { getEnv } from '../../../utils/env';

const StyledTypography = styled(Typography)`
    && {
        color: ${({ theme }) => theme.title};
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }
`;

type StrategyTokensProps = {
    strategy: Strategy;
    network: Network;
};

export const StrategyTokens = (props: StrategyTokensProps) => {
    const { strategy, network } = props;
    const [tokensData, setTokensData] = useState<any>(null);
    const { ethplorerKey } = getEnv();
    // fetching strategy tokens
    useEffect(() => {
        request(
            `https://api.ethplorer.io/getAddressInfo/${strategy.token.address}?apiKey=${ethplorerKey}`,
            undefined
        ).then((res) => setTokensData(res.tokens));
    }, []);
    const data = [];
    for (const token in tokensData) {
        data.push({
            name: tokensData[token].tokenInfo.name,
            symbol: tokensData[token].tokenInfo.symbol,
            balance: tokensData[token].balance,
            link: (
                <EtherScanLink
                    address={tokensData[token].tokenInfo.address}
                    network={network}
                />
            ),
        });
    }
    return strategy.healthCheck === null ? (
        <StyledTypography>{'Not Supported'}</StyledTypography>
    ) : (
        <TokenCard data={data} key={strategy.address + '-health'} />
    );
};

export default StrategyTokens;
