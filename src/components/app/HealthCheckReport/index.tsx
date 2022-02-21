/* eslint-disable react/display-name */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { Container } from '@mui/material';
import { Link } from 'react-router-dom';

import { getService } from '../../../services/VaultService';

import { ErrorAlert } from '../../common/Alerts';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { GlobalStylesLoading } from '../../theme/globalStyles';

import {
    Vault,
    DEFAULT_QUERY_PARAM,
    toQueryParam,
    DEFAULT_NETWORK,
} from '../../../types';
import { ParamTypes } from '../../../types/DefaultParamTypes';
import { extractAddress } from '../../../utils/commonUtils';
import { GenericList, GenericListItem } from '../GenericList';
import { HeadCell } from '../GenericList/HeadCell';

import { getError } from '../../../utils/error';
import { filterStrategiesByHealthCheck } from '../../../utils/vaults';

const BATCH_NUMBER = 30;

const headCells: HeadCell<GenericListItem>[] = [
    {
        numeric: false,
        disablePadding: false,
        align: 'center',
        label: 'Strategy Name',
        format: (item: GenericListItem) => {
            return (
                <Link
                    color="inherit"
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

export const HealthCheckReport = () => {
    const paramTypes = useParams<ParamTypes>();
    const { network = DEFAULT_NETWORK } = paramTypes;
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [strategies, setStrategies] = useState<any[]>([]);

    useEffect(() => {
        const loadStrategiesData = async () => {
            setIsLoading(true);

            setError(null);
            try {
                const vaultService = getService(network);
                const numVaults = await vaultService.getTotalVaults();
                const loadedVaults = await vaultService.getVaultsWithPagination(
                    DEFAULT_QUERY_PARAM
                );
                const filteredStrategies = await filterStrategiesByHealthCheck(
                    loadedVaults,
                    network
                );
                if (loadedVaults.length > 0) {
                    setStrategies([...filteredStrategies]);
                    setIsLoading(false);
                }
                // iterations for lazy loading
                if (numVaults > BATCH_NUMBER) {
                    const iterations = Math.floor(
                        (numVaults - BATCH_NUMBER) / BATCH_NUMBER
                    );
                    let offset = BATCH_NUMBER;
                    const batchResultsPromises: Promise<Vault[]>[] = [];
                    for (let i = 0; i <= iterations; i++) {
                        ((innerOffset: number) => {
                            const batchedVaultsPromise =
                                vaultService.getVaultsWithPagination(
                                    toQueryParam(innerOffset, BATCH_NUMBER)
                                );
                            batchResultsPromises.push(batchedVaultsPromise);
                        })(offset);

                        offset = offset + BATCH_NUMBER;
                    }

                    const responses = await Promise.all(batchResultsPromises);
                    const results: Vault[] = responses.flatMap(
                        (response) => response
                    );
                    const filteredResults = await filterStrategiesByHealthCheck(
                        results,
                        network
                    );
                    setStrategies((strategies) => [
                        ...strategies,
                        ...filteredResults,
                    ]);
                }
            } catch (e: unknown) {
                console.log('Error:', e);
                setIsLoading(false);
                setError(getError(e));
            }
        };
        loadStrategiesData();
    }, [network]);

    return (
        <Container maxWidth="lg">
            <div style={{ marginTop: 20 }}>
                {error && (
                    <ErrorAlert
                        message={'Error while loading vaults:'}
                        details={error}
                    />
                )}

                {isLoading && (
                    <span>
                        <ProgressSpinnerBar />

                        <GlobalStylesLoading />
                    </span>
                )}
                {!isLoading && !error && (
                    <div className={classes.root}>
                        <GenericList
                            headCells={headCells}
                            items={strategies}
                            title={'Strategies with HealthCheck issue'}
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
