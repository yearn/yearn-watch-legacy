import { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { HtmlTooltip } from '../HtmlTooltip';
import { HelpOutlineRounded } from '@material-ui/icons';
import MediaQuery from 'react-responsive';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { getTokenPrice, getTokenUnitPrice } from '../../../utils/oracle';
import BigNumber from 'bignumber.js';
import { Token } from '../../../types';
import { BigNumberish } from 'ethers';
import {
    displayAmount,
    isUSDC,
    toUnits,
    USDC_DECIMALS,
} from '../../../utils/commonUtils';
import { Typography, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles({
    helpIcon: {
        verticalAlign: 'middle',
    },
});

type TokenPriceProps = {
    token: Token;
    label?: string;
    loadingLabel?: string;
    amount: BigNumberish;
};

const TokenPrice = (props: TokenPriceProps) => {
    const [tokenPrice, setTokenPrice] = useState<BigNumber>();
    const [tokenUnitPrice, setTokenUnitPrice] = useState<BigNumber>();
    const {
        label = 'Token Price (USD):',
        loadingLabel = `Getting ${props.token.symbol}/USDC price...`,
    } = props;

    const classes = useStyles();

    useEffect(() => {
        if (isUSDC(props.token.address)) {
            setTokenUnitPrice(new BigNumber(1));
            setTokenPrice(toUnits(props.amount.toString(), USDC_DECIMALS));
        } else {
            getTokenUnitPrice(props.token).then((unitPrice: BigNumber) => {
                setTokenUnitPrice(unitPrice);
            });
            getTokenPrice(props.token, props.amount.toString()).then(
                (usdcAmount: BigNumber) => {
                    setTokenPrice(usdcAmount);
                }
            );
        }
    }, []);

    if (!tokenPrice || !tokenUnitPrice) {
        return (
            <TableRow>
                <TableCell>
                    {label}
                    <MediaQuery query="(max-device-width: 1224px)">
                        <CircularProgress color="inherit" size="0.6rem" />{' '}
                        {loadingLabel}
                    </MediaQuery>
                </TableCell>
                <MediaQuery query="(min-device-width: 1224px)">
                    <TableCell>
                        <CircularProgress color="inherit" size="0.6rem" />{' '}
                        {loadingLabel}
                    </TableCell>
                </MediaQuery>
            </TableRow>
        );
    }
    const tooltip = (
        <HtmlTooltip
            title={
                <Fragment>
                    <Typography color="inherit">
                        {'Token Unit Price'}
                    </Typography>
                    {`1 ${props.token.symbol} ~= ${tokenUnitPrice?.toFixed(
                        4
                    )} USDC`}
                </Fragment>
            }
        >
            <HelpOutlineRounded fontSize="small" className={classes.helpIcon} />
        </HtmlTooltip>
    );

    return (
        <TableRow>
            <TableCell>
                {label}
                <MediaQuery query="(max-device-width: 1224px)">
                    {' '}
                    <br />
                    {tokenPrice
                        ? displayAmount(tokenPrice?.toFixed(2), 2)
                        : '-'}{' '}
                    USD
                </MediaQuery>{' '}
            </TableCell>
            <MediaQuery query="(min-device-width: 1224px)">
                <TableCell>
                    {tokenPrice
                        ? `${displayAmount(tokenPrice?.toFixed(2), 0)} USD`
                        : '-'}{' '}
                    {tooltip}
                </TableCell>
            </MediaQuery>
        </TableRow>
    );
};

export default TokenPrice;
