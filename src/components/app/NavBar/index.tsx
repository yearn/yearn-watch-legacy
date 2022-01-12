import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import styled from 'styled-components';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import logoYearnLight from '../../../images/logo_yearn_watch_light.svg';
import logoYearnDark from '../../../images/logo_yearn_watch_dark.svg';
import Link from '@material-ui/core/Link';
import NetworkSelect from '../../common/NetworkSelect';
import { Network } from '../../../types';

const StyledAppBar = styled(AppBar)`
    background-color: transparent !important;
`;

const StyleNetworkSelect = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.8rem;
    width: 9rem;
`;

const StyledImg = styled.img`
    height: 68px;
    @media (max-width: 768px) {
        height: 40px;
    }
`;
const StyledBrightness2Icon = styled(Brightness2Icon)`
    color: ${({ theme }) => theme.iconTheme};
`;

interface NavBarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    themeToggler: any;

    theme: string | boolean | (() => void);
}
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },

    img: {
        flexGrow: 1,
        textAlign: 'center',

        [theme.breakpoints.up('md')]: {
            marginLeft: '15%',
        },
    },
}));
export const NavBar: React.FC<NavBarProps> = ({ themeToggler, theme }) => {
    const [currentNetwork, setCurrentNetwork] = React.useState<Network>(
        Network.mainnet
    );
    const { pathname } = useLocation();

    useEffect(() => {
        Object.values(Network).map((network) => {
            if (pathname.includes(network)) setCurrentNetwork(network);
        });
    }, [pathname]);

    const classes = useStyles();
    return (
        <Container className={classes.root}>
            <StyledAppBar position="static" elevation={0}>
                <Toolbar>
                    <div className={classes.img}>
                        <Link href="/">
                            <StyledImg
                                alt="yearn watch"
                                src={
                                    theme === 'light'
                                        ? logoYearnLight
                                        : logoYearnDark
                                }
                            />
                        </Link>
                    </div>
                    <StyleNetworkSelect>
                        <NetworkSelect
                            theme={theme}
                            currentNetwork={currentNetwork}
                        />
                    </StyleNetworkSelect>
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
                </Toolbar>
            </StyledAppBar>
        </Container>
    );
};
