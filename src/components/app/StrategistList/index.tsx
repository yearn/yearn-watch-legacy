import React, {useEffect, useState} from 'react';
import Container from '@material-ui/core/Container';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';






const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    rootContainer: {
    [theme.breakpoints.down('sm')]: {
     '& .MuiContainer-maxWidthLg' : {
             maxWidth: "lg"
        }, 
    },
    [theme.breakpoints.up('md')]: {
     '& .MuiContainer-maxWidthLg' : {
             maxWidth: "md"
        }, 
    },
    [theme.breakpoints.up('lg')]: {
      '& .MuiContainer-maxWidthLg' : {
             maxWidth: "xs"
        }, 
    },
     

    },
  
  }),
);


export const StrategistList= () => {
  

  
    return (
        <div>
        StrategistList
        </div>
    );
};
