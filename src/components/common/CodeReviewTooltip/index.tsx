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
        description: '1 reviewer only or was done 6 months or more ago',
        value: 5,
    },
    {
        description: '2 reviewers was done 3+ months ago',
        value: 4,
    },
    {
        description:
            '3 reviewers was done 3+ month ago(only one security dev reviewed + 2 peers)',
        value: 3,
    },
    {
        description:
            '3+ reviewers, at least one security dev reviewed, recently',
        value: 2,
    },
    {
        description:
            '+4 reviewers, Two security reviewers and External protocol devs reviewed',
        value: 1,
    },
];

type CodeReviewTooltipProps = {
    value: number;
};

export const CodeReviewTooltip = (props: CodeReviewTooltipProps) => {
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
                        title={`Code Review Score Definition`}
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
