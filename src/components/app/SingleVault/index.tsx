import React, { useEffect, useState } from 'react';
import { getVault } from "../../../utils/vaults"
import { useParams } from "react-router-dom";
import Container from '@material-ui/core/Container';


export const SingleVault = () => {
    interface ParamTypes {
  id: string
    }

const { id } = useParams<ParamTypes>()
  
  const [data, setData] = useState([]);
useEffect(() => {
  getVault(id).then(vault => {
        setData(vault )  
    });
    
}, []);
  

console.log("data",data)
    return (
     <Container maxWidth="sm" style={{background: "blue"}}>
     {data.address}
     
    
    
      </Container>
    );
};
