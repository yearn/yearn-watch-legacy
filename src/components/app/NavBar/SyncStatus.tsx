import { useSyncStatus } from '../../../hooks';
import { Network } from '../../../types';
import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { BigNumber } from 'ethers';
import React from 'react';

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

    interface syncStatusMessageProps {
        rpcHeight: BigNumber;
        subgraphHeight: BigNumber;
    }

    function syncStatusMessage(props: syncStatusMessageProps): JSX.Element {
        const subgraphLag = props.rpcHeight.sub(props.subgraphHeight);

        if (subgraphLag.eq(0)) {
            return (
                <Typography variant="caption" align="right">
                    Subgraph is synced with RPC
                </Typography>
            );
        } else if (subgraphLag.eq(1)) {
            return (
                <Typography variant="caption" align="right">
                    Subgraph is 1 block behind
                </Typography>
            );
        } else {
            return (
                <Typography variant="caption" align="right">
                    Subgraph is {subgraphLag.toString()} blocks behind
                </Typography>
            );
        }
    }

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
                            {syncStatusMessage({
                                rpcHeight: rpcData.syncHeight,
                                subgraphHeight: subgraphData.syncHeight,
                            })}
                        </Typography>
                    )}
            </Box>
        );
    };

    return renderData();
};

export default SyncStatus;
