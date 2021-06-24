import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { Strategy } from '../../../types';
import { EMPTY_ADDRESS } from '../../../utils/commonUtils';
import { HtmlTooltip } from '../HtmlTooltip';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
    yellowIcon: {
        color: '#c94141',
        verticalAlign: 'middle',
        padding: '3px',
    },
    greenIcon: {
        color: 'green',
        verticalAlign: 'middle',
        padding: '3px',
    },
});

type HealthCheckIconProps = {
    strategy: Strategy;
};

const HealthCheckIcon = (props: HealthCheckIconProps) => {
    const {
        strategy: { healthCheck, doHealthCheck },
    } = props;
    const classes = useStyles();
    const isHealthCheckOk = healthCheck !== EMPTY_ADDRESS && doHealthCheck;

    const icon = (
        <HtmlTooltip
            title={
                <React.Fragment>
                    <Typography color="inherit">
                        {' '}
                        {'Health Check'}:{' '}
                        {healthCheck ? healthCheck : 'Not set'}
                        <br />
                        {'Do Next Health Check'}:{' '}
                        {doHealthCheck ? 'Enabled' : 'Disabled'}
                    </Typography>
                </React.Fragment>
            }
        >
            {isHealthCheckOk ? (
                <CheckCircleRoundedIcon className={classes.greenIcon} />
            ) : (
                <CancelRoundedIcon className={classes.yellowIcon} />
            )}
        </HtmlTooltip>
    );
    return icon;
};

export default HealthCheckIcon;
