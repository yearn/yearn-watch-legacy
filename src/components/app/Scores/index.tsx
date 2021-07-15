/* eslint-disable react/display-name */
import { useState } from 'react';
import { Tooltip, Typography } from '@material-ui/core';

import { useOnGet } from '@typesaurus/react';
import { init as initFB } from '../../../utils/firebase';
import { Grouping } from '../../../types/grouping';
import { GenericList, GenericListItem } from '../GenericList';
import { HeadCell } from '../GenericList/HeadCell';
import _ from 'lodash';
import { getAverage, getMedian } from '../../../utils/commonUtils';
import { ScoreRowCollapse } from '../../common/ScoreRowCollapse';
import { Semaphore } from '../../common/Semaphore';
import { Link } from 'react-router-dom';
import MonetizationOnRoundedIcon from '@material-ui/icons/MonetizationOnRounded';

const headCells: HeadCell[] = [
    {
        id: 'averageScore',
        numeric: false,
        disablePadding: false,
        label: 'Score',
        align: 'center',
        format: (item: GenericListItem, value: string | number | boolean) => {
            return <Semaphore value={value} />;
        },
    },
    {
        numeric: false,
        disablePadding: false,
        label: 'Actions',
        align: 'center',
        format: (item: GenericListItem) => {
            return (
                <>
                    <Link
                        color="inherit"
                        target="_blank"
                        to={`/query/${item.groupingId}/group/${item.label}`}
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
        id: 'averageScore',
        numeric: true,
        disablePadding: false,
        label: 'Average',
        align: 'center',
        format: (item: GenericListItem, value: string | number | boolean) => {
            return parseFloat(value.toString()).toFixed(3);
        },
    },
    {
        id: 'medianScore',
        numeric: true,
        disablePadding: false,
        label: 'Median',
        align: 'center',
        format: (item: GenericListItem, value: string | number | boolean) => {
            return parseFloat(value.toString()).toFixed(3);
        },
    },
];

export const Scores = () => {
    const [groups, setGroups] = useState<Grouping[]>([]);
    const { groupings } = initFB();
    const groupingId = 'default';
    const [groupData, { loading, error }] = useOnGet(groupings, groupingId);
    if (groups.length === 0 && groupData) {
        setGroups(groupData.data.groups);
    }
    if (error) {
        return <div>Failed to load the scores!</div>;
    }
    const items = groups.map((item) => {
        const newItem = _.omit(item, 'criteria');
        const values = [
            item.auditScore,
            item.codeReviewScore,
            item.complexityScore,
            item.longevityScore,
            item.protocolSafetyScore,
            item.teamKnowledgeScore,
            item.testingScore,
        ];
        return {
            ...newItem,
            averageScore: getAverage(values),
            medianScore: getMedian(values),
            groupingId,
        };
    });
    const collapseRow = (index: number, item: GenericListItem) => (
        <ScoreRowCollapse index={index} item={item} />
    );

    if (groups) {
        return (
            <div>
                <Typography style={{ color: '#fff' }}>
                    <p> Welcome to the Scores!</p>
                </Typography>
                <GenericList
                    headCells={headCells}
                    items={items}
                    title={`Scores List - ${items.length} Groups`}
                    collapse={collapseRow}
                />
            </div>
        );
    } else if (loading) {
        return (
            <div>
                <Typography style={{ color: '#fff' }}>
                    <p>Loading... </p>
                </Typography>
            </div>
        );
    }
};
