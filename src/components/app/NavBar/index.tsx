import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import logoYearnLight from '../../../images/logo_yearn_watch_light.svg';
import logoYearnDark from '../../../images/logo_yearn_watch_dark.svg';
import Link from '@material-ui/core/Link';

import NetworkSelect from '../../common/NetworkSelect';
import { Network } from '../../../types';

const StyledRoot = styled.div`
    flex-grow: 1;
`;
const StyledMainImage = styled.div`
    flex-grow: 1;
    text-align: center;
`;

const StyledAppBar = styled(AppBar)`
    background-color: transparent !important;
`;

const StyledToolbar = styled(Toolbar)`
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-flow: column;
`;

const StyledSettings = styled.div`
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
    align-items: center;
    justify-content: flex-end;
`;

const StyleNetworkSelect = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.8rem;
    width: 9rem;
`;

const StyledImg = styled.img`
    height: 64px;
`;
const StyledBrightness2Icon = styled(Brightness2Icon)`
    color: ${({ theme }) => theme.iconTheme};
`;

interface NavBarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    themeToggler: any;

    theme: string | boolean | (() => void);
}

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

    return (
        <StyledRoot>
            <StyledAppBar position="static" elevation={0}>
                <StyledToolbar>
                    <div />
                    <StyledMainImage>
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
                    </StyledMainImage>

                    <StyledSettings>
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
                    </StyledSettings>
                </StyledToolbar>
            </StyledAppBar>
        </StyledRoot>
    );
};
