import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { Vault } from '../../../types';
import { getVault } from '../../../utils/vaults';
import BreadCrumbs from '../SingleStrategy/BreadCrumbs';
import Pie from '../Charts/Pie';
import { StrategiesList } from '../StrategiesList';
import { VaultDescription } from './VaultDescription';
import EtherScanLink from '../../common/EtherScanLink';
import { ErrorAlert } from '../../common/Alerts';
import ReactHelmet from '../../common/ReactHelmet';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { GlobalStylesLoading } from '../../theme/globalStyles';

const StyledCard = styled(Card)<{
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
const StyledPaper = styled(Paper)`
    && {
        background-color: ${({ theme }) => theme.body};
    }
`;
const TitleDetails = styled.span`
    && {
        color: ${({ theme }) => theme.title};
        font-weight: bolder;
        font-size: 20px;
    }
`;
const StyledTitle = styled.span`
    && {
        color: ${({ theme }) => theme.title};
        font-weight: bold;
        font-size: 18px;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function a11yProps(index: any) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

interface ParamTypes {
    vaultId: string;
}
type SingleVaultProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme?: any;
};

export const SingleVault = (props: SingleVaultProps) => {
    const { vaultId } = useParams<ParamTypes>();

    const [vault, setVault] = useState<Vault | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [value, setValue] = useState(0);
    const config = vault?.configOK;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        const loadVaultData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const loadedVault = await getVault(vaultId);
                setVault(loadedVault);
                setIsLoading(false);
            } catch (error) {
                console.log('Error:', error);
                setIsLoading(false);
                setError(error);
            }
        };
        loadVaultData();
    }, [vaultId]);

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
                {isLoading ? (
                    <span>
                        <ProgressSpinnerBar />
                        <GlobalStylesLoading />
                    </span>
                ) : (
                    !error && (
                        <React.Fragment>
                            <StyledCard bck="true">
                                {' '}
                                <BreadCrumbs vaultId={vaultId} />
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
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                >
                                    <Tab label="Details" {...a11yProps(0)} />
                                    <Tab label="Strategies" {...a11yProps(1)} />
                                    {/* <Tab label="Strategies" {...a11yProps(2)} /> */}
                                </Tabs>

                                <TabPanel value={value} index={0}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <TitleDetails> About</TitleDetails>

                                            <VaultDescription
                                                vault={vault}
                                                isLoading={isLoading}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TitleDetails>
                                                {' '}
                                                Strategy Allocation
                                            </TitleDetails>
                                            <StyledPaper>
                                                {vault &&
                                                vault.strategies.length > 0 ? (
                                                    <Pie
                                                        vault={vault}
                                                        theme={props.theme}
                                                    />
                                                ) : (
                                                    ''
                                                )}
                                            </StyledPaper>
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    {vault && vault.strategies.length > 0 ? (
                                        <div>
                                            <StrategiesList vault={vault} />
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {/* {vault && vault.strategies.length > 0 ? (
                                        <Pie
                                            vault={vault}
                                            theme={props.theme}
                                        />
                                    ) : (
                                        ''
                                    )} */}
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    {vault && vault.strategies.length > 0 ? (
                                        <div>
                                            <StrategiesList vault={vault} />
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </TabPanel>
                            </StyledCard>
                        </React.Fragment>
                    )
                )}
            </Container>
        </React.Fragment>
    );
};
