import { Typography, Container } from '@material-ui/core';
import React from 'react';

type StrategyDetailSectionProps = {
    title: string;
    content: JSX.Element;
};

const StrategyDetailSection = ({
    title,
    content,
}: StrategyDetailSectionProps) => {
    return (
        <Container>
            <Typography
                style={{ marginTop: '16px', marginBottom: '16px' }}
                variant="h5"
            >
                {title}
            </Typography>
            {content}
        </Container>
    );
};

export default StrategyDetailSection;
