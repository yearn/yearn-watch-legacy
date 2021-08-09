import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Paper,
} from '@material-ui/core';
import { EnhancedTableToolbar } from './EnhancedTableToolbar';
import { useStyles } from './useStyles';
import { Order } from './Order';
import { getComparator, stableSort } from './utils';
import { EnhancedTableHead } from './EnhancedTableHead';
import { HeadCell } from './HeadCell';
import { ItemRow } from './ItemRow';

export type GenericListItem = {
    [x: string]: string | number;
};

type GenericListProps<ItemType extends GenericListItem> = {
    items: Array<ItemType>;
    collapse?: (index: number, item: ItemType) => React.ReactNode;
    headCells: HeadCell[];
    title: string;
    defaultRowsPerPage?: number;
    displayPagination?: boolean;
    defaultOrderBy?: string;
    defaultOrder?: Order;
    getRowStyle?: (
        index: number,
        item: ItemType
    ) => React.CSSProperties | undefined;
};

export const GenericList = <T extends GenericListItem>(
    props: GenericListProps<T>
) => {
    const {
        defaultRowsPerPage = 10,
        defaultOrder = 'asc',
        defaultOrderBy = 'id',
    } = props;
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>(defaultOrder);
    const [orderBy, setOrderBy] = React.useState<keyof GenericListItem>(
        defaultOrderBy
    );
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
    const { items, title, headCells, displayPagination = true } = props;

    const shouldCollapse = props.collapse !== undefined;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof GenericListItem
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar title={title} />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size="small"
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy.toString()}
                            headCells={props.headCells}
                            onRequestSort={handleRequestSort}
                            shouldCollapse={shouldCollapse}
                        />
                        <TableBody>
                            {stableSort(items, getComparator(order, orderBy))
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <ItemRow
                                            headCells={headCells}
                                            item={row}
                                            index={index}
                                            key={labelId}
                                            collapse={props.collapse}
                                            getRowStyle={props.getRowStyle}
                                        />
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 33 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {displayPagination ? (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20, 40, 60, 75, 100]}
                        component="div"
                        count={items.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                ) : (
                    ''
                )}
            </Paper>
        </div>
    );
};
