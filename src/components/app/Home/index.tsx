import React, {useEffect, useState} from 'react';
import Container from '@material-ui/core/Container';
import { getVaults } from "../../../utils/vaults"
import { VaultsList } from '../VaultsList';
import { Vault } from '../../../types';


export const Home = () => {
const [vaults, setVaults] = useState<Vault[]>([]);
useEffect(() => {
    // GET request using axios inside useEffect React hook
    getVaults().then(loadedVaults => {
        if (loadedVaults.length > 0) {
            setVaults(loadedVaults);            
        }   
    });
    
}, []);
    return (
        <div>
            {vaults.length > 0 && (
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
