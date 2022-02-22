/* eslint-disable react/display-name */
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { ProtocolTVL } from '../../../types/protocol-tvl';
import { ParamTypes } from '../../../types/DefaultParamTypes';
import { DEFAULT_NETWORK } from '../../../types';
import { amountToMMs, extractAddress } from '../../../utils/commonUtils';
import { getTvlImpact } from '../../../utils/risk';
import { GenericList, GenericListItem } from '../GenericList';
import { HeadCell } from '../GenericList/HeadCell';

const HIGH_DEBT_TO_ASSETS_RATIO = 1.5;
const HEALTHY_DEBT_MULTIPLIER = 2;

const headCells: HeadCell<StrategyTVLListItem>[] = [
    {
        numeric: false,
        disablePadding: false,
        align: 'center',
        label: 'Strategy Name',
        format: (item: GenericListItem) => {
            return (
                <Link
                    style={{ color: '#ce93d8' }}
                    to={`/network/${item.network}/vault/${item.vault}/strategy/${item.strategy}`}
                    target="_blank"
                >
                    {`${item.name} (${extractAddress(
                        item.strategy as string
                    )})`}
                </Link>
            );
        },
    },
    {
        numeric: true,
        disablePadding: false,
        align: 'center',
        label: 'Activation',
        format: (item: GenericListItem) => {
            return <div>{new Date(item.activation).toUTCString()}</div>;
        },
    },
    {
        id: 'estimatedTotalAssetsUsdcNumber',
        numeric: true,
        disablePadding: false,
        align: 'center',
        label: 'TVL (MM)',
    },
    {
        id: 'totalTvlPercentage',
        numeric: true,
        disablePadding: false,
        align: 'center',
        label: 'TVL %',
    },
    {
        id: 'debtOutstandingUsdcNumber',
        numeric: true,
        disablePadding: false,
        align: 'center',
        label: 'Debt Outstanding (MM)',
        getStyle: (item: StrategyTVLListItem) => {
            const hasHighDebtToAssetsRatio =
                item.debtOutstandingUsdcNumber >
                HIGH_DEBT_TO_ASSETS_RATIO * item.estimatedTotalAssetsUsdcNumber;
            return hasHighDebtToAssetsRatio
                ? {
                      backgroundColor: '#f5f514',
                  }
                : {};
        },
    },
    {
        id: 'tvlImpact',
        numeric: true,
        disablePadding: false,
        align: 'center',
        label: 'TVL Impact (5-1 Extreme-Low)',
    },
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 750,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    })
);

type StrategyProtocolListProps = {
    item: ProtocolTVL;
};

type StrategyTVLListItem = {
    vault: string;
    network: string;
    strategy: string;
    name: string;
    activation: number;
    activationStr: string;
    estimatedTotalAssetsUsdcNumber: number;
    totalTvlPercentage: number;
    debtOutstandingUsdcNumber: number;
    dustUsdcNumber: number;
    tvlImpact: number;
};

export const StrategyProtocolList = (props: StrategyProtocolListProps) => {
    const { network = DEFAULT_NETWORK } = useParams() as ParamTypes;

    const classes = useStyles();
    const strategies: StrategyTVLListItem[] = props.item.strategies.map(
        (strategyTVL) => {
            const assetsInMMs = amountToMMs(
                strategyTVL.estimatedTotalAssetsUsdc
            );
            const debtInMMs = amountToMMs(strategyTVL.debtOutstandingUsdc);
            const dustInMMs = amountToMMs(strategyTVL.dustUsdc);
            return {
                vault: strategyTVL.vault,
                network,
                strategy: strategyTVL.address,
                name: strategyTVL.name,
                activation: Date.parse(strategyTVL.params.activation),
                activationStr: strategyTVL.params.activation,
                estimatedTotalAssetsUsdcNumber: assetsInMMs,
                totalTvlPercentage:
                    strategyTVL.estimatedTotalAssetsUsdc.isZero()
                        ? strategyTVL.estimatedTotalAssetsUsdc.toNumber()
                        : strategyTVL.estimatedTotalAssetsUsdc
                              .times(100)
                              .div(props.item.tvl)
                              .toNumber(),
                debtOutstandingUsdcNumber: debtInMMs,
                dustUsdcNumber: dustInMMs,
                tvlImpact: getTvlImpact(assetsInMMs),
            };
        }
    );

    /**
     * Returns true based on the following formula
     * totalAssets > 2 * totalDebt && totalAssets > Dust
     * @param item
     */
    const hasHealthyAssetsToDebtRatio = async (item: StrategyTVLListItem) => {
        return (
            item.estimatedTotalAssetsUsdcNumber >
                HEALTHY_DEBT_MULTIPLIER * item.debtOutstandingUsdcNumber &&
            item.estimatedTotalAssetsUsdcNumber > item.dustUsdcNumber
        );
    };

    const getRowStyle = (_index: number, item: StrategyTVLListItem) => {
        if (!hasHealthyAssetsToDebtRatio(item)) {
            return {
                borderColor: 'red',
                borderStyle: 'groove',
            };
        }
    };

    return (
        <div className={classes.root}>
            <GenericList
                headCells={headCells}
                items={strategies}
                title={`${props.item.name.toUpperCase()} - ${
                    strategies.length
                } Strategies`}
                defaultOrder="desc"
                defaultOrderBy="estimatedTotalAssetsUsdcNumber"
                defaultRowsPerPage={20}
                getRowStyle={getRowStyle}
            />
        </div>
    );
};
