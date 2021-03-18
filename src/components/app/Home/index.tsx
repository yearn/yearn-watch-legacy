import React, {useEffect, useState} from 'react';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getVaults } from "../../../utils/vaults"
import { VaultsList } from '../VaultsList';
import { Vault } from '../../../types';
import { Typography } from '@material-ui/core';


export const Home = () => {
    const [vaults, setVaults] = useState<Vault[]>([]);
   const [isLoaded, setIsLoaded] = useState(true);
useEffect(() => {
    getVaults().then(loadedVaults => {
        if (loadedVaults.length > 0) {
            setVaults(loadedVaults);  
            setIsLoaded(false)
        }   
    });
    
}, []);
    return (
        <div>
            {isLoaded ? <div style={{ textAlign: "center", marginTop: "100px" }}>
                <CircularProgress style={{ color: "#fff" }} />
                <Typography style={{ color: "#fff" }}>Loading vaults..</Typography></div> : vaults.length > 0 && (
                <React.Fragment>
                    {vaults.map((vault: Vault, index: number) => (
                        <Container
                            maxWidth="lg"
                        ><VaultsList vault={vault} key={index} />
                        </Container>
                       
                    ))}
                </React.Fragment>
            )
            }
        </div>
    );
};
