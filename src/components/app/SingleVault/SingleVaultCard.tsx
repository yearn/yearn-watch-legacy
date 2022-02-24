import React from 'react';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import EtherScanLink from '../../common/EtherScanLink';
import { Network, Vault } from '../../../types';
import { Card } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';

type Props = {
    vault?: Vault;
    network: Network;
};

const useStyles = makeStyles((theme) => ({
    action: {
        display: 'flex',
        padding: theme.spacing(2),
    },
    avatar: {
        width: 42,
        height: 42,
    },
    title: {
        fontSize: theme.typography.subtitle1.fontSize + ' !important',
    },
    subheader: {
        fontSize: theme.typography.subtitle2.fontSize + ' !important',
    },
    card: {
        display: 'flex',
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
}));

const SingleVaultCard = ({ vault, network }: Props) => {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <Card className={classes.card}>
            <CardHeader
                style={{
                    borderColor:
                        vault?.configOK == false
                            ? theme.palette.error.main
                            : '',
                }}
                classes={{
                    action: classes.action,
                    title: classes.title,
                    subheader: classes.subheader,
                }}
                avatar={
                    <Avatar
                        src={vault ? vault.icon : ''}
                        aria-label="vault"
                        sizes={classes.avatar}
                    />
                }
                title={vault ? vault.name : ''}
                subheader={vault ? vault.strategies.length + ' strats' : ''}
            />
            <div className={classes.action}>
                {vault && (
                    <EtherScanLink address={vault.address} network={network} />
                )}
            </div>
        </Card>
    );
};

export default SingleVaultCard;
