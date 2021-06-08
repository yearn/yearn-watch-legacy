import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { displayAmount } from '../../../utils/commonUtils';
import EtherScanLink from '../../common/EtherScanLink';
import { Grid } from '@material-ui/core';
import { toIsoStringMilliseconds } from '../../../utils/dateUtils';

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

const AccordionReport = (props: any) => {
    const { data, tokenDecimals } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography className={classes.text}>
                Last 5 strategy report
            </Typography>
            {data.map((res: any, index: number) => {
                return (
                    <Accordion key={index} className={classes.accordion}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>
                                <EtherScanLink
                                    transaction={true}
                                    address={res.transactionHash}
                                />
                            </Typography>
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
                                            res.debtAdded.toString(),
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
                                            res.debtLimit.toString(),
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
                                            res.debtPaid.toString(),
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
                                        Gain:
                                        <br />{' '}
                                        {displayAmount(
                                            res.gain.toString(),
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
                                        timestamp:
                                        <br />
                                        {toIsoStringMilliseconds(res.timestamp)}
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
                                        totalDebt:
                                        <br />
                                        {displayAmount(
                                            res.totalDebt.toString(),
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
                                        totalGain:
                                        <br />
                                        {displayAmount(
                                            res.totalGain.toString(),
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
                                        totalLoss:
                                        <br />
                                        {displayAmount(
                                            res.totalLoss.toString(),
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
