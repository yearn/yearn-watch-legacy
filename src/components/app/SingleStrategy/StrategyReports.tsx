import AccordionReport from './AccordionReport';
import { StrategyReport } from '../../../utils/reports';
import { Network } from '../../../types';

type StrategyReportsProps = {
    reports: StrategyReport[];
    tokenDecimals: number;
    network: Network;
};

export const StrategyReports = (props: StrategyReportsProps) => {
    const { reports, tokenDecimals, network } = props;

    return (
        <AccordionReport
            data={reports}
            tokenDecimals={tokenDecimals}
            network={network}
        />
    );
};

export default StrategyReports;
