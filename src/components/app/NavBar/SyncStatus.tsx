import { useSyncStatus } from '../../../hooks';
import { Network } from '../../../types';
import { Box } from '@mui/material';
import Icon from '@mui/material/Icon';
import ErrorIcon from '@mui/icons-material/Error';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';

type SyncStatusProps = {
    network: Network;
};

export const SyncStatus = (props: SyncStatusProps) => {
    const { network } = props;

    const {
        subgraphLoading,
        subgraphData,
        subgraphRequestError,
        rpcLoading,
        rpcData,
        rpcRequestError,
    } = useSyncStatus(network);

    const renderData = () => {
        if (subgraphLoading || rpcLoading) {
            return <Box>Loading sync status</Box>;
        }

        return (
            <Box>
                {subgraphRequestError && (
                    <Alert severity="warning">
                        Error checking subgraph height
                    </Alert>
                )}
                {rpcRequestError && (
                    <Alert severity="warning">Error checking RPC height</Alert>
                )}
                {!subgraphRequestError &&
                    !rpcRequestError &&
                    subgraphData &&
                    rpcData && (
                        <Typography variant="caption" align="right">
                            Subgraph is{' '}
                            {rpcData.syncHeight
                                .sub(subgraphData.syncHeight)
                                .toString()}{' '}
                            blocks behind
                        </Typography>
                    )}
            </Box>
        );
    };

    return renderData();
};

export default SyncStatus;
