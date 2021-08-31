import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '@material-ui/core';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import StrategyDetail from './StrategyDetail';

import { ErrorAlert } from '../../common/Alerts';
import { Strategy, Vault } from '../../../types';

import BreadCrumbs from './BreadCrumbs';
import EtherScanLink from '../../common/EtherScanLink';
import ReactHelmet from '../../common/ReactHelmet';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';

import { getStrategies } from '../../../utils/strategies';
import { getVault } from '../../../utils/vaults';
import { getReportsForStrategy, StrategyReport } from '../../../utils/reports';

import StrategyReports from './StrategyReports';
import { GlobalStylesLoading } from '../../theme/globalStyles';

const StyledCard = styled(Card)<{ emergencyExit: string }>`
    && {
        background-color: ${({ theme }) => theme.container};
        color: ${({ theme }) => theme.title};
        margin-left: auto;
        margin-right: auto;
        border: ${({ theme, emergencyExit }) =>
            emergencyExit === 'false' ? theme.error : ''} !important;
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

interface ParamTypes {
    strategyId: string;
    vaultId: string;
}

export const SingleStrategy = () => {
    const { strategyId, vaultId } = useParams<ParamTypes>();

    const [strategyData, setStrategyData] = useState<Strategy[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [vault, setVault] = useState<Vault | undefined>();
    const [isVaultLoading, setIsVaultLoading] = useState(true);
    const [strategyReports, setStrategyReports] = useState<StrategyReport[]>(
        []
    );
    const [isReportsLoading, setIsReportsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [value, setValue] = React.useState(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        const loadStrategyData = async () => {
            setIsLoading(true);
            setIsVaultLoading(true);
            setIsReportsLoading(true);
            setError(null);
            // we don't want to handle error here for now
            getReportsForStrategy(strategyId).then((reports) => {
                setStrategyReports(reports);
                setIsReportsLoading(false);
            });
            try {
                const loadedStrategy = await getStrategies([strategyId]);
                setStrategyData(loadedStrategy);
                setIsLoading(false);
            } catch (error) {
                console.log('Error:', error);
                setIsLoading(false);
                setError(error);
            }
            try {
                const loadedVault = await getVault(vaultId);
                setVault(loadedVault);
                setIsVaultLoading(false);
            } catch (error) {
                console.log('Error:', error);
                setIsVaultLoading(false);
                setError(error);
            }
        };
        loadStrategyData();
    }, [strategyId]);

    const strategy = strategyData && strategyData[0];

    return (
        <React.Fragment>
            <ReactHelmet title={strategy ? strategy.name : ''} />
            <Container>
                {error && (
                    <ErrorAlert
                        message={'Error while loading strategy data:'}
                        details={error}
                    />
                )}
                {isLoading || isVaultLoading || isReportsLoading ? (
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '100px',
                        }}
                    >
                        <ProgressSpinnerBar />
                        <GlobalStylesLoading />
                    </div>
                ) : (
                    !error && (
                        <React.Fragment>
                            <BreadCrumbs
                                vaultId={vaultId}
                                strategyId={strategyId}
                            />

                            <StyledCard
                                emergencyExit={
                                    strategy &&
                                    strategy.emergencyExit.toString()
                                }
                            >
                                <CardHeader
                                    title={strategy ? strategy.name : ''}
                                    subheader={
                                        <>
                                            {strategy ? (
                                                <EtherScanLink
                                                    address={strategy.address}
                                                />
                                            ) : (
                                                ''
                                            )}
                                            {vault ? (
                                                <StyledSpan>
                                                    (Vault: {vault.name})
                                                </StyledSpan>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    }
                                />
                                <Tabs
                                    value={value}
                                    indicatorColor="primary"
                                    onChange={handleChange}
                                >
                                    <Tab label="Detail" />
                                    <Tab label="Reports" />
                                </Tabs>

                                {value === 0 ? (
                                    <StrategyDetail strategy={strategy} />
                                ) : (
                                    <StrategyReports
                                        reports={strategyReports}
                                        tokenDecimals={
                                            strategy
                                                ? strategy.token.decimals
                                                : 18
                                        }
                                    />
                                )}
                            </StyledCard>
                        </React.Fragment>
                    )
                )}
            </Container>
        </React.Fragment>
    );
};
