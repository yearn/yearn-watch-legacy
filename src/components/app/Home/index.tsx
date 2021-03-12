import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';

import { getVaults } from "../../../utils/vaults"


interface HomeProps {
    
  
}


export const Home = () => {
   const [data, setData] = useState([]);
useEffect(() => {
    // GET request using axios inside useEffect React hook
    getVaults().then(vaults => {
        console.log("vaults", vaults)
    //   setData(fetchData)
    });
    
    

}, []);
    console.log("data", data)
    return (
        <div>
        <Grid>
                {data.map((vault: any) => (
                    <React.Fragment>
                        {vault.endorsed === true && vault.type === "v2" && (
                            <div>
                                {`name: ${vault.name}`}
                                <br />
                                Strategies
                                {vault.strategies.map((strategy: any) => (
                                    <React.Fragment>
                                        {`address: ${strategy.address}`}
                                        <br />
                                          {`name: ${strategy.name}`}
                                      </React.Fragment>
                                ))}
                                     <br />   <br />
                            </div>
                        ) }
</React.Fragment>
                ))}
              
        </Grid>
        </div>
    );
};
