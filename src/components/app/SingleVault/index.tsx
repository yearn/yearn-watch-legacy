import React, { useState } from 'react';
import {
    Box,
    CircularProgress,
    Container,
    Grid,
    Card,
    Tabs,
    Tab,
    Typography,
    Alert,
    Snackbar,
    useTheme,
} from '@mui/material';
import { Params, useParams } from 'react-router-dom';
import { Network, DEFAULT_NETWORK } from '../../../types';
import BreadCrumbs from '../SingleStrategy/BreadCrumbs';
import BarChart from '../Charts/BarChart';
import { StrategiesList } from '../StrategiesList';
import { VaultDescription } from './VaultDescription';
import { ErrorAlert } from '../../common/Alerts';
import ReactHelmet from '../../common/ReactHelmet';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { GlobalStylesLoading } from '../../theme/globalStyles';
import { useVault, useVaultStrategyMetadata } from '../../../hooks';
import {
    getStrategyAllocation,
    getProtocolAllocation,
} from '../../../utils/strategyParams';
import SingleVaultCard from './SingleVaultCard';

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

    const theme = useTheme();

    const errorAlert = error && (
        <React.Fragment>
            <Container>
                <ErrorAlert
                    message={`Error while loading vault ${vaultId}:`}
                    details={error}
                />
            </Container>
        </React.Fragment>
    );

    const loadingIndicator = (
        <React.Fragment>
            <Container>
                <span>
                    <ProgressSpinnerBar />
                    <GlobalStylesLoading />
                </span>
            </Container>
        </React.Fragment>
    );

    const warningsSnackbar = (
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
    );

    const about = (
        <Grid container spacing={theme.spacing(2)}>
            <Grid item xs={12} md={6}>
                <Typography variant="h6">About</Typography>
                <VaultDescription
                    vault={vault}
                    isLoading={loadingVault}
                    network={network}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6">Strategy Allocation</Typography>
                <Box>
                    {vault && vault.strategies.length > 0 && (
                        <BarChart data={getStrategyAllocation(vault)} />
                    )}
                </Box>
                <Typography variant="h6">Protocol Allocation</Typography>
                <Box marginY={theme.spacing(2)}>
                    {loadingStrategyMetadata ? (
                        <CircularProgress />
                    ) : (
                        vault &&
                        strategyMetadata && (
                            <BarChart
                                data={getProtocolAllocation(
                                    vault,
                                    strategyMetadata
                                )}
                            />
                        )
                    )}
                </Box>
            </Grid>
        </Grid>
    );

    const strategyList = (
        <div>
            {vault && vault.strategies.length > 0 && (
                <Box>
                    <StrategiesList vault={vault} network={network} />
                </Box>
            )}
        </div>
    );

    const page = (
        <React.Fragment>
            {warnings && warnings.length !== 0 && warningsSnackbar}
            <BreadCrumbs vaultId={vaultId} network={network} />
            <SingleVaultCard vault={vault} network={network} />
            <br />
            <Card>
                <Tabs
                    variant="fullWidth"
                    value={tab}
                    onChange={handleChange}
                    indicatorColor="primary"
                >
                    <Tab label="Details" {...a11yProps(0)} />
                    <Tab label="Strategies" {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={tab} index={0}>
                    {about}
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    {strategyList}
                </TabPanel>
            </Card>
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <ReactHelmet title={vault ? vault.name : ''} />
            <Container>
                {error ? errorAlert : loadingVault ? loadingIndicator : page}
            </Container>
        </React.Fragment>
    );
};
