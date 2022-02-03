import { useEffect, useState } from 'react';
import { Network, StrategyMetaData } from '../types';
import { getService as getVaultService } from '../services/VaultService';
import { getError } from '../utils/error';

export function useStrategyMetaData(
    network: Network,
    vaultAddress: string,
    strategyAddress: string
) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<StrategyMetaData | undefined>();

    useEffect(() => {
        const fetchStrategyMetaData = async () => {
            try {
                setLoading(true);
                const vaultService = getVaultService(network);
                const metaData = await vaultService.getStrategyMetaData(
                    vaultAddress,
                    strategyAddress
                );
                setData(metaData);
            } catch (e) {
                setError(getError(e));
                setData(undefined);
            } finally {
                setLoading(false);
            }
        };
        fetchStrategyMetaData();
    }, [network, vaultAddress, strategyAddress]);

    return {
        data,
        loading,
        error,
    };
}
