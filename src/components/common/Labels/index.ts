import styled from 'styled-components';

import { Typography } from '@material-ui/core';

export const Title = styled(Typography)`
    && {
        color: ${({ theme }) => theme.text} !important;

        border-radius: 3;
        padding: 2;
    }
`;

export const SubTitle = styled(Typography)`
    && {
        color: ${({ theme }) => theme.subtitle};
        margin-bottom: 10px;
        margin-top: 25px;
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        @media only screen and (max-width: 600px) {
            font-size: 14px;
        }

        line-height: 24px;
    }
`;
export const ValuePercentage = styled(Typography)`
    && {
        color: rgba(6, 87, 249, 1);
        margin-bottom: 10px;
        margin-top: 25px;
        float: right;
        font-family: Roboto;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        @media only screen and (max-width: 600px) {
            font-size: 14px;
        }
        line-height: 24px;
    }
`;
