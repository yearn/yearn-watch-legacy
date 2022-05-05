/* eslint-disable react/display-name */
import { useParams } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Container, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

import { ErrorAlert } from '../../common/Alerts';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { GlobalStylesLoading } from '../../theme/globalStyles';

import { DEFAULT_NETWORK } from '../../../types';
import { ParamTypes } from '../../../types/DefaultParamTypes';
import { extractAddress } from '../../../utils/commonUtils';
import { GenericList, GenericListItem } from '../GenericList';
import { HeadCell } from '../GenericList/HeadCell';
import { useStrategiesKeepCRV } from '../../../hooks';

const headCells: HeadCell<GenericListItem>[] = [
    {
        numeric: false,
        disablePadding: false,
        align: 'center',
        label: 'Strategy Name',
        format: (item: GenericListItem) => {
            const theme = useTheme();
            return (
                <Link
                    style={{
                        color:
                            theme.palette.mode === 'light' ? 'blue' : '#ce93d8',
                    }}
                    to={`/network/${item.network}/vault/${item.vault}/strategy/${item.address}`}
                    target="_blank"
                >
                    {`${item.name} (${extractAddress(item.address as string)})`}
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

export const KeepCRVReport = () => {
    const paramTypes = useParams() as ParamTypes;
    const { network = DEFAULT_NETWORK } = paramTypes;
    const {
        data: strategies,
        loading,
        moreToLoad,
        error,
    } = useStrategiesKeepCRV(network);
    const classes = useStyles();
    return (
        <Container maxWidth="lg">
            <div style={{ marginTop: 20 }}>
                {error && (
                    <ErrorAlert
                        message={'Error while loading vaults:'}
                        details={error}
                    />
                )}
                {loading && (
                    <span>
                        <ProgressSpinnerBar />
                        <GlobalStylesLoading />
                    </span>
                )}
                {!loading && !error && (
                    <div className={classes.root}>
                        {moreToLoad && (
                            <ProgressSpinnerBar label="all strategies..." />
                        )}
                        <GenericList
                            headCells={headCells}
                            items={strategies}
                            title={'Strategies with KeepCRV'}
                            defaultOrder="desc"
                            defaultOrderBy="estimatedTotalAssetsUsdcNumber"
                            defaultRowsPerPage={20}
                        />
                    </div>
                )}
            </div>
        </Container>
    );
};
