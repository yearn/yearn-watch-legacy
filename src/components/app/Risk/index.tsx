/* eslint-disable react/display-name */
import { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { useOnGet } from '@typesaurus/react';
import { init as initFB } from '../../../utils/firebase';
import { Grouping } from '../../../types/grouping';
import _ from 'lodash';
import {
    amountToMMs,
    getAverage,
    getMedian,
    getTvlImpact,
} from '../../../utils/commonUtils';
import { getStrategyTVLsPerProtocol } from '../../../utils/strategiesHelper';
import { RiskChart } from '../../common/RiskChart';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            padding: theme.spacing(2),
            textAlign: 'center',
        },
    })
);

export const Risk = () => {
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
        const itemPromises = groups.map(async (item) => {
            const newItem = _.omit(item, 'criteria');
            const protocol = await getStrategyTVLsPerProtocol(item.label);
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
                label: item.label,
                likelihood: medianLikelihood,
                impact: tvlImpact,
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
                    <p>Loading... </p>
                </Typography>
            </div>
        );
    }

    return (
        <div>
            <Typography style={{ color: '#fff' }}>
                <p>Welcome to the Risk Chart!</p>
            </Typography>
            <RiskChart items={items} />
        </div>
    );
};
