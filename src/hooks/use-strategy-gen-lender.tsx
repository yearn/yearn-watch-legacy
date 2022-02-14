import { useEffect, useState } from 'react';
import { GenLenderStrategy, Network } from '../types';
import { getError } from '../utils/error';
import { getGenLenderStrategy } from '../utils/strategies';

export function useStrategyGenLender(
    network: Network,
    strategyAddress: string
) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<GenLenderStrategy | undefined>();

    useEffect(() => {
        const fetchGenLenderData = async () => {
            try {
                const loadedGenLenderData = await getGenLenderStrategy(
                    strategyAddress,
                    network
                );
                setData(loadedGenLenderData);
                setLoading(false);
            } catch (e) {
                setError(getError(e));
                setData(undefined);
            } finally {
                setLoading(false);
            }
        };
        fetchGenLenderData();
    }, [network, strategyAddress]);

    return {
        data,
        loading,
        error,
    };
}
