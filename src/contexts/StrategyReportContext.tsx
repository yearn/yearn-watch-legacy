import React, { useContext, useState } from 'react';

import { AllStrategyReports } from '../utils/reports';

export type StrategyReportContextValue = {
    strategyReports: AllStrategyReports;
    updateStrategyReports: (strategyReports: AllStrategyReports) => void;
};

const StrategyReportContext = React.createContext<StrategyReportContextValue>({
    strategyReports: {},
    updateStrategyReports: () => null,
});

export function useStrategyReportContext() {
    return useContext(StrategyReportContext);
}

type Props = {
    children?: React.ReactNode;
};

export const StrategyReportProvider: React.FC = ({ children }: Props) => {
    const [strategyReports, setStrategyReports] = useState<AllStrategyReports>(
        {}
    );
    const updateStrategyReports = (strategyReports: AllStrategyReports) => {
        setStrategyReports(strategyReports);
    };

    const value = {
        strategyReports,
        updateStrategyReports,
    };
    return (
        <StrategyReportContext.Provider value={value}>
            {children}
        </StrategyReportContext.Provider>
    );
};
