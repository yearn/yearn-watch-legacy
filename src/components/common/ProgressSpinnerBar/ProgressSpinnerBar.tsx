import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        secondary: {
            main: '#EFD631',
        },
    },
});
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function LinearDeterminate() {
    const classes = useStyles();
    const [completed, setCompleted] = React.useState(0);

    React.useEffect(() => {
        function progress() {
            setCompleted((oldCompleted) => {
                if (oldCompleted === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldCompleted + diff, 100);
            });
        }

        const timer = setInterval(progress, 500);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Container>
            <div className={classes.root}>
                <div
                    style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 200,
                    }}
                >
                    Loading
                </div>
                <MuiThemeProvider theme={theme}>
                    {' '}
                    <LinearProgress
                        variant="determinate"
                        value={completed}
                        color="secondary"
                    />
                </MuiThemeProvider>
            </div>
        </Container>
    );
}
