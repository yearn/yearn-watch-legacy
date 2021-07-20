/* eslint-disable react/display-name */
import { Tooltip } from '@material-ui/core';
import { GenericListItem } from '../GenericList';
import { Link } from 'react-router-dom';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import { HeadCell } from '../GenericList/HeadCell';
import { Semaphore } from '../../common/Semaphore';
import { TVLImpactTooltip } from '../../common/TVLImpactTooltip';

export const headCells: HeadCell[] = [
    {
        numeric: false,
        disablePadding: false,
        label: 'Links',
        align: 'center',
        format: (item: GenericListItem) => {
            return (
                <>
                    <Link
                        color="inherit"
                        target="_blank"
                        to={`/query/${item.groupingId}/group/${item.id}`}
                    >
                        <Tooltip
                            title={`View how the total TVL is allocated in the group ${item.label}`}
                        >
                            <MonetizationOnRoundedIcon
                                fontSize="small"
                                htmlColor="gray"
                            />
                        </Tooltip>
                    </Link>
                </>
            );
        },
    },
    {
        id: 'label',
        numeric: false,
        disablePadding: false,
        label: 'Group',
        align: 'center',
    },
    {
        id: 'tvlImpact',
        numeric: true,
        disablePadding: false,
        label: 'Impact',
        align: 'center',
        format: (item: GenericListItem, value: string | number | boolean) => {
            return (
                <div>
                    {parseFloat(value.toString()).toFixed(0)}
                    <TVLImpactTooltip value={parseFloat(value.toString())} />
                </div>
            );
        },
    },
    {
        id: 'medianLikelihood',
        numeric: true,
        disablePadding: false,
        label: 'Med. Likelihood',
        align: 'center',
        format: (item: GenericListItem, value: string | number | boolean) => {
            return parseFloat(value.toString()).toFixed(0);
        },
    },
    {
        id: 'totalScore',
        numeric: false,
        disablePadding: false,
        label: 'Score',
        align: 'center',
        format: (item: GenericListItem, _value: string | number | boolean) => {
            return (
                <Semaphore
                    impact={parseInt(item.tvlImpact.toString())}
                    likelihood={parseInt(item.medianLikelihood.toString())}
                />
            );
        },
    },
];
