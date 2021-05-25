import React, { useEffect, useState } from 'react';
import MediaQuery from 'react-responsive';
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
import { formatBPS, displayAmount } from '../../../utils/commonUtils';
import ReactHelmet from '../../common/ReactHelmet';

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
    }, [id]);

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
    const api_version = strategy ? strategy.apiVersion : '';
    const activation_date = strategy ? strategy.params.activation : '';
    const last_report_text = strategy ? strategy.params.lastReportText : '';
    const emergency_exit =
        strategy && strategy.emergencyExit === false ? (
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
    const is_active =
        strategy && strategy.isActive === true ? (
            <Chip
                label="true"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: 'rgba(1,201,147,1)',
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
        );
    const estimated_asset = strategy
        ? displayAmount(
              strategy.estimatedTotalAssets.toString(),
              strategy.token.decimals
          )
        : '';
    const credit_available = strategy
        ? displayAmount(
              strategy.creditAvailable.toString(),
              strategy.token.decimals
          )
        : '';
    const deb_outstanding = strategy
        ? displayAmount(
              strategy.debtOutstanding.toString(),
              strategy.token.decimals
          )
        : '';
    const deb_radio = strategy
        ? formatBPS(strategy.params.debtRatio.toString())
        : '';
    const total_deb = strategy
        ? displayAmount(
              strategy.params.totalDebt.toString(),
              strategy.token.decimals
          )
        : '';
    const total_gain = strategy
        ? displayAmount(
              strategy.params.totalGain.toString(),
              strategy.token.decimals
          )
        : '';
    const total_loss = strategy
        ? displayAmount(
              strategy.params.totalLoss.toString(),
              strategy.token.decimals
          )
        : '';
    const expect_return = strategy
        ? displayAmount(
              strategy.expectedReturn.toString(),
              strategy.token.decimals
          )
        : '';
    const performance_fee = strategy
        ? formatBPS(strategy.params.performanceFee.toString())
        : '';
    const react_limit =
        strategy && strategy.params.rateLimit
            ? displayAmount(
                  strategy.params.rateLimit.toString(),
                  strategy.token.decimals
              )
            : 'N/A';
    const keeper = strategy ? <EtherScanLink address={strategy.keeper} /> : '';
    const rewards = strategy ? (
        <EtherScanLink address={strategy.rewards} />
    ) : (
        ''
    );
    const strategist = strategy ? (
        <EtherScanLink address={strategy.strategist} />
    ) : (
        ''
    );
    const vaults = strategy ? <EtherScanLink address={strategy.vault} /> : '';
    return (
        <React.Fragment>
            <ReactHelmet title={strategy ? strategy.name : ''} />
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
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '100px',
                    }}
                >
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
                                    <TableCell>
                                        API Version:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br />
                                            {api_version}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{api_version}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Activation Date:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            {activation_date}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{activation_date}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Time Since Last Harvest:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br /> {last_report_text}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>
                                            {last_report_text}
                                        </TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Emergency exit:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            {emergency_exit}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{emergency_exit}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Active:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br /> {is_active}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{is_active}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Total Estimated Assets:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br /> {estimated_asset}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        <TableCell>{estimated_asset}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Credit Available:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br /> {credit_available}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>
                                            {credit_available}
                                        </TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Debt Outstanding:
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            {deb_outstanding}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{deb_outstanding}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Debt Ratio:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            {deb_radio} %
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{deb_radio} %</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Total Debt:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br /> {total_deb}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{total_deb}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Total Gain:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br /> {total_gain}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        <TableCell>{total_gain}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Total Loss:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br /> {total_loss}
                                        </MediaQuery>{' '}
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{total_loss}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Expected Return:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br /> {expect_return}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        <TableCell>{expect_return}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Performance Fee:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br />
                                            {performance_fee} %
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>
                                            {performance_fee} %
                                        </TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Rate Limit:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br />
                                            {react_limit}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{react_limit}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Keeper:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            {keeper}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        <TableCell>{keeper}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Rewards:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            <br />
                                            {rewards}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{rewards}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Strategist:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            {strategist}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{strategist}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Vault:{' '}
                                        <MediaQuery query="(max-device-width: 1224px)">
                                            {' '}
                                            <br />
                                            {vaults}
                                        </MediaQuery>
                                    </TableCell>
                                    <MediaQuery query="(min-device-width: 1224px)">
                                        {' '}
                                        <TableCell>{vaults}</TableCell>
                                    </MediaQuery>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </React.Fragment>
    );
};
