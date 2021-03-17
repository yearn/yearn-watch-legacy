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
              <ListItemText primary={<Typography variant="subtitle1" gutterBottom>{vault.name } &nbsp;&nbsp;<span style={{fontSize: "14px"}} >{vault.address}</span></Typography>}
               
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
