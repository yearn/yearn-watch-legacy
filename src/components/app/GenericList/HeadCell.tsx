import { GenericListItem } from '.';

export type Align = 'inherit' | 'left' | 'center' | 'right' | 'justify';

export interface HeadCell {
    disablePadding: boolean;
    id?: keyof GenericListItem;
    label: string;
    numeric: boolean;
    align: Align;
    tooltip?: string;
    // Format a value
    format?: (item: GenericListItem, value: string | number | boolean) => any;
}
