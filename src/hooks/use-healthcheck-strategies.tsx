import { useEffect, useState } from 'react';
import { GenericListItem } from '../components/app';
import { getVaultService } from '../services/VaultService/utils';
import { Network } from '../types';
import { getError } from '../utils/error';
import { filterStrategiesByHealthCheck } from '../utils/vaults';

export function useHealthcheckStrategies(network: Network) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<GenericListItem[]>([]);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                setLoading(true);
                const vaultService = getVaultService(network);
                const vaults = await vaultService.getVaults();
                const strategies = await filterStrategiesByHealthCheck(
                    vaults,
                    network
                );
                setData(strategies);
            } catch (e) {
                setError(getError(e));
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVault();
    }, [network]);

    return {
        data,
        loading,
        error,
    };
}
