import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import ftmLogoLight from '../../../images/ftm_logo_light.svg';
import ftmLogoDark from '../../../images/ftm_logo_dark.svg';
import ethLogoLight from '../../../images/eth_logo_light.svg';
import ethLogoDark from '../../../images/eth_logo_dark.svg';
import chevronDownLight from '../../../images/chevron_down_light.svg';
import chevronDownDark from '../../../images/chevron_down_dark.svg';

import { Network } from '../../../types';

const StyledOptionList = styled.div<{
    tabIndex: number;
    selectable?: boolean;
}>`
    --dropdown-background: ${({ theme }) => theme.surface};
    --dropdown-color: ${({ theme }) => theme.onSurfaceH2};
    --dropdown-hover-color: ${({ theme }) => theme.secondary};
    --dropdown-selected-color: ${({ theme }) => theme.surface};
    --dropdown-selected-background: ${({ theme }) => theme.onSurfaceH2};

    display: flex;
    justify-content: space-between;
    background: var(--dropdown-background);
    color: var(--dropdown-color);
    fill: currentColor;
    stroke: currentColor;
    user-select: none;
    border-radius: 8px;
    position: relative;
    font-size: 1rem;
    cursor: 'pointer';
    width: 100%;
    height: 100%;
    padding: 0 0.4rem;
    cursor: pointer;
`;

const StyledText = styled.p`
    flex: 1;
    text-align: start;
    padding: 0;
    margin: 0;
    text-transform: capitalize;
    max-width: min-content;
`;

const ChevronDownStyled = styled.div<{ open?: boolean }>`
    & img {
        stroke-width: 1rem;
        height: 100%;
        transition: transform 150ms ease-in-out;
        transform: rotate(${({ open }) => (open ? '180deg' : '0deg')});
    }
`;

const OptionChild = styled.div<{ selected?: boolean; isLabel?: boolean }>`
    display: flex;
    justify-content: ${(props) =>
        props.isLabel ? 'space-between' : 'flex-start'};
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 8px;
    padding: ${(props) => (props.isLabel ? '0.3rem' : '0.3rem 0.6rem')};
    transition: opacity 200ms ease-in-out;
    width: ${(props) => (props.isLabel ? '100%' : 'auto')};
    position: relative;
    ${(props) =>
        props.selected &&
        `
      color: var(--dropdown-selected-color);
      background: var(--dropdown-selected-background);
  `}
    :hover {
        opacity: 0.8;
    }
`;

const StyledIcon = styled.img`
    height: 100%;
    margin-right: 0.7rem;
`;

const StyledChevron = styled.img`
    height: 1rem;
    margin: 0 0.4rem;
`;

const Options = styled.div<{ open?: boolean }>`
    display: ${(props) => (props.open ? 'flex' : 'none')};
    flex-direction: column;
    flex-grow: 1;
    padding: 0.4rem;
    position: absolute;
    background-color: var(--dropdown-background);
    width: 100%;
    left: 0;
    bottom: -0.6rem;
    transform: translateY(100%);
    border-radius: 8px;
    overflow: hidden;
    z-index: 1;
    box-sizing: border-box;
`;

type NetworkSelectProps = {
    currentNetwork: Network;
    theme: string | boolean | (() => void);
};

type NetworkIconProps = {
    network: string;
    isLightTheme?: boolean;
};

const NetworkIcon = ({ network, isLightTheme }: NetworkIconProps) => {
    const icon =
        {
            ['ethereum']: isLightTheme ? ethLogoLight : ethLogoDark,
            ['fantom']: isLightTheme ? ftmLogoLight : ftmLogoDark,
            ['arbitrum']: isLightTheme ? ftmLogoLight : ftmLogoDark,
        }[network] || undefined;

    return <StyledIcon alt={network} src={icon} />;
};

const NetworkSelect = ({ currentNetwork, theme }: NetworkSelectProps) => {
    const [open, setOpen] = React.useState(false);
    const history = useNavigate();

    function handleClick(option: string) {
        history(`/network/${option}`);
    }

    return (
        <StyledOptionList tabIndex={0} onBlur={() => setOpen(false)}>
            <OptionChild onClick={() => setOpen(!open)} isLabel={true}>
                <NetworkIcon
                    isLightTheme={theme === 'light'}
                    network={currentNetwork}
                />
                <StyledText>{currentNetwork}</StyledText>
                <ChevronDownStyled open={open}>
                    <StyledChevron
                        alt="chevron-down"
                        src={
                            theme === 'light'
                                ? chevronDownLight
                                : chevronDownDark
                        }
                    />
                </ChevronDownStyled>
            </OptionChild>
            <Options open={open}>
                {Object.values(Network).map((network) => (
                    <OptionChild
                        key={network}
                        selected={network === currentNetwork}
                        onClick={() => handleClick(network)}
                    >
                        <NetworkIcon
                            network={network}
                            isLightTheme={
                                network === currentNetwork
                                    ? theme !== 'light'
                                    : theme === 'light'
                            }
                        />
                        <StyledText>{network}</StyledText>
                    </OptionChild>
                ))}
            </Options>
        </StyledOptionList>
    );
};

export default NetworkSelect;
