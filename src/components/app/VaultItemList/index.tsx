import { Fragment, useState, memo } from 'react';

import {
    Theme,
    createStyles,
    makeStyles,
    withStyles,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Tooltip from '@material-ui/core/Tooltip';
import { Vault } from '../../../types';
import { StrategiesList } from '../StrategiesList';
import EtherScanLink from '../../common/EtherScanLink';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { ReportProblem } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { HtmlTooltip } from '../../common/HtmlTooltip';

type VaultItemListProps = {
    vault: Vault;
    key: number;
};

const _VaultItemList = (props: VaultItemListProps) => {
    const { vault } = props;
    const config = vault.configOK;
    //hook to render list only when panel actually expanded
    const [expanded, setExpanded] = useState(false);

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                width: '100%',
                margin: '5px',
                borderRadius: '5px',
            },

            strats: {
                color: '#828282',
                textDecoration: 'none',
                fontWeight: 'normal',
                fontFamily: 'Roboto',
                lineHeight: '16px',
                fontSize: '16px',
                style: 'normal',
            },
            textVault: {
                color: '#333333',
                textDecoration: 'underline',
                fontWeight: 'bold',
                fontFamily: 'Roboto',
                lineHeight: '24px',
                fontSize: '16px',
                fontStyle: 'normal',
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
                color: 'black',
            },
            list: {
                padding: 0,
            },
            alert: {
                background: 'transparent',
                color: '#EB5757',
                fontWeight: 400,
            },

            accordion: {
                background: 'rgba(255,255,255, 0.7)',
                border: config ? '3px solid transparent' : ' 4px solid #EB5757',

                borderRadius: '8px',
                color: 'black',
                marginTop: 10,
            },
            heading: {
                fontSize: theme.typography.pxToRem(15),
                fontWeight: theme.typography.fontWeightRegular,
            },
            paper: {
                padding: theme.spacing(2),
            },
        })
    );
    const BlueOnGreenTooltip = withStyles({
        tooltip: {
            color: config ? 'transparent' : '#F2F2F2',
            backgroundColor: config ? 'transparent' : '#EB5757',
            fontSize: '16px',
        },
    })(Tooltip);

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
                    onClick={() => setExpanded(!expanded)}
                >
                    <Grid container className={classes.root} spacing={2}>
                        <Grid item md={12} xs={12}>
                            <BlueOnGreenTooltip
                                title="Incorrect performance fee"
                                placement="top"
                            >
                                <Grid
                                    container
                                    spacing={1}
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Grid item md={1} xs={3}>
                                        {vault && vault.icon ? (
                                            <ListItemAvatar>
                                                {
                                                    <Avatar
                                                        alt={vault.icon}
                                                        src={vault.icon}
                                                    />
                                                }
                                            </ListItemAvatar>
                                        ) : (
                                            <ListItemAvatar>
                                                <Avatar
                                                    style={{
                                                        color: 'transparent',
                                                    }}
                                                >
                                                    .
                                                </Avatar>
                                            </ListItemAvatar>
                                        )}
                                    </Grid>
                                    <Grid item md={5} xs={9}>
                                        {vault.configErrors ? (
                                            <HtmlTooltip
                                                title={
                                                    <Fragment>
                                                        <Typography>
                                                            {
                                                                vault
                                                                    .configErrors
                                                                    .length
                                                            }{' '}
                                                            warning(s) found
                                                        </Typography>
                                                        {vault.configErrors.map(
                                                            (error, index) => (
                                                                <em key={index}>
                                                                    {error}
                                                                    <br />
                                                                </em>
                                                            )
                                                        )}
                                                    </Fragment>
                                                }
                                            >
                                                <ReportProblem
                                                    className={
                                                        classes.warningIcon
                                                    }
                                                />
                                            </HtmlTooltip>
                                        ) : (
                                            ''
                                        )}
                                        <a
                                            href={`/vault/${vault.address}`}
                                            rel="noreferrer"
                                        >
                                            <span className={classes.textVault}>
                                                {' '}
                                                {vault.name}
                                                {`v${vault.apiVersion}`}
                                            </span>
                                        </a>
                                        <br />
                                        <span className={classes.strats}>
                                            {` ${vault.strategies.length}  strats`}
                                        </span>
                                    </Grid>
                                    <Hidden xsDown>
                                        {' '}
                                        <Grid item md={6} xs={9}>
                                            {' '}
                                            <EtherScanLink
                                                address={vault.address}
                                                dark={true}
                                            />
                                        </Grid>
                                    </Hidden>
                                </Grid>
                            </BlueOnGreenTooltip>
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <Hidden smUp>
                    <Grid container className={classes.root} spacing={2}>
                        <Grid item md={8} xs={12}>
                            {' '}
                            <EtherScanLink
                                address={vault.address}
                                dark={true}
                            />
                        </Grid>
                    </Grid>
                </Hidden>

                <AccordionDetails>
                    {expanded && (
                        <Container>
                            <StrategiesList
                                vault={vault}
                                dark={true}
                                expand={expanded}
                            />
                        </Container>
                    )}
                </AccordionDetails>
            </MuiAccordion>
        </div>
    );
};

export const VaultItemList = memo(_VaultItemList);
