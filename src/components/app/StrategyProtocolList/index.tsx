/* eslint-disable react/display-name */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { ProtocolTVL } from '../../../types/protocol-tvl';
import { amountToMMs, extractAddress } from '../../../utils/commonUtils';
import { getTvlImpact } from '../../../utils/risk';
import { GenericList, GenericListItem } from '../GenericList';
import { HeadCell } from '../GenericList/HeadCell';

const headCells: HeadCell[] = [
    {
        numeric: false,
        disablePadding: false,
        align: 'center',
        label: 'Strategy Name',
        format: (item: GenericListItem, _value: string | number | boolean) => {
            return (
                <Link
                    color="inherit"
                    to={`/vault/${item.vault}/strategy/${item.strategy}`}
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
        format: (item: GenericListItem, _value: string | number | boolean) => {
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

export const StrategyProtocolList = (props: StrategyProtocolListProps) => {
    const classes = useStyles();
    const strategies = props.item.strategies.map((strategyTVL) => {
        const amountInMMs = amountToMMs(strategyTVL.estimatedTotalAssetsUsdc);
        return {
            vault: strategyTVL.vault,
            strategy: strategyTVL.address,
            name: strategyTVL.name,
            activation: Date.parse(strategyTVL.params.activation),
            activationStr: strategyTVL.params.activation,
            estimatedTotalAssetsUsdcNumber: amountInMMs,
            totalTvlPercentage: strategyTVL.estimatedTotalAssetsUsdc.isZero()
                ? strategyTVL.estimatedTotalAssetsUsdc.toNumber()
                : strategyTVL.estimatedTotalAssetsUsdc
                      .times(100)
                      .div(props.item.tvl)
                      .toNumber(),
            tvlImpact: getTvlImpact(amountInMMs),
        };
    });

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
            />
        </div>
    );
};
