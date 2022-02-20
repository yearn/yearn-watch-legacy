import { useEffect, useState } from 'react';
import { getVaultService } from '../services/VaultService/utils';
import { Network, toQueryParam, Vault, DEFAULT_BATCH_SIZE } from '../types';
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
    const [moreToLoad, setMoreToLoad] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [vaults, setVaults] = useState<Vault[]>([]);

    useEffect(() => {
        const fetchVault = async () => {
            try {
                setLoading(true);
                const vaultService = getVaultService(network);
                const numVaults = await vaultService.getNumVaults();

                let firstBatch = true;
                let offset = 0;
                let allVaults: Vault[] = [];
                while (allVaults.length < numVaults) {
                    const newVaults = await vaultService.getVaults(
                        [],
                        toQueryParam(offset, DEFAULT_BATCH_SIZE)
                    );
                    offset += DEFAULT_BATCH_SIZE;
                    allVaults = [...allVaults, ...newVaults];
                    setVaults(allVaults);
                    if (firstBatch) {
                        setLoading(false);
                        firstBatch = false;
                    }
                }
            } catch (e) {
                setError(getError(e));
                setVaults([]);
            } finally {
                setLoading(false);
                setMoreToLoad(false);
            }
        };
        fetchVault();
    }, [network]);

    return {
        vaults,
        loading,
        moreToLoad,
        error,
    };
}
