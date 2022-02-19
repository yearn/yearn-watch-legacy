import { useEffect, useState } from 'react';
import { getVaultService } from '../services/VaultService/utils';
import { Network, Vault } from '../types';
import { getWarnings } from '../utils';
import { getError } from '../utils/error';

export function useVault(network: Network, address: string) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Vault | undefined>();
    const [warnings, setWarnings] = useState<string[] | null>(null);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                setLoading(true);
                const vaultService = getVaultService(network);
                const loadedVault = await vaultService.getVault(address);
                setData(loadedVault);
                const warnings = getWarnings(loadedVault.strategies);
                if (warnings.length > 0) {
                    setWarnings(warnings);
                }
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
        warnings,
    };
}

export function useAllVaults(network: Network) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Vault[]>([]);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                setLoading(true);
                const vaultService = getVaultService(network);
                const vaults = await vaultService.getVaults();
                setData(vaults);
            } catch (e) {
                setError(getError(e));
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVault();
    }, [network]);

    const fetchNext = () => null;

    return {
        data,
        loading,
        error,
        fetchNext,
    };
}
