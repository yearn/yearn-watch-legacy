import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)`
    && {
        height: 12px !important;
        border-radius: 5px !important;
        background-color: #f2f2f2 !important;

        .MuiLinearProgress-bar {
            background-color: ${({ theme }) => theme.bodyBlue} !important;
        }
    }
`;
const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProgressBars = (props: any) => {
    const classes = useStyles();
    const vault = props.vault;
    const value =
        vault && vault.depositLimit > 0
            ? vault.totalAssets / vault.depositLimit
            : 1;
    const p = value * 100;
    const f = p ? parseInt(p.toFixed(0)) : 0;
    return (
        <div className={classes.root}>
            <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                    <BorderLinearProgress variant="determinate" value={f} />
                </Box>
                <Typography
                    variant="body2"
                    color="textSecondary"
                >{`${f}%`}</Typography>
            </Box>
        </div>
    );
};

export default ProgressBars;
