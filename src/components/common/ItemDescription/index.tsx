import styled from 'styled-components';
import Grid, { GridSize } from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { HelpOutlined } from '@material-ui/icons';
import { HtmlTooltip } from '../HtmlTooltip';
import { Fragment, ReactNode } from 'react';

const StyledSubtitle = styled(Typography)`
    && {
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;

        color: ${({ theme }) => theme.subtitle} !important;
    }
`;
const StyledTitle = styled(Typography)`
    && {
        font-family: Roboto;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 5px;
        color: ${({ theme }) => theme.title} !important;
    }
`;
type ItemDescriptionProps = {
    label: string;
    value: number | string;
    xs?: boolean | GridSize | undefined;
    md: boolean | GridSize | undefined;
    visible?: boolean;
    helpTitle?: string;
    helpDescription?: ReactNode;
};

const ItemDescription = (props: ItemDescriptionProps) => {
    const { xs = 12, visible = true } = props;

    if (!visible) {
        return <></>;
    }

    const helpTooltip =
        props.helpTitle && props.helpDescription ? (
            <HtmlTooltip
                title={
                    <Fragment>
                        <Typography color="inherit">
                            {props.helpTitle}
                        </Typography>
                        {props.helpDescription}
                    </Fragment>
                }
            >
                <HelpOutlined fontSize="small" />
            </HtmlTooltip>
        ) : (
            ''
        );

    return (
        <Grid item xs={xs} md={props.md} style={{ marginBottom: 50 }}>
            <StyledTitle>{props.value}</StyledTitle>
            <StyledSubtitle>
                {props.label}: {helpTooltip}
            </StyledSubtitle>
        </Grid>
    );
};

export default ItemDescription;
