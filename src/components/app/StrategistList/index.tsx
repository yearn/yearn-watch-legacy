
import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CallMadeIcon from '@material-ui/icons/CallMade';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import {extractAddress, extractText} from "../../../utils/extractAddress"
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: 20,
      background: "transparent",
      padding: 10
      
    },
    address: {
      fontSize: "14px",
      opacity: "0.6",
      color:"#ffff"
    },
    text: {
      color:"#ffff"
    },
    iconCall: {
      backgroundColor: "white",
      borderRadius: 3, padding: 2 
    },
    list: {
      background: "transparent",
      border: "none"
    },
    accordion: {
       background: "transparent",
      border: "none"
    },
     link: {
      color: "#fff"
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

export const StrategistList= (vault: any) => {
  const classes = useStyles();

   
  return (
    <div className={classes.root}>
       <Typography variant="body2" className={classes.text}component="p">
        Strategies
        </Typography>
      { vault.vault.strategies && vault.vault.strategies.map((strategie: any) => (
              <List className={classes.list}  style={{border:"none"}}>
                <ListItem  style={{border:"none"}}>
                
                <ListItemText
                   style={{border:"none"}}
                   
              primary={
                  <div>
                  <Typography variant="subtitle1" gutterBottom><a className={classes.link} href={`/strategy/${strategie.address}`}>
                    
                    <Hidden smUp>
  {strategie.name.length > 20 ? extractText(strategie.name):  strategie.name}
                    </Hidden>
                  
                     <Hidden xsDown>
          {strategie.name}
        </Hidden>
                  
                  </a></Typography>
                  &nbsp;&nbsp;<span className={classes.address} >
                                      <Hidden smUp>
       {extractAddress(strategie.address)}
        </Hidden>
                      <Hidden xsDown>
          {strategie.address}
        </Hidden>
                    </span>
                    <Tooltip title="View on Etherscan" aria-label="Etherscan">
                      <Button href={`https://etherscan.io/address/${strategie.address}`} target="_blank">
                        <CallMadeIcon fontSize="inherit" className={classes.iconCall} />
                      </Button>
                      </Tooltip>
                
                  </div>
                 }

              />
             
            </ListItem>        
              </List>
      
      ))}  
    </div>
  );
}
