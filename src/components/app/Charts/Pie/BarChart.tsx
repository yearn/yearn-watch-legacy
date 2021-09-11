import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid } from '@material-ui/core';
import { SubTitle, ValuePercentage } from '../../../common/Labels';

const BorderLinearProgress = styled(LinearProgress)`
    && {
        height: 12px !important;
        border-radius: 5px !important;
        background-color: #f2f2f2 !important;
        margin-top: 10px;
        .MuiLinearProgress-bar {
            background-color: ${({ theme }) => theme.bodyBlue} !important;
        }
    }
`;
const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});
interface BarChartProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}
interface valProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: string;
    y: number;
}
export default function BarChart(props: BarChartProps) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {props.data
                .map((val: valProps, index: number) => (
                    <span key={index}>
                        <Grid container spacing={3} style={{ marginTop: 20 }}>
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
