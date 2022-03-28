import riskFrameworkJson from './config/risk-framework.json';

export const initRiskFrameworkScores = (network: string) => {
    return riskFrameworkJson.groups.filter(
        (group) => group.network === network
    );
};
