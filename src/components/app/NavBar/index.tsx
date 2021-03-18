import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      fontFamily: "open sans",
      FontSize: "16px",
      fontWeight: 400,
      lineHeight: "24px",
      fontColor: "rgb(255, 255, 255)"
    },
  }),
);

export const   NavBar =()=> {
  const classes = useStyles();

  return (
    
      <AppBar position="static" style={{background: "transparent",boxShadow: "none"}}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" href="/">
            <Avatar alt="yearn-image" src="https://raw.githubusercontent.com/yearn/yearn-assets/master/icons/tokens/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo-128.png" />
          </IconButton>
          <Typography variant="h5" className={classes.title}>
          yearn vaults
          </Typography>
          
        </Toolbar>
      </AppBar>
 
  );
}
