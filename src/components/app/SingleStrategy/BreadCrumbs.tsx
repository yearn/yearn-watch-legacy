import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { Card, Typography } from '@material-ui/core';
import { Network } from '../../../types';
import { extractAddress } from '../../../utils/commonUtils';
import styled from 'styled-components';

const StyledCardBreadCrumbs = styled(Card)`
    && {
        background-color: transparent;
        margin-left: auto;
        margin-right: auto;
        box-shadow: none !important;
        @media (max-width: 1400px) {
            max-width: 85%;
        }
        @media (max-width: 700px) {
            max-width: 100%;
        }
    }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        crumbs: {
            marginBottom: 15,
            marginTop: 15,
            color: '#fff',
        },
        text: {
            color: '#ffff',
            fontWeight: 'bolder',
        },
    })
);
type BreadCrumbsProps = {
    vaultId: string;
    strategyId?: string;
    network?: Network;
};
const BreadCrumbs = (props: BreadCrumbsProps) => {
    const { vaultId, strategyId, network = 'ethereum' } = props;
    const classes = useStyles();

    let strategyLevel;
    if (strategyId !== undefined) {
        strategyLevel = (
            <Link
                component={RouterLink}
                color="inherit"
                to={`/network/${network}/vault/${vaultId.toLowerCase()}/strategy/${strategyId.toLowerCase()}`}
            >
                <Typography className={classes.text}>
                    <Hidden smUp>{`${extractAddress(
                        strategyId.toLowerCase()
                    )}`}</Hidden>
                    <Hidden xsDown>{strategyId.toLowerCase()}</Hidden>
                </Typography>
            </Link>
        );
    }

    return (
        <StyledCardBreadCrumbs>
            <MuiBreadcrumbs className={classes.crumbs}>
                <Link
                    component={RouterLink}
                    color="inherit"
                    to={`/network/${network}`}
                >
                    vaults
                </Link>
                <Link
                    component={RouterLink}
                    color="inherit"
                    to={`/network/${network}/vault/${vaultId.toLowerCase()}`}
                >
                    <Hidden smUp>{`${extractAddress(
                        vaultId.toLowerCase()
                    )}`}</Hidden>
                    <Hidden xsDown>{vaultId.toLowerCase()}</Hidden>
                </Link>
                {strategyLevel}
            </MuiBreadcrumbs>
        </StyledCardBreadCrumbs>
    );
};

export default BreadCrumbs;
