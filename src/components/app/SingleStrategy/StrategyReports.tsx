import AccordionReport from './AccordionReport';
import { StrategyReport } from '../../../utils/reports';
type StrategyReportsProps = {
    reports: StrategyReport[];
    tokenDecimals: number;
};

export const StrategyReports = (props: StrategyReportsProps) => {
    const { reports, tokenDecimals } = props;

    return <AccordionReport data={reports} tokenDecimals={tokenDecimals} />;
};

export default StrategyReports;
