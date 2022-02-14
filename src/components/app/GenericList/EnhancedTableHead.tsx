import { Order } from './Order';
import { useStyles } from './useStyles';
import {
    TableHead,
    TableRow,
    TableCell,
    TableSortLabel,
    Tooltip,
} from '@material-ui/core';
import { HeadCell } from './HeadCell';
import { GenericListItem } from '.'; // Data,
import { HelpOutlineRounded } from '@material-ui/icons';

interface EnhancedTableProps<ItemType extends GenericListItem> {
    classes: ReturnType<typeof useStyles>;
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof GenericListItem
    ) => void;
    order: Order;
    orderBy: string;
    headCells: HeadCell<ItemType>[];
    shouldCollapse?: boolean;
}

export const EnhancedTableHead = <T extends GenericListItem>(
    props: EnhancedTableProps<T>
) => {
    const {
        classes,
        order,
        orderBy,
        onRequestSort,
        shouldCollapse = false,
    } = props;
    const createSortHandler =
        (property: keyof GenericListItem) =>
        (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    const collapseCell = shouldCollapse ? (
        <TableCell key="collapse" align="center" padding="normal">
            Details
        </TableCell>
    ) : (
        ''
    );

    return (
        <TableHead>
            <TableRow>
                {collapseCell}
                {props.headCells.map((headCell, index) => (
                    <TableCell
                        key={`header-${index}`}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <>
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={
                                    orderBy === headCell.id ? order : 'asc'
                                }
                                onClick={
                                    headCell.id
                                        ? createSortHandler(headCell.id)
                                        : undefined
                                }
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc'
                                            ? 'sorted descending'
                                            : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                            {headCell.tooltip ? (
                                <Tooltip title={headCell.tooltip}>
                                    <HelpOutlineRounded fontSize="small" />
                                </Tooltip>
                            ) : (
                                ''
                            )}
                        </>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};
