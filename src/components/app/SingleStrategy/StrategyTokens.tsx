import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import EtherScanLink from '../../common/EtherScanLink';
import TokenCard from './TokenCard';
import { Network, Strategy } from '../../../types';
import { getEnv } from '../../../utils/env';
import CircularProgress from '@mui/material/CircularProgress';

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

type Token = {
    balance: number;
    tokenInfo: {
        name: string;
        symbol: string;
        address: string;
    };
};

export const StrategyTokens = (props: StrategyTokensProps) => {
    const { strategy, network } = props;
    const [tokensData, setTokensData] = useState<Array<Token>>([]);
    const { ethplorerKey } = getEnv();
    // fetching strategy tokens
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCompleted(true);
        }, 1000);
        fetch(
            `https://api.ethplorer.io/getAddressInfo/${strategy.address}?apiKey=${ethplorerKey}`
        )
            .then((response) => response.json())
            .then((res) => setTokensData(res.tokens ? res.tokens : []));
        return () => clearTimeout(timer);
    }, []);
    const data = [];
    for (const token in tokensData) {
        if (tokensData[token].tokenInfo.name) {
            data.push({
                name: tokensData[token].tokenInfo.name,
                symbol: tokensData[token].tokenInfo.symbol,
                balance: tokensData[token].balance / 10 ** 18,
                link: (
                    <EtherScanLink
                        address={tokensData[token].tokenInfo.address}
                        network={network}
                    />
                ),
            });
        }
    }
    return strategy.healthCheck === null ? (
        <StyledTypography>{'Not Supported'}</StyledTypography>
    ) : completed && tokensData.length > 0 ? (
        <TokenCard data={data} key={strategy.address + '-health'} />
    ) : completed === false ? (
        <div style={{ marginLeft: '45%', marginTop: '10%' }}>
            <CircularProgress />
        </div>
    ) : completed === true && tokensData.length === 0 ? (
        <div style={{ marginLeft: '45%', marginTop: '10%' }}>
            No tokens found!
        </div>
    ) : null;
};

export default StrategyTokens;
