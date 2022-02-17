import { CardHeader, Grid } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { Network, Strategy, Vault } from '../../../types';
import EtherScanLink from '../../common/EtherScanLink';
import StyledCard from './StyledCard';

type Props = {
    strategy?: Strategy;
    vault?: Vault;
    network: Network;
};

const StyledSpan = styled.span`
    && {
        color: ${({ theme }) => theme.subtitle};
    }
`;

const StrategyHeader = ({ strategy, vault, network }: Props) => (
    <StyledCard emergencyExit={strategy && strategy.emergencyExit.toString()}>
        <Grid
            direction="row"
            container
            justifyContent="space-between"
            alignItems="center"
        >
            <Grid item>
                <CardHeader
                    title={strategy ? strategy.name : ''}
                    subheader={vault ? vault.name + ' yVault' : ''}
                />
            </Grid>
            <Grid item style={{ padding: '16px' }}>
                {strategy && (
                    <EtherScanLink
                        address={strategy.address}
                        network={network}
                    />
                )}
            </Grid>
        </Grid>
    </StyledCard>
);

export default StrategyHeader;
