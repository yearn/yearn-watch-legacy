import React from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';

type ErrorAlertProps = {
    message: string;
    details?: string | Error;
};
export const ErrorAlert = (props: ErrorAlertProps) => {
    const { message, details } = props;
    let detailsLabel = details;
    if (details && details instanceof Error) {
        detailsLabel = details.message;
    }

    return (
        <div>
            <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {message}{' '}
                {detailsLabel && (
                    <React.Fragment>
                        — <strong>{detailsLabel}</strong>
                    </React.Fragment>
                )}
            </Alert>
        </div>
    );
};
