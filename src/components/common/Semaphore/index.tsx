import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import React from 'react';

type SemaphoreProps = {
    value: string | number | boolean;
};

export const Semaphore = (props: SemaphoreProps) => {
    const { value } = props;
    if (typeof value === 'number') {
        if (value > 4) {
            return <FiberManualRecordIcon htmlColor="green" />;
        }
        if (value > 3) {
            return <FiberManualRecordIcon htmlColor="yellow" />;
        }
        return <FiberManualRecordIcon htmlColor="red" />;
    }
    if (typeof value === 'boolean') {
        if (value) {
            return <FiberManualRecordIcon htmlColor="green" />;
        } else {
            return <FiberManualRecordIcon htmlColor="red" />;
        }
    }
    if (typeof value === 'string') {
        if (value !== undefined && value !== null) {
            return <FiberManualRecordIcon htmlColor="green" />;
        } else {
            return <FiberManualRecordIcon htmlColor="red" />;
        }
    }
    return <React.Fragment></React.Fragment>;
};
