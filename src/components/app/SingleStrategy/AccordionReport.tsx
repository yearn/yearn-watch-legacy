import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { displayAmount, msToHours } from '../../../utils/commonUtils';
import EtherScanLink from '../../common/EtherScanLink';
import { Grid } from '@material-ui/core';
import { unixMsToIsoString } from '../../../utils/dateUtils';
import { StrategyReport } from '../../../utils/reports';
import ItemDescription from '../../common/ItemDescription';
import { Fragment } from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        accordion: {
            padding: 10,
            margin: 15,
        },
        text: {
            margin: 15,
            textAlign: 'center',
            color: 'black',
            fontSize: 21,
        },
        grid: {
            marginBottom: 10,

            borderBottom: '1px solid #e8e8e8',
        },
        subText: {
            marginBottom: 10,
        },
    })
);
type AccordionReportProps = {
    data: StrategyReport[];
    tokenDecimals: number;
};
const AccordionReport = (props: AccordionReportProps) => {
    const { data, tokenDecimals } = props;
    const classes = useStyles();

    const aprList = data.map((item) => item.results?.apr);
    const averageApr =
        aprList.length === 0 ? 0 : _.sum(aprList) / aprList.length;
    const averageAprLabel = `Average APR: ${averageApr.toFixed(2)}%`;
    const topLabel =
        data.length === 0
            ? 'No Reports Loaded'
            : `Last ${data.length} reports.`;

    return (
        <div className={classes.root}>
            <Typography className={classes.text}>
                {topLabel} {averageAprLabel}
            </Typography>
            {data.map((res: StrategyReport, index: number) => {
                return (
                    <Accordion key={index} className={classes.accordion}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={9}>
                                    <Typography className={classes.heading}>
                                        <EtherScanLink
                                            transactionHash={
                                                res.transactionHash
                                            }
                                        />
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Typography className={classes.subText}>
                                        {' '}
                                        Timestamp:
                                        <br />
                                        {unixMsToIsoString(res.timestamp)}
                                    </Typography>
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
                                                The duration is the time elapsed
                                                between this report and the
                                                previous.
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
                                                It is the percentage rate for
                                                the given duration period:
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
                                                previous reports applying this
                                                formula:
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
                    </Accordion>
                );
            })}
        </div>
    );
};

export default AccordionReport;
