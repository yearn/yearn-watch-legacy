import React, { useEffect, useState } from 'react';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import StrategyDetail from './StrategyDetail';
import StrategyHealthCheck from './StrategyHealthCheck';
import MuiCard from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { Strategy } from '../../../types';
import { useParams } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import MuiBreadcrumbs from './BreadCrumbs';
import EtherScanLink from '../../common/EtherScanLink';
import ReactHelmet from '../../common/ReactHelmet';

import { getStrategies } from '../../../utils/strategies';
import { getReportsForStrategy, StrategyReport } from '../../../utils/reports';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import StrategyReports from './StrategyReports';
interface ParamTypes {
    id: string;
    name: string;
}

export const SingleStrategy = () => {
    const { id, name } = useParams<ParamTypes>();

    const [strategyData, setStrategyData] = useState<Strategy[]>([]);
    const [isLoaded, setIsLoaded] = useState(true);

    const [strategyReports, setStrategyReports] = useState<StrategyReport[]>(
        []
    );
    const [isReportsLoading, setIsReportsLoading] = useState(true);

    useEffect(() => {
        getStrategies([id]).then((loadedStrategy) => {
            setStrategyData(loadedStrategy);
            setIsLoaded(false);
        });

        getReportsForStrategy(id).then((reports) => {
            setStrategyReports(reports);
            setIsReportsLoading(false);
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
            demo1: {
                borderBottom: '1px solid #e8e8e8',
            },
        })
    );
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
        setValue(newValue);
    };
    const classes = useStyles();

    return (
        <React.Fragment>
            <ReactHelmet title={strategy ? strategy.name : ''} />
            <MuiBreadcrumbs
                strategyVault={strategy ? strategy.vault : ''}
                strategyName={strategy ? strategy.name : ''}
                name={name}
            />

            {isLoaded || isReportsLoading ? (
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
                <MuiCard className={classes.root}>
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
                    <Tabs
                        className={classes.demo1}
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                    >
                        <Tab label="Detail" />
                        <Tab label="Reports" />
                        <Tab label="Health Check" />
                    </Tabs>

                    {value === 0 ? <StrategyDetail strategy={strategy} /> : ''}
                    {value === 1 ? (
                        <StrategyReports
                            reports={strategyReports}
                            tokenDecimals={
                                strategy ? strategy.token.decimals : 18
                            }
                        />
                    ) : (
                        ''
                    )}
                    {value === 2 ? (
                        <StrategyHealthCheck strategy={strategy} />
                    ) : (
                        ''
                    )}
                </MuiCard>
            )}
        </React.Fragment>
    );
};
