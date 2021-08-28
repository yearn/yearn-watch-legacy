import {
    Button,
    Container,
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core';
import { MouseEvent } from 'react';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { StrategyProtocolList } from '../../app/StrategyProtocolList';
import Divider from '@material-ui/core/Divider';
import { Grid } from '@material-ui/core';
import { amountToMMs, amountToString } from '../../../utils/commonUtils';
import { getTvlImpact } from '../../../utils/risk';
import { ProtocolTVL } from '../../../types/protocol-tvl';
import { Delete } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            margin: '5px',
            borderRadius: '5px',
        },
        link: {
            color: '#fff',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        textVault: {
            fontFamily: 'Open Sans',
            lineHeight: '27px',
            fontSize: '18px',
            '&:hover': {
                fontSize: 19,
            },
        },
        warningIcon: {
            borderRadius: 3,
            padding: 1,
            boxShadow: '0px 0px 0px 0 rgba(0,0,0,0.2)',
        },
        expandIcon: {
            color: '#fff',
        },
        list: {
            padding: 0,
        },
        alert: {
            background: 'transparent',
            color: 'red',
            fontWeight: 400,
        },

        divider: {
            background: '#1d265f',
            opacity: '0.3',
            marginLeft: '10px',
            marginRight: '10px',
        },
        accordion: {
            background: '#0a1d3f', // : '#006ae3',
            borderRadius: '8px',
            color: '#ffffff',
            marginTop: 10,
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
        deleteIcon: {
            color: '#ffffff',
            verticalAlign: 'middle',
        },
        resultText: {
            width: '90%',
            padding: '10px',
            color: 'white',
            textAlign: 'center',
        },
    })
);

type ProtocolsListProps = {
    items: ProtocolTVL[];
    onRemove: (event: MouseEvent, protocol: string) => Promise<void>;
};

export const ProtocolsList = (props: ProtocolsListProps) => {
    const classes = useStyles();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let render: any = '';
    if (props.items.length === 0) {
        render = (
            <Container maxWidth="lg" className={classes.resultText}>
                No terms added yet. Please add your terms above in the search
                bar and click the search icon.
            </Container>
        );
    }

    return (
        <>
            {render}
            {props.items.map((protocol: ProtocolTVL, index: number) => (
                <Container maxWidth="lg" key={index}>
                    <div className={classes.root}>
                        <MuiAccordion className={classes.accordion}>
                            <AccordionSummary
                                expandIcon={
                                    <ExpandMoreIcon
                                        className={classes.expandIcon}
                                    />
                                }
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Grid
                                    container
                                    className={classes.root}
                                    spacing={2}
                                >
                                    <Grid item md={11} xs={11}>
                                        <Grid
                                            container
                                            spacing={1}
                                            direction="row"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            {`#${
                                                index + 1
                                            } - ${protocol.name.toUpperCase()} - ${amountToString(
                                                protocol.tvl
                                            )} - # ${
                                                protocol.strategies.length
                                            } Strategies - TVL Impact: ${getTvlImpact(
                                                amountToMMs(protocol.tvl)
                                            )}`}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={1} xs={1}>
                                        <Button
                                            onClick={(event) =>
                                                props.onRemove(
                                                    event,
                                                    protocol.name
                                                )
                                            }
                                        >
                                            <Delete
                                                color="secondary"
                                                fontSize="small"
                                                className={classes.deleteIcon}
                                            />
                                        </Button>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <Divider className={classes.divider} />
                            <AccordionDetails>
                                <Container>
                                    <StrategyProtocolList item={protocol} />
                                </Container>
                            </AccordionDetails>
                        </MuiAccordion>
                    </div>
                </Container>
            ))}
        </>
    );
};
