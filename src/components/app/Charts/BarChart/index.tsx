import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Grid } from '@material-ui/core';

import { SubTitle, ValuePercentage } from '../../../common/Labels';

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

const StyledContainer = styled.div`
    padding: 16px;
    padding-top: 0;
`;

interface BarChartProps {
    data: BarChartData[];
}

export default function BarChart(props: BarChartProps) {
    const { data } = props;
    return (
        <StyledContainer>
            {data
                .map((val, index) => (
                    <span key={index}>
                        <Grid
                            container
                            spacing={3}
                            style={{
                                marginTop: index === data.length - 1 ? 0 : 20,
                            }}
                        >
                            <Grid item xs={6}>
                                <SubTitle>{val.name}</SubTitle>
                            </Grid>
                            <Grid item xs={6}>
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
        </StyledContainer>
    );
}
