/* eslint-disable react/display-name */
import { useEffect, useState } from 'react';
import { Theme, Typography } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Grouping } from '../../../types/grouping';
import _ from 'lodash';
import {
    amountToMMs,
    getAverage,
    getMedian,
    sumAll,
} from '../../../utils/commonUtils';
import {
    getExcludeIncludeUrlParams,
    getLongevityScore,
    getTvlImpact,
} from '../../../utils/risk';
import { getStrategyTVLsPerProtocol } from '../../../utils/strategiesHelper';
import { RiskChart } from '../../common/RiskChart';
import { GenericList, GenericListItem } from '../GenericList';
import { ScoreRowCollapse } from '../../common/ScoreRowCollapse';
import { scoreHeadCells } from '../../common/headers/scoresHeaderDefinition';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ParamTypes } from '../../../types/DefaultParamTypes';
import { DEFAULT_NETWORK, Network } from '../../../types';
import { initRiskFrameworkScores } from '../../../utils/risk-framework';

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
    const { network = DEFAULT_NETWORK } = useParams() as ParamTypes;
    const [groups, setGroups] = useState<Grouping[]>([]);
    const [totalStrategies, setTotalStrategies] = useState<number>(0);
    const [totalTVL, setTotalTVL] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [items, setItems] = useState<any[]>([]);
    const [isLoadingItems, setIsLoadingItems] = useState<boolean>(true);
    const groupData = initRiskFrameworkScores(network);
    const groupingId = 'default';
    if (groups.length === 0 && groupData) {
        setGroups(groupData);
    }
    const classes = useStyles();
    useEffect(() => {
        if (groups.length == 0) {
            return;
        }

        const itemPromises = groups.map(async (item) => {
            const newItem = _.omit(item, 'criteria');
            const protocol = await getStrategyTVLsPerProtocol(
                item.id,
                item.criteria.nameLike,
                network as Network,
                item.criteria.strategies,
                item.criteria.exclude
            );
            const urlParam = getExcludeIncludeUrlParams({
                exclude: item.criteria.exclude as unknown as string,
                include: item.criteria.strategies as unknown as string,
            });
            const tvlImpact = getTvlImpact(amountToMMs(protocol.tvl));
            const longevityScore = getLongevityScore(
                protocol.getLongevityDays()
            );
            const values = [
                item.auditScore,
                item.codeReviewScore,
                item.complexityScore,
                longevityScore,
                item.protocolSafetyScore,
                item.teamKnowledgeScore,
                item.testingScore,
            ];
            const averageLikelihood = getAverage(values);
            const medianLikelihood = getMedian(values);
            return {
                ...newItem,
                // strategies: protocol.strategies,
                longevityScore,
                label: item.label,
                likelihood: medianLikelihood,
                impact: tvlImpact,
                tvlImpact,
                averageLikelihood,
                medianLikelihood,
                totalScore: tvlImpact * medianLikelihood,
                groupingId,
                groups: item.criteria.nameLike.join(','),
                urlParam,
                tvl: protocol.tvl,
                hasTVL: protocol.tvl.isGreaterThan(0),
                totalStrategies: protocol.strategies.length,
            };
        });
        Promise.all(itemPromises).then((items) => {
            const totalStrategies = sumAll(
                items.map((item) => item.totalStrategies as number)
            );
            const totalTVL = sumAll(items.map((item) => amountToMMs(item.tvl)));
            setTotalStrategies(totalStrategies);
            setTotalTVL(totalTVL);
            setItems(items);
            setIsLoadingItems(false);
        });
    }, [groups]);

    if (isLoadingItems) {
        return (
            <div className={classes.root}>
                <CircularProgress />
                <Typography style={{ color: '#fff' }}>
                    <p>Loading info... </p>
                </Typography>
            </div>
        );
    }
    const collapseRow = (index: number, item: GenericListItem) => (
        <ScoreRowCollapse index={index} item={item} />
    );

    const getRowStyle = (_index: number, item: GenericListItem) => {
        if (!item.hasTVL) {
            return {
                borderColor: 'red',
                borderStyle: 'groove',
            };
        }
    };

    return (
        <div>
            <Typography style={{ color: '#fff' }}>
                <p>Welcome to the Risk Chart!</p>
            </Typography>
            <RiskChart items={items} />
            <GenericList
                headCells={scoreHeadCells}
                items={items}
                title={`Scores List - ${
                    items.length
                } Groups - ${totalStrategies} Strategies - Total TVL: USD ${totalTVL.toFixed(
                    2
                )} MM`}
                collapse={collapseRow}
                defaultOrder="desc"
                defaultOrderBy="totalScore"
                getRowStyle={getRowStyle}
                defaultRowsPerPage={20}
            />
        </div>
    );
};
