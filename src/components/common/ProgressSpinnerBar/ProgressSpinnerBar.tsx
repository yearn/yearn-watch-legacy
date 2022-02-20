import { useEffect, useState } from 'react';
import styled from 'styled-components';

import LinearProgress from '@mui/material/LinearProgress';
import { Container } from '@mui/material';

const StyledTypography = styled.div`
    text-align: center;
    font-weight: 200;
    color: white;
    margin-bottom: 16px;
`;

const StyledRootDiv = styled.div`
    width: 100%;
    margin: 16px auto;
`;

const StyledLinearProgress = styled(LinearProgress)`
    && {
        .MuiLinearProgress-bar {
            background-color: ${({ theme }) => theme.barProgress} !important;
        }
    }
`;
interface LinearDeterminateProps {
    label?: string;
}
export default function LinearDeterminate(props: LinearDeterminateProps) {
    const [completed, setCompleted] = useState(0);

    useEffect(() => {
        function progress() {
            setCompleted((oldCompleted) => {
                const diff = Math.random() * 10;
                return Math.min(oldCompleted + diff, 95);
            });
        }

        const timer = setInterval(progress, 600);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Container>
            <StyledRootDiv>
                <StyledTypography>Loading {props.label}</StyledTypography>

                <StyledLinearProgress
                    variant="determinate"
                    value={completed}
                    color="primary"
                />
            </StyledRootDiv>
        </Container>
    );
}
