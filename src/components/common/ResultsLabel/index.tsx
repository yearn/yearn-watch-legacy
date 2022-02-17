import makeStyles from '@mui/styles/makeStyles';
import { Container } from '@mui/material';

const useStyles = makeStyles({
    resultText: {
        width: '90%',
        padding: '10px',
        color: 'white',
        textAlign: 'center',
    },
});

type ResultsLabelProps = {
    title: string;
    totalItems: number;
    foundItems: number;
    isSearching: boolean;
    displayFound?: boolean;
};

const ResultsLabel = (props: ResultsLabelProps) => {
    const { displayFound = true } = props;
    const classes = useStyles();
    const foundText = displayFound ? `Found: ${props.foundItems} -` : '';
    return (
        <Container maxWidth="lg" className={classes.resultText}>
            {!props.isSearching
                ? `${props.title} - ${foundText} Total: ${props.totalItems}`
                : props.isSearching
                ? ''
                : `Total: ${props.totalItems}`}
        </Container>
    );
};

export default ResultsLabel;
