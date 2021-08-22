import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import ImageYH from '../../../images/yearn_watch.svg';
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            textAlign: 'center',
        },
    })
);

const StyledAppBar = styled(AppBar)`
    background: transparent;
    box-shadow: none;
`;
const StyledImg = styled.img`
    height: 64px;
`;
const StyledBrightness2Icon = styled(Brightness2Icon)`
    color: ${({ theme }) => theme.iconTheme};
`;
interface NavBarProps {
    themeToggler: any;

    theme: string | boolean | (() => void);
}

// (event: React.MouseEvent<HTMLButtonElement>) => void
export const NavBar: React.FC<NavBarProps> = ({ themeToggler, theme }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <StyledAppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <StyledImg alt="yearn watch" src={ImageYH} />
                    </Typography>

                    <div>
                        <IconButton
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={themeToggler}
                            color="inherit"
                        >
                            {theme === 'light' ? (
                                <StyledBrightness2Icon />
                            ) : (
                                <Brightness4Icon />
                            )}
                        </IconButton>
                    </div>
                </Toolbar>
            </StyledAppBar>
        </div>
    );
};
