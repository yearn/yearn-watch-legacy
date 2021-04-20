import React, { useEffect, useState } from 'react';
import MediaQuery from 'react-responsive';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Chip from '@material-ui/core/Chip';

import { useParams } from 'react-router-dom';

import { Vault } from '../../../types';
import { getVault } from '../../../utils/vaults';
import { checkLabel } from '../../../utils/checks';
import { formatBPS, displayAmount } from '../../../utils/commonUtils';
import Table from '../../common/Table';
import Pie from '../Charts/Pie';
import { StrategistList } from '../StrategistList';
import ProgressBars from '../../common/ProgressBar';
import EtherScanLink from '../../common/EtherScanLink';

interface ParamTypes {
    id: string;
}

export const SingleVault = () => {
    const { id } = useParams<ParamTypes>();

    const [vault, setVault] = useState<Vault | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getVault(id).then((loadedVault) => {
            setVault(loadedVault);
            setIsLoading(false);
        });
    }, [id]);

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
            return (
                <div key={message} style={{ color: '#ff6c6c' }}>
                    {message}
                </div>
            );
        });
    const api_version = vault ? vault.apiVersion : '';
    const emergency_shut_down =
        vault && vault.emergencyShutdown === false ? (
            <Chip
                label="ok"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: 'rgba(1,201,147,1)',
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
        );
    const governance = vault ? checkLabel(vault.governance) : '';
    const management = vault ? checkLabel(vault.management) : '';
    const guardian = vault ? checkLabel(vault.guardian) : '';
    const total_asset =
        vault &&
        displayAmount(vault.totalAssets, vault.token.decimals) +
            '  ' +
            vault.token.symbol;
    const vault_list = vault ? (
        <Typography variant="body2" color="textSecondary">
            {' '}
            Deposit limit :
            {displayAmount(vault.depositLimit, vault.token.decimals) +
                '  ' +
                vault.token.symbol}
        </Typography>
    ) : (
        ''
    );
    const management_fee = vault ? formatBPS(vault.managementFee) : '';
    const performance_fee = vault ? formatBPS(vault.performanceFee) : '';
    const deb_usage = vault ? formatBPS(vault.debtUsage) : '';
    const render_error = vault ? renderErrors() : '';
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

            {isLoading ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '100px',
                    }}
                >
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
                                    <TableCell>
                                        API Version:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br />
                                            {api_version}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        <TableCell>{api_version}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Emergency shut down:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br /> {emergency_shut_down}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>
                                            {emergency_shut_down}
                                        </TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Governance:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            {governance}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{governance}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Management:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            {management}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        <TableCell>{management}</TableCell>
                                    </MediaQuery>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        Guardian:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br />
                                            {guardian}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{guardian}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Assets:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            Total asset:
                                            {total_asset}
                                            <ProgressBars vault={vault} />
                                            {vault_list}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        <TableCell>
                                            Total asset:
                                            {total_asset}
                                            <ProgressBars vault={vault} />
                                            {vault_list}
                                        </TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Management fee:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br />
                                            {management_fee} %
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{management_fee}%</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Performance fee:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br />
                                            {performance_fee}%
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>
                                            {performance_fee}%
                                        </TableCell>
                                    </MediaQuery>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        Debt Usage:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br /> {deb_usage}%
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{deb_usage}%</TableCell>
                                    </MediaQuery>
                                </TableRow>

                                {vault && vault.configOK === false ? (
                                    <TableRow
                                        style={{
                                            border: '2px solid #ff6c6c',
                                        }}
                                    >
                                        <TableCell>
                                            Config Warnings:
                                            <MediaQuery query="(max-device-width: 1224px)">
                                                {' '}
                                                <br /> {render_error}
                                            </MediaQuery>{' '}
                                        </TableCell>
                                        <MediaQuery query="(min-device-width: 1224px)">
                                            {' '}
                                            <TableCell>
                                                {render_error}
                                            </TableCell>
                                        </MediaQuery>
                                    </TableRow>
                                ) : null}
                            </TableHead>
                        </Table>

                        {vault && vault.strategies.length > 0 ? (
                            <div>
                                <Pie vault={vault} />
                                <StrategistList vault={vault} dark={false} />
                            </div>
                        ) : (
                            ''
                        )}
                    </CardContent>
                </Card>
            )}
        </React.Fragment>
    );
};
