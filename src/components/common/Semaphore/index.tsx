import { Tooltip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import React from 'react';

type SemaphoreProps = {
    impact: number;
    likelihood: number;
};
export const colors = [
    ['#f5f514', '#f5f514', '#ff6262', '#ff6262', '#ff6262'],
    ['#19c519', '#f5f514', '#f5f514', '#ff6262', '#ff6262'],
    ['#19c519', '#19c519', '#f5f514', '#f5f514', '#ff6262'],
    ['#19c519', '#19c519', '#19c519', '#f5f514', '#f5f514'],
    ['#19c519', '#19c519', '#19c519', '#19c519', '#f5f514'],
];

export const getSemaphoreInfo = (props: SemaphoreProps) => {
    const value = props.impact * props.likelihood;
    const impactIndex = colors.length - props.impact;
    const likelihoodIndex = props.likelihood - 1;
    const color = colors[impactIndex][likelihoodIndex];
    return {
        value,
        impactIndex,
        likelihoodIndex,
        color,
    };
};

export const Semaphore = (props: SemaphoreProps) => {
    const value = props.impact * props.likelihood;
    const impactIndex = colors.length - props.impact;
    const likelihoodIndex = props.likelihood - 1;
    const color = colors[impactIndex][likelihoodIndex];
    return (
        <Tooltip
            title={`Impact (${props.impact}) * Likelihood (${props.likelihood}) = ${value}`}
        >
            <FiberManualRecordIcon htmlColor={color} />
        </Tooltip>
    );
};
