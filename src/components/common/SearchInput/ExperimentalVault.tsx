import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Network } from '../../../types';
import { Container, TextField, Button, Grid } from '@material-ui/core';
import styled from 'styled-components';

const StyledForm = styled.div`
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
const StyledHeader = styled.div`
    && {
        color: #363537;
        margin-left: 1em;
    }
`;

type VaultsListProps = {
    network: Network;
};

export const ExperimentalVault = (props: VaultsListProps) => {
    const [vaultAddress, setVaultAddress] = useState<string>('');
    const { network } = props;
    const vaultUri = `/network/${network}/vault/${vaultAddress}`;
    const history = useHistory();

    const handleClick = () => {
        history.push(vaultUri);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVaultAddress(event?.target.value);
    };
    return (
        <div>
            <StyledHeader>
                <h3>View Experimental Vaults</h3>
                <p>
                    Find contract addresses on&nbsp;
                    <a href="https://ape.tax/">ape.tax</a>&nbsp;
                </p>
            </StyledHeader>
            <StyledForm>
                <Grid container direction="row" alignItems="center" spacing={3}>
                    <Grid item xs={6}>
                        <StyledContainer maxWidth="lg">
                            <StyledTextField
                                onChange={handleChange}
                                id="filled-basic"
                                variant="outlined"
                                placeholder="Vault Contract 0x...123"
                            />
                        </StyledContainer>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClick}
                        >
                            View Vault
                        </Button>
                    </Grid>
                </Grid>
            </StyledForm>
        </div>
    );
};
