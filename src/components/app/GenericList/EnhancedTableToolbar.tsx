import clsx from 'clsx';
import { lighten, Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Toolbar, Typography } from '@mui/material';

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.mode === 'light'
                ? {
                      color: theme.palette.secondary.main,
                      backgroundColor: lighten(
                          theme.palette.secondary.light,
                          0.85
                      ),
                  }
                : {
                      color: theme.palette.text.primary,
                      backgroundColor: theme.palette.secondary.dark,
                  },
        title: {
            flex: '1 1 100%',
        },
    })
);

interface EnhancedTableToolbarProps {
    title: string;
}

export const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const classes = useToolbarStyles();
    return (
        <Toolbar className={clsx(classes.root)}>
            <Typography
                className={classes.title}
                variant="h6"
                id="tableTitle"
                component="div"
                align="center"
            >
                {props.title}
            </Typography>
        </Toolbar>
    );
};
