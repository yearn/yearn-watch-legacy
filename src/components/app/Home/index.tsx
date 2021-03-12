import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';

import { BuildGet } from "../../../utils/apisRequest"


interface HomeProps {
    
  
}


export const Home = () => {
   const [data, setData] = useState([]);
useEffect(() => {
    // GET request using axios inside useEffect React hook
  const fetchData = BuildGet("/all")
    console.log("fetchData", fetchData)

    //   setData(fetchData)

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
