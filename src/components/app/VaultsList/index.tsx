import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
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
import Divider from '@material-ui/core/Divider';
import { Vault } from '../../../types';


type VaultsListProps = {
  vault: Vault;
  key: number;
}

export const VaultsList = (props: VaultsListProps) => {
  const { vault, key } = props;
  console.log("vault", vault);
  const config = vault.configOK


  const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: "5px",    
      borderRadius: "5px",
    },
    link: {
      color: "#fff"
    },
    expandIcon: {
      color: "#fff"
    },
    list: {
      padding: 0
    },
    alert: {
      background: "transparent",
      color: "red",
      fontWeight: 400,
     
    },
    address: {
      fontSize: "14px",
      opacity: "0.6" 
    },
    iconCall: {
      backgroundColor: "white",
      borderRadius: 3, padding: 2 
    },
    divider: {
      background: "#fff",
      opacity: "0.3",
      marginLeft: "10px",
      marginRight:"10px"
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
      <div className={ classes.root}>
        <MuiAccordion className={classes.accordion} >
          <AccordionSummary
          expandIcon={<ExpandMoreIcon className={classes.expandIcon}/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
          >       
              <List className={classes.list}>
              {!config ? <MuiAlert severity="error" variant="filled" className={classes.alert} > {vault.configErrors && vault.configErrors?.length > 0 ? vault.configErrors[0]: ""}</MuiAlert>: null}
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={vault.icon} src={vault.icon}  />
                  </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" gutterBottom><a className={classes.link} href={`/vault/${vault.address}`}>{vault.name}</a>
                  &nbsp;&nbsp;<span className={classes.address} >{maskedAddress}</span>
                    <Tooltip title="View on Etherscan" aria-label="Etherscan">
                      <Button href={`https://etherscan.io/address/${vault.address}`} target="_blank">
                        <CallMadeIcon fontSize="inherit" className={classes.iconCall} />
                      </Button>
                      </Tooltip>
                </Typography>}

              />
             
            </ListItem>
            
              </List>
        </AccordionSummary>
        <Divider className={classes.divider}/>
        <AccordionDetails>
         
          <Container>
              <Typography>
              {vault.strategies.map((str: any, index: any) => (
                <List key={index}>
                    <ListItem>
                 {str.name}
              <ListItemText
                primary={
                  <Typography variant="subtitle1" gutterBottom>
                    <Tooltip title="View on Etherscan" aria-label="Etherscan">
                      <Button href={`https://etherscan.io/address/${str.address}`} target="_blank">
                        <CallMadeIcon fontSize="inherit" className={classes.iconCall} />
                      </Button>
                      </Tooltip>
                </Typography>}

              />
             
            </ListItem>
             
              </List>
              ))}
            </Typography>
            </Container>
          </AccordionDetails>
        </MuiAccordion>

      </div>
  );
}
