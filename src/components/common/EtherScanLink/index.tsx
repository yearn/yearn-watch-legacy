import React, { MouseEvent, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { toChecksumAddress } from 'ethereum-checksum-address';

import Hidden from '@mui/material/Hidden';
import CallMadeIcon from '@mui/icons-material/CallMade';
import Tooltip from '@mui/material/Tooltip';
import { FileCopy } from '@mui/icons-material';
import { Link, Grid } from '@mui/material';

import { extractAddress } from '../../../utils/commonUtils';
import getNetworkConfig from '../../../utils/config';
import { Network } from '../../../types';
import { getEthersDefaultProvider } from '../../../utils/ethers';

type EtherScanLinkProps = {
    address?: string;
    transactionHash?: string;
    dark?: boolean | false;
    internalHref?: string;
    network: Network;
};

const StyledFileCopy = styled(FileCopy)`
    && {
        color: ${({ theme }) => theme.text} !important;
    }
`;

const StyledCallMadeIcon = styled(CallMadeIcon)`
    && {
        color: ${({ theme }) => theme.text} !important;
    }
`;

const StyledLink = styled.a`
    && {
        padding: 0;
        padding-left: 16px;
        cursor: pointer;

        :hover {
            filter: brightness(80%);
        }
    }
`;

const StyledAddress = styled.span`
    && {
        color: ${({ theme }) => theme.subtitle} !important;

        text-decoration: none;
        font-weight: 400;
        font-size: 16px;
        font-style: normal;
    }
`;

const StyledCopiedText = styled.span`
    && {
        color: ${({ theme }) => theme.subtitle} !important;
    }
`;

const EtherScanLink = (props: EtherScanLinkProps) => {
    const { address, transactionHash, internalHref, network } = props;
    const [copied, setCopied] = useState(false);
    const [value, setValue] = useState('');
    const [extractedValue, setExtractedValue] = useState('');
    const [hashValue, setHashValue] = useState('');
<<<<<<< HEAD
    const [resolved, setResolved] = useState(false);
=======
>>>>>>> feat: add ENS resolver
    const networkConfig = getNetworkConfig(network);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setCopied(false);
        }, 1000);

        return () => clearTimeout(timeId);
    }, [copied]);

    useEffect(() => {
        if (address) {
            // check if ENS
            if (address.includes('.')) {
                setValue(address);
                setExtractedValue(address);
                const provider = getEthersDefaultProvider(network);
<<<<<<< HEAD
                provider
                    .resolveName(address)
                    .then((res) => {
                        setHashValue(res || '');
                        setResolved(true);
                    })
                    .catch(() => setResolved(false));
            } else {
                // try to get the checksum address
                try {
                    const checksumAddress = toChecksumAddress(address);
                    setValue(checksumAddress);
                    setExtractedValue(extractAddress(address));
                    setHashValue(checksumAddress);
                    setResolved(true);
                } catch {
                    setValue(address);
                    setExtractedValue(address);
                    setResolved(false);
                }
=======
                provider.resolveName(address).then((res) => {
                    setHashValue(res || '');
                });
            } else {
                const checksumAddress = toChecksumAddress(address);
                setValue(checksumAddress);
                setExtractedValue(extractAddress(address));
                setHashValue(checksumAddress);
>>>>>>> feat: add ENS resolver
            }
        }
        if (transactionHash) {
            setValue(transactionHash);
            setExtractedValue(extractAddress(transactionHash));
            setHashValue(transactionHash);
<<<<<<< HEAD
            setResolved(true);
=======
>>>>>>> feat: add ENS resolver
        }
    }, []);

    const maskedValue = (
        <Tooltip title={value} aria-label="Etherscan">
            <span>{extractedValue}</span>
        </Tooltip>
    );
    const onCopyToClipboard = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
    };
    const refLink = transactionHash
        ? networkConfig.toTxExplorerUrl(hashValue)
        : networkConfig.toAddressExplorerUrl(hashValue);
<<<<<<< HEAD

    if (!resolved) {
        return <>{value}</>;
    } else {
        return (
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <StyledAddress>
                        {internalHref ? (
                            <Link
                                component={RouterLink}
                                color="inherit"
                                to={internalHref}
                            >
                                <Hidden smUp>{maskedValue}</Hidden>
                                <Hidden smDown>{value}</Hidden>
                            </Link>
                        ) : (
                            <>
                                <Hidden smUp>{maskedValue}</Hidden>
                                <Hidden smDown>{value}</Hidden>
                            </>
                        )}
                    </StyledAddress>
                    <Tooltip title="Copy to clipboard" aria-label="Clipboard">
                        <StyledLink onClick={(e) => onCopyToClipboard(e)}>
                            <StyledCopiedText>
                                <StyledFileCopy fontSize="inherit" />
                                {copied ? ' Copied' : ''}
                            </StyledCopiedText>
                        </StyledLink>
                    </Tooltip>
                    <Tooltip title="View on Explorer" aria-label="Explorer">
                        <StyledLink href={refLink} target="_blank">
                            <StyledCallMadeIcon fontSize="inherit" />
                        </StyledLink>
                    </Tooltip>
                </Grid>
=======
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item>
                <StyledAddress>
                    {internalHref ? (
                        <Link
                            component={RouterLink}
                            color="inherit"
                            to={internalHref}
                        >
                            <Hidden smUp>{maskedValue}</Hidden>
                            <Hidden smDown>{value}</Hidden>
                        </Link>
                    ) : (
                        <>
                            <Hidden smUp>{maskedValue}</Hidden>
                            <Hidden smDown>{value}</Hidden>
                        </>
                    )}
                </StyledAddress>

                <Tooltip title="Copy to clipboard" aria-label="Clipboard">
                    <StyledLink onClick={(e) => onCopyToClipboard(e)}>
                        <StyledCopiedText>
                            <StyledFileCopy fontSize="inherit" />
                            {copied ? ' Copied' : ''}
                        </StyledCopiedText>
                    </StyledLink>
                </Tooltip>
                <Tooltip title="View on Explorer" aria-label="Explorer">
                    <StyledLink href={refLink} target="_blank">
                        <StyledCallMadeIcon fontSize="inherit" />
                    </StyledLink>
                </Tooltip>
>>>>>>> feat: add ENS resolver
            </Grid>
        );
    }
};

export default EtherScanLink;
