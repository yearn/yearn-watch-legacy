import { MouseEvent, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { extractAddress } from '../../../utils/commonUtils';
import Hidden from '@material-ui/core/Hidden';
import CallMadeIcon from '@material-ui/icons/CallMade';
import Tooltip from '@material-ui/core/Tooltip';
import { FileCopy } from '@material-ui/icons';

type EtherScanLinkProps = {
    address?: string;
    transactionHash?: string;
    dark?: boolean | false;
};
const EtherScanLink = (props: EtherScanLinkProps) => {
    const { address, transactionHash, dark } = props;
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setCopied(false);
        }, 1000);

        return () => clearTimeout(timeId);
    }, [copied]);

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
                color: dark ? '#fff' : 'black',
            },
            copiedText: {
                color: dark ? '#fff' : 'black',
            },
        })
    );
    const classes = useStyles();
    if (!address) {
        return <>Not set</>;
    }
    let value = '';
    let extractedValue = '';
    if (address) {
        value = address;
        extractedValue = extractAddress(address);
    }
    if (transactionHash) {
        value = transactionHash;
        extractedValue = extractAddress(transactionHash);
    }

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
        ? `https://etherscan.io/tx/${value}`
        : `https://etherscan.io/address/${value}`;
    return (
        <span>
            <span className={classes.address}>
                <Hidden smUp>{maskedValue}</Hidden>

                <Hidden xsDown>{value}</Hidden>
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
                <Button href={refLink} target="_blank">
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
