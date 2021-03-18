import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import MuiAccordion  from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';
import CallMadeIcon from '@material-ui/icons/CallMade';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';





export const VaultsList = (data: any) => {
  console.log("vault", data)
    const vault = data.vault
  const config = vault.configOK


  const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: "5px",    
      borderRadius: "5px",
    },
    
    accordion: {
      background: config ? "#0a1d3f": "#ff6c6c",
      borderRadius: "8px",
      color: "#ffffff",
        '&:hover': {
       background: config ? "#006ae3" : "#ff5c5c",
    },
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);
    
  const classes = useStyles();

  const address1 =  vault.address.substring(0, 6) +
        '...' +
        vault.address.substring(vault.address.length - 4, vault.address.length); 
  const maskedAddress = <Tooltip title={vault.address} aria-label="Etherscan"><span>{address1}</span></Tooltip>


    
  return (
    <div className={ classes.root}  key={data.index} >
      <MuiAccordion className={classes.accordion} >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{color: "#ffff"}}/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >       
          <List style={{padding: 0}}>
           {!config ? <MuiAlert severity="error" variant="filled"> error message</MuiAlert>: null}
    
            <ListItem >
            
              <ListItemAvatar>
                
          <Avatar alt={vault.icon} src={vault.icon}  />
        </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1" gutterBottom><a href={`/vault/${vault.address}`}>{vault.name}</a>
 &nbsp;&nbsp;<span style={{ fontSize: "14px", opacity: "0.6" }} >{maskedAddress}</span> <Tooltip title="View on Etherscan" aria-label="Etherscan"><Button style={{  padding: 0 }} href={`https://etherscan.io/address/${vault.address}`} target="_blank"><CallMadeIcon fontSize="inherit" style={{backgroundColor: "white", borderRadius: 3, padding: 2 }}/></Button></Tooltip></Typography>}
               
              />
      </ListItem>
   
    </List>
          
       
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {vault.strategies.map((str: any) => (
              <div>
                {str.strategist}
             </div>
           ))}
          </Typography>
        </AccordionDetails>
      </MuiAccordion>
   
    </div>
  );
}
