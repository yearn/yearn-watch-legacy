import {
    makeStyles,
    createStyles,
    withStyles,
    Theme,
} from '@material-ui/core/styles';

import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid } from '@material-ui/core';
import { SubTitle, ValuePercentage } from '../../../common/Labels';

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
            backgroundColor: 'rgba(6, 87, 249, 1)',
        },
    })
)(LinearProgress);

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});
interface BarChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}
export default function BarChart(props: BarChartProps) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {props.data
                .map((val: any, index: number) => (
                    <span key={index}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <SubTitle>{val.name}</SubTitle>
                            </Grid>
                            <Grid item xs={6}>
                                {' '}
                                <ValuePercentage>{val.y} %</ValuePercentage>
                            </Grid>
                        </Grid>

                        <BorderLinearProgress
                            variant="determinate"
                            value={val.y}
                        />
                    </span>
                ))
                .reverse()}
        </div>
    );
}
