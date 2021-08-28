import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiTable from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table = (props: any) => {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <MuiTable className={classes.table} aria-label="simple table">
                {props.children}
            </MuiTable>
        </TableContainer>
    );
};
export default Table;
