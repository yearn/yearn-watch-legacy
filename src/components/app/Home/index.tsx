import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Container } from '@material-ui/core';

import { getService } from '../../../services/VaultService';
import { sortVaultsByVersion } from '../../../utils/vaults';

import { ErrorAlert } from '../../common/Alerts';

import { VaultsList } from '../../common/VaultsList';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import {
    Vault,
    DEFAULT_QUERY_PARAM,
    toQueryParam,
    DEFAULT_NETWORK,
} from '../../../types';
import { getError } from '../../../utils/error';
import { GlobalStylesLoading } from '../../theme/globalStyles';
import { ParamTypes } from '../../../types/DefaultParamTypes';

const BATCH_NUMBER = 30;

export const Home = () => {
    const { network = DEFAULT_NETWORK } = useParams<ParamTypes>();
    const [total, setTotal] = useState<number>(0);
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadVaultData = async () => {
            setIsLoading(true);

            setError(null);
            try {
                const vaultService = getService(network);
                const numVaults = await vaultService.getTotalVaults();
                setTotal(numVaults);
                const loadedVaults = await vaultService.getVaultsWithPagination(
                    DEFAULT_QUERY_PARAM
                );
                if (loadedVaults.length > 0) {
                    setVaults([...sortVaultsByVersion(loadedVaults)]);
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
                            const batchedVaultsPromise = vaultService.getVaultsWithPagination(
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
                    const sortedResults = sortVaultsByVersion(results);
                    setVaults((vaults) => [...vaults, ...sortedResults]);
                }
            } catch (e: unknown) {
                console.log('Error:', e);
                setIsLoading(false);
                setError(getError(e));
            }
        };
        loadVaultData();
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
                    <VaultsList
                        items={vaults}
                        totalItems={total}
                        network={network}
                    />
                )}
            </div>
        </Container>
    );
};
