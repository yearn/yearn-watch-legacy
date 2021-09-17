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

export const LabelTypography = styled(Typography)`
    && {
        color: ${({ theme }) => theme.title};
        font-family: Roboto;
        font-style: normal;
        font-weight: bolder;
        font-size: 16px;
        line-height: 24px;

        line-height: 24px;
    }
`;
export const ValuePercentage = styled(Typography)`
    && {
        color: ${({ theme }) => theme.bodyBlue};

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
