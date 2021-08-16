import { HtmlTooltip } from '../HtmlTooltip';
import { Fragment } from 'react';
import { HelpOutlined } from '@material-ui/icons';
import { GenericList, GenericListItem } from '../../app';
import { CellPosition, HeadCell } from '../../app/GenericList/HeadCell';

export const headCells: HeadCell[] = [
    {
        id: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Description',
        align: 'center',
    },
    {
        id: 'value',
        numeric: true,
        disablePadding: false,
        label: 'Score',
        align: 'center',
    },
];

/*
    5: Worst Score, new code, did not go to ape tax before
    4: Code has been live less than a month
    3: 1 to 2+ months live
    2: 4+ months live
    1: Best score, Has had a 8+ months live in prod with no critical issues found and No changes in code base
*/
const items = [
    {
        description: 'New code. Did not go to ape tax before',
        value: 5,
    },
    {
        description: 'Code has been live less than a month',
        value: 4,
    },
    {
        description: '1 to <4 months live',
        value: 3,
    },
    {
        description: '4+ months live',
        value: 2,
    },
    {
        description:
            '8+ months live, no critical issues and no changes in code base',
        value: 1,
    },
];

type LongevityTooltipProps = {
    value: number;
};

export const LongevityTooltip = (props: LongevityTooltipProps) => {
    const getStyle = (item: GenericListItem, _position: CellPosition) => {
        if (item.value === props.value) {
            return {
                backgroundColor: '#bebebe',
            };
        }
    };
    const headCellsMapped = headCells.map((headCell) => {
        return {
            ...headCell,
            getStyle,
        };
    });
    return (
        <HtmlTooltip
            title={
                <Fragment>
                    <GenericList
                        headCells={headCellsMapped}
                        items={items}
                        title={`Longevity Score Definition`}
                        defaultRowsPerPage={5}
                        displayPagination={false}
                    />
                </Fragment>
            }
        >
            <HelpOutlined fontSize="small" />
        </HtmlTooltip>
    );
};
