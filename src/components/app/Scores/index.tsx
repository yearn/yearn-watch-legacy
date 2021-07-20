/* eslint-disable react/display-name */
import { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';

import { useOnGet } from '@typesaurus/react';
import { init as initFB } from '../../../utils/firebase';
import { Grouping } from '../../../types/grouping';
import { GenericList, GenericListItem } from '../GenericList';
import _ from 'lodash';
import {
    amountToMMs,
    getAverage,
    getMedian,
    getTvlImpact,
} from '../../../utils/commonUtils';
import { ScoreRowCollapse } from '../../common/ScoreRowCollapse';
import { getStrategyTVLsPerProtocol } from '../../../utils/strategiesHelper';
import { headCells } from './headerDefinition';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            padding: theme.spacing(2),
            textAlign: 'center',
        },
    })
);

export const Scores = () => {
    const [groups, setGroups] = useState<Grouping[]>([]);
    const [items, setItems] = useState<any[]>([]);
    const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
    const { groupings } = initFB();
    const groupingId = 'default';
    const [groupData, { loading: isLoadingGroupData, error }] = useOnGet(
        groupings,
        groupingId
    );
    const classes = useStyles();
    if (groups.length === 0 && groupData) {
        setGroups(groupData.data.groups);
    }
    useEffect(() => {
        if (groups.length === 0) {
            return;
        }
        const itemPromises = groups.map(async (item) => {
            const newItem = _.omit(item, 'criteria');
            const protocol = await getStrategyTVLsPerProtocol(item.id);
            const tvlImpact = getTvlImpact(amountToMMs(protocol.tvl));
            const values = [
                item.auditScore,
                item.codeReviewScore,
                item.complexityScore,
                item.longevityScore,
                item.protocolSafetyScore,
                item.teamKnowledgeScore,
                item.testingScore,
            ];
            const averageLikelihood = getAverage(values);
            const medianLikelihood = getMedian(values);
            return {
                ...newItem,
                tvlImpact,
                averageLikelihood,
                medianLikelihood,
                totalScore: tvlImpact * medianLikelihood,
                groupingId,
            };
        });
        Promise.all(itemPromises).then((items) => {
            setItems(items);
            setIsLoadingItems(false);
        });
    }, [groups]);
    if (error) {
        return <div>Failed to load the scores!</div>;
    }
    if (isLoadingItems || isLoadingGroupData) {
        return (
            <div className={classes.root}>
                <Typography style={{ color: '#fff' }}>
                    <p>Loading info to calculate scores... </p>
                </Typography>
            </div>
        );
    }

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
    }
};
