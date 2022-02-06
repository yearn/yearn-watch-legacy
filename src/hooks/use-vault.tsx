import { useEffect, useState } from 'react';
import { getService as getVaultService } from '../services/VaultService';
import { Network, Vault } from '../types';
import { getError } from '../utils/error';

export function useVault(network: Network, address: string) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Vault | undefined>();

    useEffect(() => {
        const fetchVault = async () => {
            try {
                setLoading(true);
                const vaultService = getVaultService(network);
                const loadedVault = await vaultService.getVault(address);
                setData(loadedVault);
            } catch (e) {
                setError(getError(e));
                setData(undefined);
            } finally {
                setLoading(false);
            }
        };
        fetchVault();
    }, [network, address]);

    return {
        data,
        loading,
        error,
    };
}
