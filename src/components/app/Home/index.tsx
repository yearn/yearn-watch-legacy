import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { getVaults } from '../../../utils/vaults';
import { VaultsList } from '../../common/VaultsList';
import { ErrorAlert } from '../../common/Alerts';
import { Vault } from '../../../types';

export const Home = () => {
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const loadVaultData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const loadedVaults = await getVaults();
                if (loadedVaults.length > 0) {
                    setVaults(loadedVaults);
                }
                setIsLoading(false);
            } catch (error) {
                console.log('Error:', error);
                setIsLoading(false);
                setError(error);
            }
        };
        loadVaultData();
    }, []);

    return (
        <div>
            {error && (
                <ErrorAlert
                    message={'Error while loading vaults:'}
                    details={error}
                />
            )}

            {isLoading ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '100px',
                    }}
                >
                    <CircularProgress style={{ color: '#fff' }} />
                    <Typography style={{ color: '#fff' }}>
                        Loading vaults..
                    </Typography>
                </div>
            ) : (
                !error && <VaultsList items={vaults} />
            )}
        </div>
    );
};
