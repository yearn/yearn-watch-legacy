// import React, { useEffect, useState } from 'react';
// import { getVault } from "../../../utils/vaults"
// import { useParams } from "react-router-dom";
// import Container from '@material-ui/core/Container';
// import { Vault } from '../../../types'
//   interface ParamTypes {
//   id: string
//     }


// export const SingleVault = () =>  {
//   const { id } = useParams<ParamTypes>()
  
//   const [vault, setVault] = useState<Vault | undefined>();
// useEffect(() => {
//   getVault(id).then(loadedVault => {
   
//         setVault(loadedVault)  
//     });
    
// });
  


//     return (
//      <Container maxWidth="sm" style={{background: "#006ae3", borderRadius: 5}}>
 
//      { vault ? vault.address : ""}
    
    
//       </Container>
//     );
// };


import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Vault } from '../../../types'
import { useParams } from "react-router-dom";
import { getVault } from "../../../utils/vaults"
import Table from "../../common/Table"
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { StrategistList } from '../StrategistList';
  interface ParamTypes {
  id: string
    }
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
     
      maxWidth: "80%",
    marginLeft: "auto",
      marginRight: "auto",
      // border: "2px solid #ff6c6c",
      // background: "#ff6c6c"
    
    },
    gridContainer: {
      flexGrow: 1,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
   
  }),
);


export const SingleVault = () => {
  const { id } = useParams<ParamTypes>()
  const classes = useStyles();

  const [vault, setVault] = useState<Vault | undefined>();

  

 
  useEffect(() => {
  getVault(id).then(loadedVault => {
   
        setVault(loadedVault)  
    });
    
  });


    const renderErrors = () => (
  vault && vault.configErrors && vault.configErrors.map((message: any) => {
    return <div>{ message}</div>
  })
   )
  
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar src={vault ? vault.icon: ""}aria-label="recipe" />
            
         
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={vault ? vault.name : ""}
        subheader={vault ? vault.address : ""}
      />
     
      <CardContent>
        <Table>
           <TableHead>
    <TableRow>
        <TableCell>API Version: </TableCell>
        <TableCell>{vault ? vault.apiVersion : ""}</TableCell>        
      </TableRow>
        <TableRow>
        <TableCell>Emergency shut down: </TableCell>
        <TableCell>{vault ? vault.emergencyShutdown : ""}</TableCell>         
      </TableRow>
                <TableRow>
        <TableCell>Management: </TableCell>
        <TableCell>{vault ? vault.management : ""}</TableCell>         
      </TableRow>
                  <TableRow>
        <TableCell>Governance: </TableCell>
        <TableCell>{vault ? vault.governance : ""}</TableCell>         
      </TableRow>
                  <TableRow>
        <TableCell>Guardian: </TableCell>
        <TableCell>{vault ? vault.guardian : ""}</TableCell>         
      </TableRow>
                  <TableRow>
        <TableCell>Deposit limit: </TableCell>
        <TableCell>{vault ? vault.depositLimit : ""}</TableCell>         
            </TableRow>
                         <TableRow>
        <TableCell>Management fee: </TableCell>
        <TableCell>{vault ? vault.managementFee : ""}</TableCell>         
            </TableRow>
                         <TableRow>
        <TableCell>Performance fee: </TableCell>
        <TableCell>{vault ? vault.performanceFee : ""}</TableCell>         
            </TableRow>
                         <TableRow>
        <TableCell>Total assets: </TableCell>
        <TableCell>{vault ? vault.totalAssets : ""}</TableCell>         
    </TableRow>
       
       {      vault &&   vault.configOK === false ?          <TableRow>
        <TableCell>Config errors: </TableCell>
        <TableCell>{vault ? renderErrors() : ""}</TableCell>         
    </TableRow> : null}
        </TableHead>
     

</Table>
    
       
       
        {vault &&  vault.strategies.length > 0 ? <StrategistList vault={vault}/>: ""}
      </CardContent>
   

    </Card>
  );
}
