import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Grid,
    FormControlLabel,
} from '@material-ui/core';
import styled from 'styled-components';

const StyledForm = styled.form`
    && {
        width: 100%;
        align-items: center;
    }
`;
const StyledContainer = styled(Container)`
    && {
        width: 100%;
        align-items: center;
        align-content: center;
        background-color: ${({ theme }) => theme.container} !important;

        border-radius: 8px;
    }
`;
const StyledTextField = styled(TextField)`
    && {
        width: 100%;
        background-color: transparent;
        align-content: center;
        border-color: transparent;
        .MuiOutlinedInput-root {
            fieldset {
                border-color: transparent !important;
            }
            &:hover fieldset {
                border-color: transparent !important;
            }
            &.Mui-focused fieldset {
                border-color: transparent;
            }
            color: ${({ theme }) => theme.text} !important;
        }
    }
`;
const StyledFormControlLabel = styled(FormControlLabel)`
    && {
        color: ${({ theme }) => theme.text} !important;
        margin: 8px;
        opacity: 1;
    }
`;

export const ExperimentalVault = () => {
    const [contract, setContract] = useState<string>('');
    const history = useHistory();

    const handleClick = (event: React.ChangeEvent<any>) => {
        history.push(`/vault/${contract}`);
    };

    const handleChange = (event: React.ChangeEvent<any>) => {
        setContract(event?.target.value);
    };
    return (
        <div>
            <h3>View Experimental Vaults</h3>
            <p>
                Find contract addresses on&nbsp;
                <a href="https://ape.tax/">ape.tax</a>&nbsp;
            </p>
            <StyledForm>
                <Grid container direction="row" alignItems="center">
                    <Grid item xs={8} sm={6}>
                        <form
                            noValidate
                            autoComplete="off"
                            onChange={handleChange}
                        >
                            <StyledContainer maxWidth="lg">
                                <StyledTextField
                                    id="filled-basic"
                                    variant="outlined"
                                    placeholder="Vault Contract 0x...123"
                                />
                            </StyledContainer>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClick}
                            >
                                View Vault
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </StyledForm>
        </div>
    );
};
