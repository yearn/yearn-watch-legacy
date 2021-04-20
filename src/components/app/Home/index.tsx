import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { getVaults } from '../../../utils/vaults';
import { VaultsList } from '../VaultsList';
import { Vault } from '../../../types';

export const Home = () => {
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [isLoaded, setIsLoaded] = useState(true);
    useEffect(() => {
        getVaults().then((loadedVaults) => {
            if (loadedVaults.length > 0) {
                setVaults(loadedVaults);
                setIsLoaded(false);
            }
        });
    }, []);

    return (
        <div>
            {isLoaded ? (
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
                vaults.length > 0 && (
                    <>
                        {vaults.map((vault: Vault, index: number) => (
                            <Container maxWidth="lg" key={index}>
                                <VaultsList vault={vault} key={index} />
                            </Container>
                        ))}
                    </>
                )
            )}
        </div>
    );
};
