import { GenericListItem } from '.';

export type Align = 'inherit' | 'left' | 'center' | 'right' | 'justify';

export type CellPosition = {
    rowNumber: number;
    columnNumber: number;
};
export interface HeadCell<ItemType extends GenericListItem> {
    disablePadding: boolean;
    id?: keyof GenericListItem;
    label: string;
    numeric: boolean;
    align: Align;
    tooltip?: string;
    // Format a value
    format?: (
        item: ItemType,
        value: string | number | boolean,
        position: CellPosition
    ) => any;
    getStyle?: (item: ItemType, position: CellPosition) => any;
}
