import HtmlTooltip from '../HtmlTooltip';
import { Fragment } from 'react';
import { HelpOutlined } from '@mui/icons-material';
import { GenericList, GenericListItem } from '../../app';
import { HeadCell } from '../../app/GenericList/HeadCell';

export const headCells: HeadCell<GenericListItem>[] = [
    {
        id: 'label',
        numeric: false,
        disablePadding: false,
        label: 'Impact',
        align: 'center',
    },
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
        label: 'Impact',
        align: 'center',
    },
];
/*
	Impact	Score
    Extreme	> 100M	5
    Very High	less than 100M	4
    High	less than 50M	3
    Medium 	less than 10M	2
    Low	less than 1M	1
*/
const items = [
    {
        label: 'Extreme',
        description: '> USD 100 MM',
        value: 5,
    },
    {
        label: 'Very high',
        description: 'less than USD 100 MM',
        value: 4,
    },
    {
        label: 'High',
        description: 'less than USD 50 MM',
        value: 3,
    },
    {
        label: 'Medium',
        description: 'less than USD 10 MM',
        value: 2,
    },
    {
        label: 'Low',
        description: 'less than USD 1 MM',
        value: 1,
    },
];

type TVLImpactTooltipProps = {
    value: number;
};

export const TVLImpactTooltip = (props: TVLImpactTooltipProps) => {
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
                        title={`TVL Impact Definition`}
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
