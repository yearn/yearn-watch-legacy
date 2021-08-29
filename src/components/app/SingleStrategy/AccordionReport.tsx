import styled from 'styled-components';
import { mean, compact } from 'lodash';
import { Fragment } from 'react';
import { Container, Grid } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { displayAmount, msToHours } from '../../../utils/commonUtils';
import EtherScanLink from '../../common/EtherScanLink';
import { unixMsToIsoString } from '../../../utils/dateUtils';
import { StrategyReport } from '../../../utils/reports';
import { median } from '../../../utils/math';
import ItemDescription from '../../common/ItemDescription';

const StyledTypography = styled(Typography)`
    && {
        color: ${({ theme }) => theme.title};

        margin-top: 20px;
        margin-bottom: 20px;
    }
`;
const StyledSubTypography = styled(Typography)`
    && {
        color: ${({ theme }) => theme.title};
    }
`;
const StyledAccordion = styled(Accordion)`
    && {
        width: 100%;
        margin-bottom: 10px;
        margin-top: 10px;
        align-items: center;
        align-content: center;
        background-color: ${({ theme }) => theme.subContainer} !important;

        border-radius: 8px;
    }
`;
const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
    && {
        color: ${({ theme }) => theme.text} !important;
    }
`;
type AccordionReportProps = {
    data: StrategyReport[];
    tokenDecimals: number;
};
const AccordionReport = (props: AccordionReportProps) => {
    const { data, tokenDecimals } = props;

    const aprList = compact(data.map((item) => item.results?.apr));
    const averageApr = aprList.length === 0 ? 0 : mean(aprList);
    const medianApr = aprList.length === 0 ? 0 : median(aprList);
    const averageAprLabel = `Average APR: ${averageApr.toFixed(2)}%`;
    const medianAprLabel = `Median APR: ${medianApr.toFixed(2)}%`;
    const topLabel =
        data.length === 0
            ? 'No Reports Loaded'
            : `Last ${data.length} reports.`;

    return (
        <div>
            <Container>
                <Grid container spacing={3} style={{ marginTop: 10 }}>
                    <Grid item xs={4}>
                        <StyledTypography>{topLabel}</StyledTypography>
                    </Grid>
                    <Grid item xs={4}>
                        <StyledTypography>{averageAprLabel}</StyledTypography>
                    </Grid>
                    <Grid item xs={4}>
                        <StyledTypography>{medianAprLabel}</StyledTypography>
                    </Grid>
                </Grid>

                {data.map((res: StrategyReport, index: number) => {
                    return (
                        <StyledAccordion key={index}>
                            <AccordionSummary
                                expandIcon={<StyledExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={9}>
                                        <Typography>
                                            <EtherScanLink
                                                transactionHash={
                                                    res.transactionHash
                                                }
                                            />
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <StyledSubTypography>
                                            {' '}
                                            Timestamp:
                                            <br />
                                            {unixMsToIsoString(res.timestamp)}
                                        </StyledSubTypography>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={1}>
                                    <Grid container spacing={1}>
                                        <ItemDescription
                                            label="Debt Added"
                                            value={displayAmount(
                                                res.debtAdded,
                                                tokenDecimals
                                            )}
                                            md={3}
                                        />
                                        <ItemDescription
                                            label="Debt Limit"
                                            value={displayAmount(
                                                res.debtLimit,
                                                tokenDecimals
                                            )}
                                            md={3}
                                        />
                                        <ItemDescription
                                            label="Debt Paid"
                                            value={displayAmount(
                                                res.debtPaid,
                                                tokenDecimals
                                            )}
                                            md={3}
                                        />
                                        <ItemDescription
                                            label="Total Debt"
                                            value={displayAmount(
                                                res.totalDebt,
                                                tokenDecimals
                                            )}
                                            md={3}
                                        />
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <ItemDescription
                                            label="Profit"
                                            value={displayAmount(
                                                res.profit,
                                                tokenDecimals
                                            )}
                                            md={3}
                                        />
                                        <ItemDescription
                                            label="Total Profit"
                                            value={displayAmount(
                                                res.totalProfit,
                                                tokenDecimals
                                            )}
                                            md={3}
                                        />
                                        <ItemDescription
                                            label="Loss"
                                            value={displayAmount(
                                                res.loss,
                                                tokenDecimals
                                            )}
                                            md={3}
                                        />
                                        <ItemDescription
                                            label="Total Loss"
                                            value={displayAmount(
                                                res.totalLoss,
                                                tokenDecimals
                                            )}
                                            md={3}
                                        />
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <ItemDescription
                                            label="Duration (hours)"
                                            value={msToHours(
                                                res.results
                                                    ? res.results.duration
                                                    : 0
                                            ).toFixed(2)}
                                            visible={res.results !== undefined}
                                            md={3}
                                            helpTitle="What is it?"
                                            helpDescription={
                                                <Fragment>
                                                    The duration is the time
                                                    elapsed between this report
                                                    and the previous.
                                                </Fragment>
                                            }
                                        />
                                        <ItemDescription
                                            label="Duration PR"
                                            value={`${res.results?.durationPr.toFixed(
                                                6
                                            )} %`}
                                            visible={res.results !== undefined}
                                            md={3}
                                            helpTitle="What is the duration PR?"
                                            helpDescription={
                                                <Fragment>
                                                    It is the percentage rate
                                                    for the given duration
                                                    period:
                                                    <pre>
                                                        {
                                                            'profit = current.totalGain - previous.totalGain'
                                                        }
                                                    </pre>
                                                    <pre>
                                                        {
                                                            'durationPR = profit / current.totalDebt'
                                                        }
                                                    </pre>
                                                </Fragment>
                                            }
                                        />
                                        <ItemDescription
                                            label="APR"
                                            value={`${res.results?.apr.toFixed(
                                                2
                                            )} %`}
                                            visible={res.results !== undefined}
                                            md={3}
                                            helpTitle="How is APR calculated?"
                                            helpDescription={
                                                <Fragment>
                                                    It compares the current and
                                                    previous reports applying
                                                    this formula:
                                                    <pre>
                                                        {
                                                            'profit = current.totalGain - previous.totalGain'
                                                        }
                                                    </pre>
                                                    <pre>
                                                        {
                                                            'timeBetweenReports (days) = (current.timestamp - previous.timestamp ) * millisecondsPerDay'
                                                        }
                                                    </pre>
                                                    <pre>
                                                        {
                                                            'yearOverDuration = daysPerYear (365) / timeBetweenReports'
                                                        }
                                                    </pre>
                                                    <pre>
                                                        {
                                                            'profitOverTotalDebt = profit / current.totalDebt'
                                                        }
                                                    </pre>
                                                    <pre>
                                                        {
                                                            'APR = profitOverTotalDebt * yearOverDuration'
                                                        }
                                                    </pre>
                                                </Fragment>
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </StyledAccordion>
                    );
                })}
            </Container>
        </div>
    );
};

export default AccordionReport;
