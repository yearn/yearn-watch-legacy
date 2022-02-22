import { Link as RouterLink } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Hidden from '@mui/material/Hidden';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import { Network } from '../../../types';
import { extractAddress } from '../../../utils/commonUtils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        crumbs: {
            marginBottom: '15px !important',
            marginTop: '15px !important',
            color: '#fff !important',
        },
        text: {
            color: '#ffff ',
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
                    <Hidden smDown>{strategyId.toLowerCase()}</Hidden>
                </Typography>
            </Link>
        );
    }

    return (
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
                <Hidden smDown>{vaultId.toLowerCase()}</Hidden>
            </Link>
            {strategyLevel}
        </MuiBreadcrumbs>
    );
};

export default BreadCrumbs;
