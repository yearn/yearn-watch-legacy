import { Tab, Tabs, Container } from '@material-ui/core';
import React, { useState } from 'react';
import { Network, Strategy, StrategyMetaData, Vault } from '../../../types';
import { StrategyReport } from '../../../utils';
import { ErrorAlert } from '../../common/Alerts';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { GlobalStylesLoading } from '../../theme/globalStyles';
import BreadCrumbs from './BreadCrumbs';
import StrategyDetail from './StrategyDetail';
import StrategyHeader from './StrategyHeader';
import StrategyHealthCheck from './StrategyHealthCheck';
import StrategyReports from './StrategyReports';
import StyledCard from './StyledCard';
import Warnings from './Warnings';

type Props = {
    vaultAddress: string;
    strategyAddress: string;
    error: any;
    warnings?: string[];
    loading: boolean;
    vault?: Vault;
    strategy?: Strategy;
    strategyMetaData?: StrategyMetaData;
    network: Network;
    reports?: StrategyReport[];
};

export const SingleStrategyScreen = ({
    vaultAddress,
    strategyAddress,
    error,
    warnings,
    loading,
    vault,
    strategy,
    strategyMetaData,
    network,
    reports,
}: Props) => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (
        event: React.ChangeEvent<any>,
        newValue: number
    ) => {
        setTabValue(newValue);
    };
    const renderTab = (value: number): JSX.Element | undefined => {
        switch (value) {
            case 0: {
                return (
                    strategy && (
                        <StrategyDetail
                            strategy={strategy}
                            network={network}
                            metadata={strategyMetaData}
                        />
                    )
                );
            }
            case 1: {
                return (
                    reports && (
                        <StrategyReports
                            network={network}
                            reports={reports}
                            tokenDecimals={
                                strategy ? strategy.token.decimals : 18
                            }
                        />
                    )
                );
            }
            case 2: {
                return (
                    strategy && (
                        <StrategyHealthCheck
                            strategy={strategy}
                            network={network}
                        />
                    )
                );
            }
        }
    };
    if (error) {
        return (
            <ErrorAlert
                message={'Error while loading strategy data:'}
                details={error}
            />
        );
    }
    if (loading) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '100px',
                }}
            >
                <ProgressSpinnerBar />
                <GlobalStylesLoading />
            </div>
        );
    }
    return (
        <Container>
            {warnings && <Warnings warnings={warnings} />}
            <BreadCrumbs
                vaultId={vaultAddress}
                strategyId={strategyAddress}
                network={network}
            />
            <StrategyHeader
                vault={vault}
                strategy={strategy}
                network={network}
            />
            <StyledCard
                style={{ marginTop: '16px' }}
                emergencyExit={strategy && strategy.emergencyExit.toString()}
            >
                <Tabs
                    value={tabValue}
                    variant="fullWidth"
                    indicatorColor="primary"
                    onChange={handleTabChange}
                >
                    <Tab label="Detail" />
                    <Tab label="Reports" />
                    <Tab label="Health Check" />
                </Tabs>
                <div>{renderTab(tabValue)}</div>
            </StyledCard>
        </Container>
    );
};
