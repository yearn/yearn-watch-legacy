import { useEffect, useState } from 'react';
import { Strategy } from '../types';
import { getWarnings } from '../utils';

export function useWarnings(strategies: (Strategy | undefined)[]) {
    const [warnings, setWarnings] = useState<string[] | undefined>();
    useEffect(() => {
        if (strategies.length > 0) {
            setWarnings(
                getWarnings(
                    // strategies.filter((strategy) => strategy != undefined)
                    []
                )
            );
        } else {
            setWarnings(undefined);
        }
    }, [strategies]);
    return {
        warnings,
    };
}
