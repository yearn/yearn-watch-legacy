import { useEffect, useState } from 'react';
import { Network, Strategy } from '../types';
import { getError } from '../utils/error';
import { getStrategies } from '../utils/strategies';

export default function useStrategy(
    network: Network,
    vaultAddress: string,
    strategyAddress: string
) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Strategy | undefined>();

    useEffect(() => {
        const fetchStrategy = async () => {
            try {
                setLoading(true);
                const loadedStrategy = await getStrategies(
                    [strategyAddress],
                    network
                );
                setData(loadedStrategy[0]);
            } catch (e) {
                setError(getError(e));
                setData(undefined);
            } finally {
                setLoading(false);
            }
        };
        fetchStrategy();
    }, [network, vaultAddress, strategyAddress]);

    return {
        data,
        loading,
        error,
    };
}
