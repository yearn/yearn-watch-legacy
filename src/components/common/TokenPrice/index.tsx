import { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { HtmlTooltip } from '../HtmlTooltip';
import { HelpOutlineRounded } from '@material-ui/icons';
import MediaQuery from 'react-responsive';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { getTokenPrice, getTokenUnitPrice } from '../../../utils/oracle';
import BigNumber from 'bignumber.js';
import { Network, Token } from '../../../types';
import { BigNumberish } from 'ethers';
import { displayAmount, isUSDC, toUnits } from '../../../utils/commonUtils';
import { Typography, CircularProgress } from '@material-ui/core';
import { LabelTypography, SubTitle } from '../Labels';
import { USDC_DECIMALS } from '../../../utils/contracts/addresses';

const useStyles = makeStyles({
    helpIcon: {
        verticalAlign: 'middle',
    },
});

const StyledTableRow = styled(TableRow).withConfig({
    shouldForwardProp: (props) => !(props.toString() in ['bckDark']),
})<{ bckDark?: string }>`
    && {
        background-color: ${({ theme, bckDark }) =>
            bckDark == 'true' ? theme.body : theme.container} !important;
    }
`;
const StyledTableCell = styled(TableCell)`
    && {
        color: ${({ theme }) => theme.title} !important;
        border-bottom: 1px solid ${({ theme }) => theme.border} !important;
    }
`;
type TokenPriceProps = {
    token: Token;
    label?: string;
    loadingLabel?: string;
    amount: BigNumberish;
    bckDark?: string | undefined;
    network: Network;
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
        if (isUSDC(props.token.address, props.network)) {
            setTokenUnitPrice(new BigNumber(1));
            setTokenPrice(toUnits(props.amount.toString(), USDC_DECIMALS));
        } else {
            getTokenUnitPrice(props.token, props.network).then(
                (unitPrice: BigNumber) => {
                    setTokenUnitPrice(unitPrice);
                }
            );
            getTokenPrice(
                props.token,
                props.amount.toString(),
                props.network
            ).then((usdcAmount: BigNumber) => {
                setTokenPrice(usdcAmount);
            });
        }
    }, []);

    if (!tokenPrice || !tokenUnitPrice) {
        return (
            <StyledTableRow>
                <StyledTableCell>
                    {label}
                    <MediaQuery query="(max-device-width: 1224px)">
                        <CircularProgress color="inherit" size="0.6rem" />{' '}
                        {loadingLabel}
                    </MediaQuery>
                </StyledTableCell>
                <MediaQuery query="(min-device-width: 1224px)">
                    <StyledTableCell>
                        <CircularProgress color="inherit" size="0.6rem" />{' '}
                        {loadingLabel}
                    </StyledTableCell>
                </MediaQuery>
            </StyledTableRow>
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
        <StyledTableRow bckDark={props.bckDark ? 'true' : 'false'}>
            <StyledTableCell>
                <SubTitle> {label}</SubTitle>
                <MediaQuery query="(max-device-width: 1224px)">
                    <br />
                    <LabelTypography>
                        {tokenPrice
                            ? displayAmount(tokenPrice?.toFixed(2), 0)
                            : '-'}
                        USD
                    </LabelTypography>
                </MediaQuery>
            </StyledTableCell>
            <MediaQuery query="(min-device-width: 1224px)">
                <StyledTableCell>
                    <LabelTypography>
                        {tokenPrice
                            ? `${displayAmount(tokenPrice?.toFixed(2), 0)} USD`
                            : '-'}
                    </LabelTypography>
                    {tooltip}
                </StyledTableCell>
            </MediaQuery>
        </StyledTableRow>
    );
};

export default TokenPrice;
