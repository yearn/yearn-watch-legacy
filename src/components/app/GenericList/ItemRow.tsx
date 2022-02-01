import {
    Box,
    Collapse,
    IconButton,
    TableCell,
    TableRow,
} from '@material-ui/core';
import { useState } from 'react';
import { GenericListItem } from '.';
import { HeadCell } from './HeadCell';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export interface ItemRowProps<ItemType extends GenericListItem> {
    headCells: HeadCell<ItemType>[];
    item: ItemType;
    index: number;
    collapse?: (index: number, item: ItemType) => React.ReactNode;
    getRowStyle?: (
        index: number,
        item: ItemType
    ) => React.CSSProperties | undefined;
}

export const ItemRow = <T extends GenericListItem>(props: ItemRowProps<T>) => {
    const [open, setOpen] = useState(false);
    const { item, index, headCells } = props;
    const labelId = `enhanced-table-checkbox-${index}`;
    const shouldCollapse = props.collapse !== undefined;

    const itemRow = headCells.map((headCell, headIndex) => {
        const itemRowKey = `${labelId}-${headIndex}`;
        const itemIdValue = headCell.id ? item[headCell.id] : '';
        const position = {
            rowNumber: index + 1,
            columnNumber: headIndex + 1,
        };
        const cellStyle = headCell.getStyle
            ? headCell.getStyle(item, position)
            : undefined;
        return (
            <TableCell
                component="th"
                id={labelId}
                scope="row"
                padding="default"
                key={itemRowKey}
                align={headCell.align}
                style={cellStyle}
            >
                {headCell.format
                    ? headCell.format(item, itemIdValue, position)
                    : itemIdValue}
            </TableCell>
        );
    });
    const collapseButton = shouldCollapse ? (
        <TableCell
            component="th"
            id={`collapse-${index}`}
            scope="row"
            padding="default"
            key={`collapse-${index}`}
            align="center"
        >
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
            >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </TableCell>
    ) : (
        ''
    );
    const collapseRow = shouldCollapse ? (
        <TableRow>
            <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={headCells.length}
            >
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        {props.collapse ? props.collapse(index, item) : ''}
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    ) : (
        ''
    );
    return (
        <>
            <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={item.key}
                style={
                    props.getRowStyle
                        ? props.getRowStyle(index, item)
                        : undefined
                }
            >
                {collapseButton}
                {itemRow}
            </TableRow>
            {collapseRow}
        </>
    );
};
