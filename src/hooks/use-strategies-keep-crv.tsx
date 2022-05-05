import { useEffect, useState } from 'react';
import { getKeepCRVStrategyTVLsPerProtocol } from '../utils';
import { getError } from '../utils/error';
import { GenericListItem } from '../components/app';
import { getVaultService } from '../services/VaultService/utils';
import { DEFAULT_BATCH_SIZE, Network, toQueryParam } from '../types';
import { filterStrategiesByKeepCSV } from '../utils/vaults';

export function useStrategiesKeepCRV(network: Network) {
    const [loading, setLoading] = useState<boolean>(true);
    const [moreToLoad, setMoreToLoad] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<GenericListItem[]>([]);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                setLoading(true);
                const vaultService = getVaultService(network);
                const numVaults = await vaultService.getNumVaults();

                let firstBatch = true;
                let offset = 0;
                let vaultsFetched = 0;
                let allStrategies: GenericListItem[] = [];

                const FilteredByKeepCRV =
                    await getKeepCRVStrategyTVLsPerProtocol(network as Network);
                while (vaultsFetched < numVaults) {
                    const vaults = await vaultService.getVaults(
                        [],
                        toQueryParam(offset, DEFAULT_BATCH_SIZE)
                    );
                    offset += DEFAULT_BATCH_SIZE;
                    vaultsFetched += vaults.length;
                    const strategies = await filterStrategiesByKeepCSV(
                        vaults,
                        network,
                        FilteredByKeepCRV
                    );
                    allStrategies = [...allStrategies, ...strategies];
                    setData(allStrategies);
                    if (firstBatch) {
                        setLoading(false);
                        firstBatch = false;
                    }
                }
            } catch (e) {
                setError(getError(e));
                setData([]);
            } finally {
                setLoading(false);
                setMoreToLoad(false);
            }
        };
        fetchVault();
    }, [network]);

    return {
        data,
        loading,
        moreToLoad,
        error,
    };
}
