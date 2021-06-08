import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        crumbs: {
            maxWidth: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
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
    strategyVault: string;
    name: string;
    strategyName: string;
};
const BreadCrumbs = (props: BreadCrumbsProps) => {
    const { strategyVault, name, strategyName } = props;
    const classes = useStyles();

    return (
        <MuiBreadcrumbs className={classes.crumbs}>
            <Link color="inherit" href="/">
                vaults
            </Link>
            <Link color="inherit" href={`/vault/${strategyVault}`}>
                {name}
            </Link>

            <Typography className={classes.text}>{strategyName}</Typography>
        </MuiBreadcrumbs>
    );
};

export default BreadCrumbs;
