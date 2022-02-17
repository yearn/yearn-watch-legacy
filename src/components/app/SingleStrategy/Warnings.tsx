import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';

type Props = {
    warnings: string[];
};

const ShowWarnings = ({ warnings }: Props) => {
    if (warnings.length == 0) {
        return null;
    }
    const [openSnackBar, setOpenSB] = useState(true);
    const handleCloseSnackBar = () => {
        setOpenSB(false);
    };
    return (
        <Snackbar
            open={openSnackBar}
            onClose={handleCloseSnackBar}
            autoHideDuration={10000}
        >
            <Alert onClose={handleCloseSnackBar} severity="warning">
                {`Issue loading the following fields for some strategies: ${JSON.stringify(
                    warnings
                )}`}
            </Alert>
        </Snackbar>
    );
};

export default ShowWarnings;
