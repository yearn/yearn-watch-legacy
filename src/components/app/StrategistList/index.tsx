import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { extractText } from '../../../utils/commonUtils';
import Hidden from '@material-ui/core/Hidden';
import EtherScanLink from '../../common/EtherScanLink';

export const StrategistList = (props: any) => {
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
                color: props.dark ? '#ffff' : 'black',
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
    const vault = props.vault;

    return (
        <div className={classes.root}>
            <Typography variant="body2" className={classes.text} component="p">
                Strategies
            </Typography>
            {vault.strategies &&
                vault.strategies.map((strategie: any, index: number) => (
                    <List
                        className={classes.list}
                        style={{ border: 'none' }}
                        key={index}
                    >
                        <ListItem style={{ border: 'none' }}>
                            <ListItemText
                                style={{ border: 'none' }}
                                primary={
                                    <div>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                        >
                                            <a
                                                className={classes.link}
                                                href={`/strategy/${vault.name}/${strategie.address}`}
                                            >
                                                <Hidden smUp>
                                                    {strategie.name.length > 20
                                                        ? extractText(
                                                              strategie.name
                                                          )
                                                        : strategie.name}
                                                </Hidden>

                                                <Hidden xsDown>
                                                    {strategie.name}
                                                </Hidden>
                                            </a>
                                        </Typography>
                                        &nbsp;&nbsp;
                                        <EtherScanLink
                                            address={strategie.address}
                                            dark={true}
                                        />
                                    </div>
                                }
                            />
                        </ListItem>
                    </List>
                ))}
        </div>
    );
};
