import React, {useEffect, useState} from 'react';
import Container from '@material-ui/core/Container';
import { getVaults } from "../../../utils/vaults"
import { VaultsList } from '../VaultsList';


export const Home = () => {
const [data, setData] = useState([]);
useEffect(() => {
    // GET request using axios inside useEffect React hook
    getVaults().then(vaults => {
        if (vaults.length > 0) {
            setData(vaults as any)            
        }   
    });
    
}, []);
    return (
        <div>
            {data.length > 0 && (
                <React.Fragment>
                    {data.map((vault: any, index: number) => (
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
