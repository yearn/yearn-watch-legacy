/* eslint-disable react/display-name */
import { Tooltip } from '@material-ui/core';
import { GenericListItem } from '../../app/GenericList';
import { Link } from 'react-router-dom';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';
import { HeadCell } from '../../app/GenericList/HeadCell';
import { Semaphore } from '../Semaphore';
import { TVLImpactTooltip } from '../TVLImpactTooltip';
import { amountToMMs } from '../../../utils/commonUtils';
import BigNumber from 'bignumber.js';

export const scoreHeadCells: HeadCell[] = [
    {
        numeric: false,
        disablePadding: false,
        label: 'Links',
        align: 'center',
        format: (item: GenericListItem) => {
            return (
                <Tooltip
                    title={`View how the total TVL is allocated in the group ${item.label}`}
                >
                    <Link
                        color="inherit"
                        target="_blank"
                        to={`/network/${item.network}/query/${item.groupingId}/group/${item.groups}/${item.urlParam}`}
                    >
                        <MonetizationOnRoundedIcon
                            fontSize="small"
                            htmlColor="gray"
                        />
                    </Link>
                </Tooltip>
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
        id: 'totalStrategies',
        numeric: true,
        disablePadding: false,
        label: '# Strategies',
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
                    {` (USD ${amountToMMs(
                        item.tvl as unknown as BigNumber
                    ).toFixed(2)} MM)`}
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
        format: (item: GenericListItem) => {
            return (
                <Semaphore
                    impact={parseInt(item.tvlImpact.toString())}
                    likelihood={parseInt(item.medianLikelihood.toString())}
                />
            );
        },
    },
];
