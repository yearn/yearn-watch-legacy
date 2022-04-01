import { HtmlTooltip } from '../HtmlTooltip';
import { Fragment } from 'react';
import { HelpOutlined } from '@mui/icons-material';
import { GenericList, GenericListItem } from '../../app';
import { HeadCell } from '../../app/GenericList/HeadCell';

export const headCells: HeadCell<GenericListItem>[] = [
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
        description:
            'Strategy is very complex, uses leverage or debt, not esay to unwind. No health check',
        value: 5,
    },
    {
        description:
            'Uses leverage or debt, not easy to unwind. No health check.',
        value: 4,
    },
    {
        description:
            'No health check. Has loss potential, withdraw fee or requires detailed queue management to avoid loss',
        value: 3,
    },
    {
        description:
            'Strategy is simple, easy to migrate/unwind. Has health check.',
        value: 2,
    },
    {
        description:
            'Strategy is simple, easy to migrate/unwind. No leveragte and zero external non permissioned calls. Is not lossy by design',
        value: 1,
    },
];

type ComplexityTooltipProps = {
    value: number;
};

export const ComplexityTooltip = (props: ComplexityTooltipProps) => {
    const getStyle = (item: GenericListItem) => {
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
                        title={`Complexity Score Definition`}
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
