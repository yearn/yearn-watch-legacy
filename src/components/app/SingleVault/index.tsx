import React, { useEffect, useState } from 'react';
import numeral from 'numeral';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import { Vault } from '../../../types';
import { useParams } from 'react-router-dom';
import { getVault } from '../../../utils/vaults';
import { checkLabel } from '../../../utils/checks';
import Table from '../../common/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { StrategistList } from '../StrategistList';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Chip from '@material-ui/core/Chip';
import ProgressBars from '../../common/ProgressBar';
import { percentaje } from '../../../utils/commonUtils';
import EtherScanLink from '../../common/EtherScanLink';

interface ParamTypes {
    id: string;
}

export const SingleVault = () => {
    const { id } = useParams<ParamTypes>();

    const [vault, setVault] = useState<Vault | undefined>();
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        getVault(id).then((loadedVault) => {
            setVault(loadedVault);
            setIsLoaded(false);
        });
    });

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                [theme.breakpoints.down('sm')]: {
                    maxWidth: '100%',
                },
                [theme.breakpoints.up('md')]: {
                    maxWidth: '80%',
                },
                [theme.breakpoints.up('lg')]: {
                    maxWidth: '80%',
                },
                marginLeft: 'auto',
                marginRight: 'auto',
                border:
                    vault && vault.configOK === false
                        ? '5px solid #ff6c6c'
                        : '',
            },
            crumbs: {
                maxWidth: '80%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: 15,
                marginTop: 15,
                color: '#fff',
            },
            text: {
                color: '#ffff',
                fontWeight: 'bolder',
            },
            row: {
                background: '#0a1d3f',
            },
            gridContainer: {
                flexGrow: 1,
            },

            media: {
                height: 0,
                paddingTop: '56.25%', // 16:9
            },
            expand: {
                transform: 'rotate(0deg)',
                marginLeft: 'auto',
                transition: theme.transitions.create('transform', {
                    duration: theme.transitions.duration.shortest,
                }),
            },
            expandOpen: {
                transform: 'rotate(180deg)',
            },
        })
    );
    const classes = useStyles();
    const renderErrors = () =>
        vault &&
        vault.configErrors &&
        vault.configErrors.map((message: string) => {
            return <div style={{ color: '#ff6c6c' }}>{message}</div>;
        });

    return (
        <React.Fragment>
            <Breadcrumbs className={classes.crumbs}>
                <Link color="inherit" href="/">
                    vaults
                </Link>

                <Typography className={classes.text}>
                    {vault ? vault.name : ''}
                </Typography>
            </Breadcrumbs>

            {isLoaded ? (
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <CircularProgress style={{ color: '#fff' }} />{' '}
                    <Typography style={{ color: '#fff' }}>
                        Loading vault..
                    </Typography>
                </div>
            ) : (
                <Card className={classes.root}>
                    <CardHeader
                        avatar={
                            <Avatar
                                src={vault ? vault.icon : ''}
                                aria-label="recipe"
                            />
                        }
                        title={vault ? vault.name : ''}
                        subheader={
                            vault ? (
                                <EtherScanLink address={vault.address} />
                            ) : (
                                ''
                            )
                        }
                    />

                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>API Version: </TableCell>
                                    <TableCell>
                                        {vault ? vault.apiVersion : ''}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Emergency shut down: </TableCell>
                                    <TableCell>
                                        {vault &&
                                        vault.emergencyShutdown === false ? (
                                            <Chip
                                                label="ok"
                                                clickable
                                                style={{
                                                    color: '#fff',
                                                    backgroundColor:
                                                        'rgba(1,201,147,1)',
                                                }}
                                            />
                                        ) : (
                                            <Chip
                                                label="Emergency"
                                                clickable
                                                style={{
                                                    color: '#fff',
                                                    backgroundColor: '#ff6c6c',
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Governance: </TableCell>
                                    <TableCell>
                                        {vault
                                            ? checkLabel(vault.governance)
                                            : ''}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Management: </TableCell>
                                    <TableCell>
                                        {vault
                                            ? checkLabel(vault.management)
                                            : ''}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Guardian: </TableCell>
                                    <TableCell>
                                        {vault
                                            ? checkLabel(vault.guardian)
                                            : ''}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Assets: </TableCell>
                                    <TableCell>
                                        Total asset:{' '}
                                        {vault
                                            ? numeral(vault.totalAssets).format(
                                                  '0,0.0000'
                                              ) +
                                              ' ' +
                                              vault.token.symbol
                                            : ''}
                                        <ProgressBars vault={vault} />
                                        {vault ? (
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                            >
                                                {' '}
                                                Deposit limit :
                                                {numeral(
                                                    vault.depositLimit
                                                ).format('0,0.0000') +
                                                    ' ' +
                                                    vault.token.symbol}
                                            </Typography>
                                        ) : (
                                            ''
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Management fee: </TableCell>
                                    <TableCell>
                                        {vault
                                            ? percentaje(vault.managementFee)
                                            : ''}{' '}
                                        %
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Performance fee: </TableCell>
                                    <TableCell>
                                        {vault
                                            ? percentaje(vault.performanceFee)
                                            : ''}{' '}
                                        %
                                    </TableCell>
                                </TableRow>

                                {vault && vault.configOK === false ? (
                                    <TableRow
                                        style={{ border: '2px solid #ff6c6c' }}
                                    >
                                        <TableCell>Config errors: </TableCell>
                                        <TableCell>
                                            {vault ? renderErrors() : ''}
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                            </TableHead>
                        </Table>

                        {vault && vault.strategies.length > 0 ? (
                            <StrategistList vault={vault} dark={false} />
                        ) : (
                            ''
                        )}
                    </CardContent>
                </Card>
            )}
        </React.Fragment>
    );
};
