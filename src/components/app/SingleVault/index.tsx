import React, { useState } from 'react';
import { CircularProgress, Container, Grid, Paper } from '@mui/material';
import styled from 'styled-components';
import { Params, useParams } from 'react-router-dom';

import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Network, DEFAULT_NETWORK } from '../../../types';
import BreadCrumbs from '../SingleStrategy/BreadCrumbs';
import BarChart from '../Charts/BarChart';
import { StrategiesList } from '../StrategiesList';
import { VaultDescription } from './VaultDescription';
import EtherScanLink from '../../common/EtherScanLink';
import { ErrorAlert } from '../../common/Alerts';
import ReactHelmet from '../../common/ReactHelmet';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { GlobalStylesLoading } from '../../theme/globalStyles';
import { useVault, useVaultStrategyMetadata } from '../../../hooks';
import {
    getStrategyAllocation,
    getProtocolAllocation,
} from '../../../utils/strategyParams';

const StyledCard = styled(Card).withConfig({
    shouldForwardProp: (props) => !(props.toString() in ['config', 'bck']),
})<{
    config?: string | undefined;
    bck?: string | undefined;
}>`
    && {
        background-color: ${({ theme, bck }) =>
            bck === 'true' ? 'transparent' : theme.container};
        box-shadow: none;
        color: ${({ theme }) => theme.title};
        margin-left: auto;
        margin-right: auto;
        border: ${({ theme, config }) =>
            config === 'false' ? theme.error : ''} !important;
        @media (max-width: 1400px) {
            max-width: 85%;
        }
        @media (max-width: 700px) {
            max-width: 100%;
        }
    }
`;

const StyledSpan = styled.span`
    && {
        color: ${({ theme }) => theme.subtitle};
    }
`;

const MuiTabs = styled(Tabs)`
    && {
        color: ${({ theme }) => theme.subtitle}!important;
        .MuiTabs-indicator {
            background-color: ${({ theme }) => theme.bodyBlue}!important;
        }
        .Mui-selected {
            color: ${({ theme }) => theme.bodyBlue}!important;
        }
    }
`;

const StyledPaper = styled(Paper)`
    && {
        background-color: ${({ theme }) => theme.body};
        margin-top: 16px;
    }
`;

const StyledTitle = styled.span`
    && {
        color: ${({ theme }) => theme.title};
        font-weight: 600;
        font-size: 20px;
        margin: 16px 0;
    }
`;

interface TabPanelProps {
    children?: React.ReactNode;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    index: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

interface ParamTypes extends Params {
    vaultId: string;
    network?: Network;
}

export const SingleVault = () => {
    const { vaultId, network = DEFAULT_NETWORK } = useParams() as ParamTypes;
    const [tab, setTab] = useState(0);
    const [openSnackBar, setOpenSnackBar] = React.useState(true);

    const {
        data: vault,
        loading: loadingVault,
        error,
        warnings,
    } = useVault(network, vaultId);
    const { data: strategyMetadata, loading: loadingStrategyMetadata } =
        useVaultStrategyMetadata(network, vaultId);

    const handleChange = (_: React.ChangeEvent<unknown>, newValue: number) => {
        setTab(newValue);
    };

    const handleCloseSnackBar = () => {
        setOpenSnackBar(false);
    };

    const config = vault?.configOK;

    return (
        <React.Fragment>
            <ReactHelmet title={vault ? vault.name : ''} />

            <Container>
                {error && (
                    <ErrorAlert
                        message={`Error while loading vault ${vaultId}:`}
                        details={error}
                    />
                )}
                {warnings && warnings.length !== 0 && (
                    <Snackbar
                        open={openSnackBar}
                        onClose={handleCloseSnackBar}
                        autoHideDuration={10000}
                    >
                        <Alert onClose={handleCloseSnackBar} severity="warning">
                            {`Issue loading the following fields for some strategies: ${JSON.stringify(
                                warnings
                            )}`}
                        </Alert>
                    </Snackbar>
                )}
                {loadingVault ? (
                    <span>
                        <ProgressSpinnerBar />
                        <GlobalStylesLoading />
                    </span>
                ) : (
                    !error && (
                        <React.Fragment>
                            <StyledCard bck="true">
                                {' '}
                                <BreadCrumbs
                                    vaultId={vaultId}
                                    network={network}
                                />
                            </StyledCard>
                            <StyledCard
                                config={
                                    config === undefined
                                        ? 'true'
                                        : config.toString()
                                }
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            src={vault ? vault.icon : ''}
                                            aria-label="recipe"
                                        />
                                    }
                                    title={
                                        <StyledTitle>
                                            {vault ? vault.name : ''}
                                        </StyledTitle>
                                    }
                                    subheader={
                                        vault ? (
                                            <>
                                                <StyledSpan>
                                                    {' '}
                                                    {
                                                        vault.strategies.length
                                                    }{' '}
                                                    strats
                                                </StyledSpan>

                                                <br />
                                                <EtherScanLink
                                                    address={vault.address}
                                                    network={network}
                                                />
                                            </>
                                        ) : (
                                            ''
                                        )
                                    }
                                />
                            </StyledCard>
                            <br />
                            <StyledCard
                                config={
                                    config === undefined
                                        ? 'true'
                                        : config.toString()
                                }
                            >
                                <MuiTabs
                                    variant="fullWidth"
                                    value={tab}
                                    onChange={handleChange}
                                    scrollButtons="auto"
                                    indicatorColor="primary"
                                    aria-label="scrollable auto tabs example"
                                >
                                    <Tab label="Details" {...a11yProps(0)} />

                                    <Tab label="Strategies" {...a11yProps(1)} />
                                </MuiTabs>

                                <TabPanel value={tab} index={0}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <StyledTitle> About</StyledTitle>
                                            <VaultDescription
                                                vault={vault}
                                                isLoading={loadingVault}
                                                network={network}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <StyledTitle>
                                                {' '}
                                                Strategy Allocation
                                            </StyledTitle>
                                            <StyledPaper>
                                                {vault &&
                                                vault.strategies.length > 0 ? (
                                                    <BarChart
                                                        data={getStrategyAllocation(
                                                            vault
                                                        )}
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </StyledPaper>
                                            <br />
                                            <StyledTitle>
                                                {' '}
                                                Protocol Allocation
                                            </StyledTitle>
                                            {loadingStrategyMetadata ? (
                                                <CircularProgress />
                                            ) : vault && strategyMetadata ? (
                                                <StyledPaper>
                                                    <BarChart
                                                        data={getProtocolAllocation(
                                                            vault,
                                                            strategyMetadata
                                                        )}
                                                    />
                                                </StyledPaper>
                                            ) : (
                                                ''
                                            )}
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={tab} index={1}>
                                    <div>
                                        {vault &&
                                        vault.strategies.length > 0 ? (
                                            <div>
                                                <StrategiesList
                                                    vault={vault}
                                                    network={network}
                                                />
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </TabPanel>
                            </StyledCard>
                        </React.Fragment>
                    )
                )}
            </Container>
        </React.Fragment>
    );
};
