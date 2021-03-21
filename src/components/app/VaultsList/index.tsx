import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MuiAlert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import { Vault } from '../../../types';
import { StrategistList } from '../StrategistList';
import EtherScanLink from '../../common/EtherScanLink';
import Typography from '@material-ui/core/Typography';

type VaultsListProps = {
    vault: Vault;
    key: number;
};

export const VaultsList = (props: VaultsListProps) => {
    const { vault, key } = props;
    const config = vault.configOK;

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                width: '100%',
                margin: '5px',
                borderRadius: '5px',
            },
            link: {
                color: '#fff',
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
                background: '#fff',
                opacity: '0.3',
                marginLeft: '10px',
                marginRight: '10px',
            },
            accordion: {
                background: config ? '#0a1d3f' : '#ff6c6c',
                borderRadius: '8px',
                color: '#ffffff',
                '&:hover': {
                    background: config ? '#006ae3' : '#ff5c5c',
                },
            },
            heading: {
                fontSize: theme.typography.pxToRem(15),
                fontWeight: theme.typography.fontWeightRegular,
            },
        })
    );

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <MuiAccordion className={classes.accordion}>
                <AccordionSummary
                    expandIcon={
                        <ExpandMoreIcon className={classes.expandIcon} />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <List className={classes.list}>
                        {!config ? (
                            <MuiAlert
                                severity="error"
                                variant="filled"
                                className={classes.alert}
                            >
                                {' '}
                                {vault.configErrors &&
                                vault.configErrors?.length > 0
                                    ? vault.configErrors[0]
                                    : ''}
                            </MuiAlert>
                        ) : null}
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar alt={vault.icon} src={vault.icon} />
                            </ListItemAvatar>

                            <ListItemText
                                primary={
                                    <span>
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                        >
                                            <a
                                                className={classes.link}
                                                href={`/vault/${vault.address}`}
                                            >
                                                {vault.name}
                                            </a>
                                        </Typography>
                                        &nbsp;&nbsp;
                                        <EtherScanLink
                                            address={vault.address}
                                            dark={true}
                                        />
                                    </span>
                                }
                            />
                        </ListItem>
                    </List>
                </AccordionSummary>
                <Divider className={classes.divider} />
                <AccordionDetails>
                    <Container>
                        <StrategistList vault={vault} dark={true} />
                    </Container>
                </AccordionDetails>
            </MuiAccordion>
        </div>
    );
};
