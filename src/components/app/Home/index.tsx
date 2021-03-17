import React, {useEffect, useState} from 'react';
import Container from '@material-ui/core/Container';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { getVaults } from "../../../utils/vaults"
// import Accordion from '../../common/Accordion';
import { VaultsList } from '../VaultsList';




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


export const Home = () => {
      const classes = useStyles();
   const [data, setData] = useState([]);
useEffect(() => {
    // GET request using axios inside useEffect React hook
    getVaults().then(vaults => {
        if (vaults.length > 0) {
            setData(vaults as any) 
             
        }
     
    });
    
    

}, []);
    console.log("data", data)
    return (
        <div>
            {data.length > 0 && (
                <React.Fragment>
                    {data.map((vault: any, index: number) => (
                        <Container
                            maxWidth="lg"
                            // className={classes.rootContainer}
                        ><VaultsList vault={vault} key={index} />
                          
                        </Container>
                       
                    ))}
                </React.Fragment>
            )
            }
        </div>
    );
};
