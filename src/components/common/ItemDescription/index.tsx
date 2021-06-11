import { makeStyles } from '@material-ui/core/styles';
import Grid, { GridSize } from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { HelpOutlined } from '@material-ui/icons';
import { HtmlTooltip } from '../HtmlTooltip';
import { Fragment, ReactNode } from 'react';

const useStyles = makeStyles({
    subText: {
        marginBottom: 10,
    },
    grid: {
        marginBottom: 10,
        borderBottom: '1px solid #e8e8e8',
    },
});

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
    const classes = useStyles();
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
        <Grid item xs={xs} md={props.md} className={classes.grid}>
            <Typography className={classes.subText}>
                {' '}
                {props.label}: {helpTooltip}
                <br /> {props.value}
            </Typography>
        </Grid>
    );
};

export default ItemDescription;
