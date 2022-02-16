import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { ErrorAlert } from '../../common/Alerts';

type Props = {
    error: any
}

const errAlert = (error: any) => (
    <ErrorAlert
        message={'Error while loading strategy data:'}
        details={error}
    />
);

const showWarnings = (warnings: string[], openSnackBar: boolean, ) => (
    warnings.length > 0 &&
        (
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
        )
);

export const SingleStrategyScreen = ({error}: Props) => (
    <React.Fragment>
        {error && errAlert}

    </React.Fragment>
)

const StyledCard = styled(Card).withConfig({
    shouldForwardProp: (props) => props.toString() !== 'emergencyExit',
})<{
    emergencyExit?: string;
}>`
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

const StyledCardBreadCrumbs = styled(Card)`
    && {
        background-color: transparent;

        margin-left: auto;
        margin-right: auto;

        box-shadow: none !important;
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


const getAdditionalInfoComponent = (
    label: AdditionalInfoLabels,
    network: Network,
    strategy?: Strategy
): JSX.Element | undefined => {
    switch (label) {
        case AdditionalInfoLabels.GenLender: {
            return (
                strategy && <GenLender strategy={strategy} network={network} />
            );
        }
        default: {
            throw Error('Could not find additional info component');
        }
    }
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
                <StrategyReports
                    network={network}
                    reports={
                        strategyReportContext.strategyReports[
                            strategyId.toLowerCase()
                        ]
                    }
                    tokenDecimals={strategy ? strategy.token.decimals : 18}
                />
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
        default: {
            if (!additionalInfo) {
                throw Error('Should not render tab for additional info');
            }
            return getAdditionalInfoComponent(
                additionalInfo,
                network,
                strategy
            );
        }
    }
};


enum AdditionalInfoLabels {
    GenLender = 'Gen Lender',
}



const additionalInfo = getAdditionalInfo(strategy);
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