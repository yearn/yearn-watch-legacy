import { useEffect, useState } from 'react';
import { Network } from '../types';
import { getService as getVaultService } from '../services/VaultService';
import { getError } from '../utils/error';
import { StrategyMetadata } from '@yfi/sdk';

export function useVaultStrategyMetadata(
    network: Network,
    vaultAddress: string
) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<StrategyMetadata[] | undefined>();

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                setLoading(true);
                const vaultService = getVaultService(network);
                const metadata = await vaultService.getVaultStrategyMetadata(
                    vaultAddress
                );
                setData(metadata);
            } catch (e) {
                setError(getError(e));
                setData(undefined);
            } finally {
                setLoading(false);
            }
        };
        fetchMetadata();
    }, [network, vaultAddress]);

    return {
        data,
        loading,
        error,
    };
}

export function useSingleStrategyMetadata(
    network: Network,
    vaultAddress: string,
    strategyAddress: string
) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<StrategyMetadata | undefined>();

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                setLoading(true);
                const vaultService = getVaultService(network);
                const metadata = await vaultService.getVaultStrategyMetadata(
                    vaultAddress
                );
                const strategyMetadata = metadata.find(
                    (s) => s.address === strategyAddress
                );
                setData(strategyMetadata);
            } catch (e) {
                setError(getError(e));
                setData(undefined);
            } finally {
                setLoading(false);
            }
        };
        fetchMetadata();
    }, [network, vaultAddress, strategyAddress]);

    return {
        data,
        loading,
        error,
    };
}
