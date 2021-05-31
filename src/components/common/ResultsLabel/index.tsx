import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

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
};

const ResultsLabel = (props: ResultsLabelProps) => {
    const classes = useStyles();
    return (
        <Container maxWidth="lg" className={classes.resultText}>
            {!props.isSearching
                ? `${props.title} - Found: ${props.foundItems} - Total: ${props.totalItems}`
                : props.isSearching
                ? ''
                : `Total: ${props.totalItems}`}
        </Container>
    );
};

export default ResultsLabel;
