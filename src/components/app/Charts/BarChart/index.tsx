import styled from 'styled-components';
import { Grid, LinearProgress, Typography, Box, useTheme } from '@mui/material';
import { ValuePercentage } from '../../../common/Labels';

export type BarChartData = {
    name: string;
    y: number;
};

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

type BarChartProps = {
    data: BarChartData[];
};

export default function BarChart(props: BarChartProps) {
    const { data } = props;
    const theme = useTheme();
    return (
        <Box>
            {data
                .map((val, index) => (
                    <Box key={index} marginY={theme.spacing(2)}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    {val.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <ValuePercentage>{val.y} %</ValuePercentage>
                            </Grid>
                        </Grid>

                        <BorderLinearProgress
                            variant="determinate"
                            value={val.y}
                        />
                    </Box>
                ))
                .reverse()}
        </Box>
    );
}
