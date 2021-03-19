

import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import CardContent from '@material-ui/core/CardContent';

import IconButton from '@material-ui/core/IconButton';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Strategy } from '../../../types'
import { Vault } from '../../../types'
import { useParams } from "react-router-dom";
import { getStrategies } from "../../../utils/strategies"
import { getVault } from "../../../utils/vaults"
import Table from "../../common/Table"
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

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
     crumbs: {
      maxWidth: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: 15,
      color: "#fff"
    
    },
       text: {
      color: "#ffff",
      fontWeight: "bolder"
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


export const SingleStrategy = () => {
  const { id } = useParams<ParamTypes>()
  const classes = useStyles();

  const [strategyData, setStrategyData] = useState<Strategy[] | undefined>();
  const [isLoaded, setIsLoaded] = useState(true);
   const [vault, setVault] = useState<Vault | undefined>();

  

 
  useEffect(() => {
  getStrategies([id]).then(loadedStrategy => {
    setStrategyData(loadedStrategy)  
    setIsLoaded(false)
    { strategyData && getVault(strategyData[0].vault).then(loadedVault => {
    setVault(loadedVault) 
  
    });}
  })
   

  });


 
  

  const strategy= strategyData && strategyData[0]
  return (
    <React.Fragment>
      <Breadcrumbs className={classes.crumbs}>
           <Link color="inherit" href="/" >
       vaults
      </Link>
        <Link color="inherit" href={`/vault/${strategy ? strategy.vault :"" }`} >
       {vault && vault.name}
      </Link>
    
      <Typography className={classes.text} >{strategy ? strategy.name : ""}</Typography>
      </Breadcrumbs>
  { isLoaded ?<div  style={{ textAlign: "center", marginTop: "100px" }}><CircularProgress style={{ color: "#fff" }} /> <Typography style={{ color: "#fff" }}>Loading strategy..</Typography></div>: <Card className={classes.root}>
      <CardHeader
     
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={ strategy ? strategy.name : ""}
        subheader={ strategy ? strategy.address : ""}
      />
     
      <CardContent>
        <Table>
           <TableHead>
    <TableRow>
        <TableCell>API Version: </TableCell>
        <TableCell>{strategy ? strategy.apiVersion : ""}</TableCell>        
      </TableRow>
        <TableRow>
        <TableCell>Emergency exit: </TableCell>
        <TableCell>{strategy ? strategy.emergencyExit : ""}</TableCell>         
      </TableRow>
                <TableRow>
        <TableCell>Active: </TableCell>
        <TableCell>{strategy ? strategy.isActive : ""}</TableCell>         
      </TableRow>
                  <TableRow>
        <TableCell>Keeper: </TableCell>
        <TableCell>{strategy ? strategy.keeper : ""}</TableCell>         
      </TableRow>
                  <TableRow>
        <TableCell>Rewards: </TableCell>
        <TableCell>{strategy ? strategy.rewards : ""}</TableCell>         
      </TableRow>
                  <TableRow>
        <TableCell>Straegist: </TableCell>
        <TableCell>{strategy ? strategy.strategist : ""}</TableCell>         
            </TableRow>
                         <TableRow>
        <TableCell>Vault: </TableCell>
        <TableCell>{strategy ? strategy.vault : ""}</TableCell>         
            </TableRow>
         
       
     
        </TableHead>
     

</Table>
    
       
       
      </CardContent> 
   

      </Card>}
      </React.Fragment>
  );
}
