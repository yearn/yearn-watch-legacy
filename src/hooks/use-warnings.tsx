import { useEffect, useState } from 'react';
import { getService as getVaultService } from '../services/VaultService';
import { Network, Strategy, Vault } from '../types';
import { getWarnings, getError } from '../utils';

export function useWarnings(strategies: (Strategy|undefined)[]) {
    const [warnings, setWarnings] = useState<string[] | undefined>();
    useEffect(() => {
        if (strategies.length > 0) {
            setWarnings(getWarnings(
                // strategies.filter((strategy) => strategy != undefined)
                []
            ))
        } else {
            setWarnings(undefined)
        }
    }, [strategies]);
    return {
        warnings,
    };
}
