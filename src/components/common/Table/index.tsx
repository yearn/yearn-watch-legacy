import MuiTable from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';

import Paper from '@mui/material/Paper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table = (props: any) => {
    return (
        <TableContainer component={Paper}>
            <MuiTable aria-label="simple table">{props.children}</MuiTable>
        </TableContainer>
    );
};
export default Table;
