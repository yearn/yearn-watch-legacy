import MuiTable from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

import Paper from '@material-ui/core/Paper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table = (props: any) => {
    return (
        <TableContainer component={Paper}>
            <MuiTable aria-label="simple table">{props.children}</MuiTable>
        </TableContainer>
    );
};
export default Table;
