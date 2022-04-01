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
            '1 person in the team is the only one that has in depth knowledge of the strategy code.',
        value: 5,
    },
    {
        description:
            '1 Strategist in depth knowledge, 1 strategist somewhat familar',
        value: 4,
    },
    {
        description: '2 strategists have depth knowledge',
        value: 3,
    },
    {
        description:
            '2 strategists have depth knowledge, +1 strategist somewhat familar',
        value: 2,
    },
    {
        description:
            'Team of 3+ strategist are very familar with the code and protocol',
        value: 1,
    },
];

type TeamKnowledgeTooltipProps = {
    value: number;
};

export const TeamKnowledgeTooltip = (props: TeamKnowledgeTooltipProps) => {
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
                        title={`Team Knowledge Score Definition`}
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
