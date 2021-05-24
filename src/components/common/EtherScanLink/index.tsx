import React, { MouseEvent, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { extractAddress } from '../../../utils/commonUtils';
import Hidden from '@material-ui/core/Hidden';
import CallMadeIcon from '@material-ui/icons/CallMade';
import Tooltip from '@material-ui/core/Tooltip';
import { FileCopy } from '@material-ui/icons';

const EtherScanLink = (props: any) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setCopied(false);
        }, 1000);

        return () => clearTimeout(timeId);
    }, [copied]);
    const address = props.address;
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            button: {
                margin: theme.spacing(1),
            },
            iconCall: {
                backgroundColor: '#fff',
                borderRadius: 3,
                padding: 2,
                boxShadow: '0 3px 6px 0 rgba(0,0,0,0.2)',
            },
            address: {
                fontSize: '14px',
                opacity: '0.7',
                color: props.dark ? '#fff' : 'black',
            },
            copiedText: {
                color: props.dark ? '#fff' : 'black',
            },
        })
    );
    const classes = useStyles();

    const address1 = extractAddress(address);
    const maskedAddress = (
        <Tooltip title={address} aria-label="Etherscan">
            <span>{address1}</span>
        </Tooltip>
    );
    const onCopyToClipboard = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(address);
        setCopied(true);
    };

    return (
        <span>
            <span className={classes.address}>
                <Hidden smUp>{maskedAddress}</Hidden>

                <Hidden xsDown>{address}</Hidden>
            </span>
            <Tooltip title="Copy to clipboard" aria-label="Clipboard">
                <Button onClick={(e) => onCopyToClipboard(e)}>
                    <FileCopy fontSize="inherit" className={classes.iconCall} />
                    {copied ? (
                        <span className={classes.copiedText}> Copied</span>
                    ) : (
                        ''
                    )}
                </Button>
            </Tooltip>
            <Tooltip title="View on Etherscan" aria-label="Etherscan">
                <Button
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                >
                    <CallMadeIcon
                        fontSize="inherit"
                        className={classes.iconCall}
                    />
                </Button>
            </Tooltip>
        </span>
    );
};

export default EtherScanLink;
