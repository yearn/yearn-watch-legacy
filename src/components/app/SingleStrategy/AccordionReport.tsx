import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { displayAmount } from '../../../utils/commonUtils';
import EtherScanLink from '../../common/EtherScanLink';
import { Grid } from '@material-ui/core';
import { unixMsToIsoString } from '../../../utils/dateUtils';
import { StrategyReport } from '../../../utils/reports';

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
            color: 'grey',
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

    const topLabel =
        data.length === 0 ? 'No Reports Loaded' : `Last ${data.length} reports`;

    return (
        <div className={classes.root}>
            <Typography className={classes.text}>{topLabel}</Typography>
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
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    className={classes.grid}
                                >
                                    <Typography className={classes.subText}>
                                        {' '}
                                        Debt Added:
                                        <br />{' '}
                                        {displayAmount(
                                            res.debtAdded,
                                            tokenDecimals
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    className={classes.grid}
                                >
                                    <Typography className={classes.subText}>
                                        {' '}
                                        Debt Limit:
                                        <br />{' '}
                                        {displayAmount(
                                            res.debtLimit,
                                            tokenDecimals
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    className={classes.grid}
                                >
                                    <Typography className={classes.subText}>
                                        {' '}
                                        Debt Paid:
                                        <br />{' '}
                                        {displayAmount(
                                            res.debtPaid,
                                            tokenDecimals
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    className={classes.grid}
                                >
                                    <Typography className={classes.subText}>
                                        {' '}
                                        Profit:
                                        <br />{' '}
                                        {displayAmount(
                                            res.profit,
                                            tokenDecimals
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    className={classes.grid}
                                >
                                    <Typography className={classes.subText}>
                                        {' '}
                                        Loss:
                                        <br />{' '}
                                        {displayAmount(res.loss, tokenDecimals)}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    className={classes.grid}
                                >
                                    <Typography className={classes.subText}>
                                        {' '}
                                        Total Debt:
                                        <br />
                                        {displayAmount(
                                            res.totalDebt,
                                            tokenDecimals
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    className={classes.grid}
                                >
                                    <Typography className={classes.subText}>
                                        {' '}
                                        Total Profit:
                                        <br />
                                        {displayAmount(
                                            res.totalProfit,
                                            tokenDecimals
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    className={classes.grid}
                                >
                                    <Typography className={classes.subText}>
                                        {' '}
                                        Total Loss:
                                        <br />
                                        {displayAmount(
                                            res.totalLoss,
                                            tokenDecimals
                                        )}
                                    </Typography>
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
