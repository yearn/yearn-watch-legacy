import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from '@material-ui/core/Hidden';
import EtherScanLink from '../../common/EtherScanLink';

import { extractText, displayAmount } from '../../../utils/commonUtils';
import { Strategy, Vault } from '../../../types';

type StrategistListProps = {
    vault: Vault;
    dark: boolean;
};

export const StrategistList = (props: StrategistListProps) => {
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                width: '100%',
                marginTop: 20,
                background: 'transparent',
                padding: 10,
            },
            address: {
                fontSize: '14px',
                opacity: '0.6',
                color: '#ffff',
            },
            text: {
                color: '#ffff',
                fontFamily: 'Open Sans',
                lineHeight: '27px',
                fontSize: '18px',
            },
            iconCall: {
                backgroundColor: 'white',
                borderRadius: 3,
                padding: 2,
            },
            list: {
                background: 'transparent',
                border: 'none',
            },
            accordion: {
                background: 'transparent',
                border: 'none',
            },
            link: {
                color: props.dark ? '#ffff' : 'black',
                '&:hover': {
                    color: '#1f255f',
                    fontWeight: 600,
                },
            },
            heading: {
                fontSize: theme.typography.pxToRem(15),
                fontWeight: theme.typography.fontWeightRegular,
            },
        })
    );
    const classes = useStyles();
    const { vault } = props;
    console.log('vault', vault);
    return (
        <div className={classes.root}>
            <Typography variant="body2" className={classes.text} component="p">
                Strategies
            </Typography>
            {vault.strategies &&
                vault.strategies.map((strategy: Strategy, index: number) => (
                    <Accordion key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography variant="subtitle1" gutterBottom>
                                <a
                                    className={classes.link}
                                    href={`/strategy/${vault.name}/${strategy.address}`}
                                >
                                    <Hidden smUp>
                                        {strategy.name.length > 20
                                            ? extractText(strategy.name)
                                            : strategy.name}
                                    </Hidden>

                                    <Hidden xsDown>{strategy.name}</Hidden>
                                </a>
                            </Typography>
                            &nbsp;&nbsp;
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <EtherScanLink
                                    address={strategy.address}
                                    dark={true}
                                />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
        </div>
    );
};
