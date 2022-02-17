import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { ErrorAlert } from '../../common/Alerts';
import { Strategy, Network, DEFAULT_NETWORK } from '../../../types';
import ReactHelmet from '../../common/ReactHelmet';
import { useStrategyReportContext } from '../../../contexts/StrategyReportContext';

import { getError, getWarnings, getReportsForStrategies } from '../../../utils';
import { useStrategy, useVault, useStrategyMetaData } from '../../../hooks';
import { SingleStrategyScreen } from './SingleStrategy.screen';

interface ParamTypes {
    strategyId: string;
    vaultId: string;
    network?: Network;
}

enum AdditionalInfoLabels {
    GenLender = 'Gen Lender',
}

const getAdditionalInfo = (
    strategy?: Strategy
): AdditionalInfoLabels | undefined => {
    // Check if strategy has additional info to be displayed
    // eg. gen lender strategies
    if (strategy?.name === 'StrategyLenderYieldOptimiser') {
        return AdditionalInfoLabels.GenLender;
    }
    return undefined;
};

export const SingleStrategy = () => {
    const {
        strategyId,
        vaultId,
        network = DEFAULT_NETWORK,
    } = useParams<ParamTypes>();
    const [isReportsLoading, setIsReportsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [warningFields, setWarningFields] = useState<string[] | undefined>(
        undefined
    );
    const strategyReportContext = useStrategyReportContext();
    const { data: vault, loading: fetchVaultLoading } = useVault(
        network,
        vaultId
    );
    const { data: strategy, loading: fetchStrategyLoading } = useStrategy(
        network,
        vaultId,
        strategyId
    );
    const { data: strategyMetaData } = useStrategyMetaData(
        network,
        vaultId,
        strategyId
    );

    useEffect(() => {
        if (strategy) {
            const warnings = getWarnings([strategy]);
            if (warnings.length > 0) {
                setWarningFields(warnings);
            }
        }
    }, [strategy]);

    useEffect(() => {
        const loadStrategyData = async () => {
            try {
                setIsReportsLoading(true);
                // we don't want to handle error here for now
                getReportsForStrategies(
                    [strategyId],
                    network,
                    strategyReportContext
                ).then(() => {
                    setIsReportsLoading(false);
                });
            } catch (e: unknown) {
                console.log('Error:', e);
                setIsReportsLoading(false);
                setError(getError(e));
            }
        };
        loadStrategyData();
    }, [strategyId, vaultId]);

    const additionalInfo = getAdditionalInfo(strategy);

    return (
        <React.Fragment>
            <ReactHelmet title={strategy ? strategy.name : ''} />
            <Container>
                <SingleStrategyScreen
                    vaultAddress={vaultId}
                    strategyAddress={strategyId}
                    loading={fetchStrategyLoading || isReportsLoading}
                    error={false}
                    warnings={warningFields}
                    vault={vault}
                    strategy={strategy}
                    network={network}
                    reports={
                        strategyReportContext.strategyReports[
                            strategyId.toLowerCase()
                        ]
                    }
                />
            </Container>
        </React.Fragment>
    );
};
