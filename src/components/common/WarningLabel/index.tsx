import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

const useStyles = makeStyles({
    warningText: {
        width: '90%',
        padding: '10px',
        color: 'yellow',
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
});

type WarningLabelProps = {
    warningText: string;
};

const WarningLabel = (props: WarningLabelProps) => {
    const classes = useStyles();
    return (
        <Container maxWidth="lg" className={classes.warningText}>
            {props.warningText}
        </Container>
    );
};

export default WarningLabel;
