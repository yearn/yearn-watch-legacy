import AccordionReport from './AccordionReport';

export const StrategyReports = (props: any) => {
    const { strategy, tokenDecimals } = props;

    return <AccordionReport data={strategy} tokenDecimals={tokenDecimals} />;
};

export default StrategyReports;
