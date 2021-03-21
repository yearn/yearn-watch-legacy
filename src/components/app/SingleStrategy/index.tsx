import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Strategy } from '../../../types';
import { useParams } from 'react-router-dom';
import { getStrategies } from '../../../utils/strategies';
import Table from '../../common/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import EtherScanLink from '../../common/EtherScanLink';

interface ParamTypes {
    id: string;
    name: string;
}

export const SingleStrategy = () => {
    const { id, name } = useParams<ParamTypes>();

    const [strategyData, setStrategyData] = useState<Strategy[] | undefined>();
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        getStrategies([id]).then((loadedStrategy) => {
            setStrategyData(loadedStrategy);
            setIsLoaded(false);
        });
    });

    const strategy = strategyData && strategyData[0];
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
                    strategy && strategy.emergencyExit
                        ? '2px solid #ff6c6c'
                        : '#fff',
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
    return (
        <React.Fragment>
            <Breadcrumbs className={classes.crumbs}>
                <Link color="inherit" href="/">
                    vaults
                </Link>
                <Link
                    color="inherit"
                    href={`/vault/${strategy ? strategy.vault : ''}`}
                >
                    {name}
                </Link>

                <Typography className={classes.text}>
                    {strategy ? strategy.name : ''}
                </Typography>
            </Breadcrumbs>
            {isLoaded ? (
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                    <CircularProgress style={{ color: '#fff' }} />{' '}
                    <Typography style={{ color: '#fff' }}>
                        Loading strategy..
                    </Typography>
                </div>
            ) : (
                <Card className={classes.root}>
                    <CardHeader
                        title={strategy ? strategy.name : ''}
                        subheader={
                            strategy ? (
                                <EtherScanLink address={strategy.address} />
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
                                        {strategy ? strategy.apiVersion : ''}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Emergency exit: </TableCell>
                                    <TableCell>
                                        {strategy &&
                                        strategy.emergencyExit === false ? (
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
                                    <TableCell>Active: </TableCell>
                                    <TableCell>
                                        {strategy &&
                                        strategy.isActive === true ? (
                                            <Chip
                                                label="true"
                                                clickable
                                                style={{
                                                    color: '#fff',
                                                    backgroundColor:
                                                        'rgba(1,201,147,1)',
                                                }}
                                            />
                                        ) : (
                                            <Chip
                                                label="false"
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
                                    <TableCell>Keeper: </TableCell>
                                    <TableCell>
                                        {strategy ? (
                                            <EtherScanLink
                                                address={strategy.keeper}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Rewards: </TableCell>
                                    <TableCell>
                                        {strategy ? (
                                            <EtherScanLink
                                                address={strategy.rewards}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Strategist: </TableCell>
                                    <TableCell>
                                        {strategy ? (
                                            <EtherScanLink
                                                address={strategy.strategist}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Vault: </TableCell>
                                    <TableCell>
                                        {strategy ? (
                                            <EtherScanLink
                                                address={strategy.vault}
                                            />
                                        ) : (
                                            ''
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </React.Fragment>
    );
};
