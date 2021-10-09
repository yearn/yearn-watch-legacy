import { useEffect, useState } from 'react';

import {
    getVaultsWithPagination,
    getTotalVaults,
    sortVaultsByVersion,
} from '../../../utils/vaults';

import { ErrorAlert } from '../../common/Alerts';

import { VaultsList } from '../../common/VaultsList';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { Vault } from '../../../types';
import {
    DEFAULT_QUERY_PARAM,
    toQueryParam,
} from '../../../utils/types/QueryParam';

import { GlobalStylesLoading } from '../../theme/globalStyles';
import { Container } from '@material-ui/core';
import { ExperimentalVault } from '../../common/SearchInput/ExperimentalVault';

const BATCH_NUMBER = 30;

export const Home = () => {
    const [total, setTotal] = useState<number>(0);
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadVaultData = async () => {
            setIsLoading(true);

            setError(null);
            try {
                const numVaults = await getTotalVaults();
                setTotal(numVaults);
                const loadedVaults = await getVaultsWithPagination(
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
                            const batchedVaultsPromise = getVaultsWithPagination(
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
            } catch (error) {
                console.log('Error:', error);
                setIsLoading(false);
                setError(error);
            }
        };
        loadVaultData();
    }, []);

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
                    <VaultsList items={vaults} totalItems={total} />
                )}
            </div>
            <ExperimentalVault></ExperimentalVault>
        </Container>
    );
};
