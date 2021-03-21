import React from 'react';
import {
    makeStyles,
    createStyles,
    withStyles,
    Theme,
} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 10,
            borderRadius: 5,
        },
        colorPrimary: {
            backgroundColor:
                theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    })
)(LinearProgress);

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

const ProgressBars = (props: any) => {
    const classes = useStyles();
    const vault = props.vault;
    const value = vault ? vault.totalAssets / vault.depositLimit : '';
    const p = value ? value * 100 : '';
    const f = p ? parseInt(p.toFixed(0)) : 0;
    return (
        <div className={classes.root}>
            <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                    <BorderLinearProgress variant="determinate" value={f} />
                </Box>
                <Typography
                    variant="body2"
                    color="textSecondary"
                >{`${f}%`}</Typography>
            </Box>
        </div>
    );
};

export default ProgressBars;
