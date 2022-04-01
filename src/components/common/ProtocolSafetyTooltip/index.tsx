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
            'no DD document for this strategy and protocol contracts used are very recent and not audited/verified',
        value: 5,
    },
    {
        description: 'DD, contracts verified, and multisig',
        value: 4,
    },
    {
        description:
            'DD, requires a multisig. Contracts are verified and audited at least by one firm.',
        value: 3,
    },
    {
        description:
            'DD, requires a multisig. Protocol has bug bounties. Contracts are verified and audited at least by 2 firms.',
        value: 2,
    },
    {
        description:
            'Protocols involved in contract are blue chip protocols trusted and good record of security. Maker, Curve, AAVE, Compound',
        value: 1,
    },
];

type ProtocolSafetyTooltipProps = {
    value: number;
};

export const ProtocolSafetyTooltip = (props: ProtocolSafetyTooltipProps) => {
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
                        title={`Protocol Safety Score Definition`}
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
