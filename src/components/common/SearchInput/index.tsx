import { ChangeEvent, useState, useCallback } from 'react';
/* eslint-disable jsx-a11y/no-autofocus */

import styled from 'styled-components';
import { debounce } from 'lodash';
import {
    Container,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Switch,
    TextField,
    Grid,
} from '@material-ui/core';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';

import { Delete, Search } from '@material-ui/icons';
import ResultsLabel from '../ResultsLabel';

const StyledForm = styled.form`
    && {
        width: 100%;
        align-items: center;
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

const StyledContainer = styled(Container)`
    && {
        width: 100%;
        align-items: center;
        align-content: center;
        background-color: ${({ theme }) => theme.container} !important;

        border-radius: 8px;
    }
`;
const StyledContainerResult = styled(Container)`
    && {
        width: 90%;
        padding: 10px;

        text-align: center;
    }
`;
const StyledFormControlLabel = styled(FormControlLabel)`
    && {
        color: ${({ theme }) => theme.text} !important;
        margin: 8px;
        opacity: 1;
    }
`;
export type Flags = {
    onlyWithWarnings: boolean;
};

type SearchInputProps = {
    debounceWait: number;
    totalItems: number;
    foundItems: number;
    totalSubItems: number;
    foundSubItems: number;
    onFilter: (text: string, flags: Flags) => void;
};

const getCurrentFlags = (onlyWithWarnings: boolean) => ({
    onlyWithWarnings,
});

const SearchInput = (props: SearchInputProps) => {
    const {
        onFilter,
        debounceWait,
        totalItems,
        foundItems,
        totalSubItems,
        foundSubItems,
    } = props;
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filterVaultsWithWarnings, setFilterVaultsWithWarnings] = useState(
        false
    );

    const debounceFilter = useCallback(
        debounce((newSearchText, flags) => {
            const newSearchTextLowerCase = newSearchText.toLowerCase();
            onFilter(newSearchTextLowerCase, flags);
            setIsSearching(false);
        }, debounceWait),
        [debounceWait, isSearching]
    );

    // Event listener called on every change
    const onChange = useCallback(
        (event: ChangeEvent) => {
            const value = (event.target as HTMLInputElement).value;
            setIsSearching(true);
            setSearchText(value);
            debounceFilter(value, getCurrentFlags(filterVaultsWithWarnings));
        },
        [filterVaultsWithWarnings, searchText, isSearching]
    );

    const onFilterVaultsWithWarnings = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setFilterVaultsWithWarnings(e.target.checked);
            setIsSearching(true);
            const newSearchTextLowerCase = searchText.toLowerCase();
            onFilter(newSearchTextLowerCase, getCurrentFlags(e.target.checked));
            setIsSearching(false);
        },
        [searchText, isSearching]
    );
    const handleClickClearSearch = useCallback(() => {
        setSearchText('');
        setFilterVaultsWithWarnings(false);
        onFilter('', getCurrentFlags(false));
    }, [onFilter]);

    const renderSearchingLabel = useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let render: any;
        if (isSearching) {
            render = (
                <div>
                    <ProgressSpinnerBar label="results" />
                </div>
            );
        } else {
            render = (
                <>
                    <ResultsLabel
                        title="Vaults"
                        totalItems={totalItems}
                        foundItems={foundItems}
                        displayFound={true}
                        isSearching={isSearching}
                    />
                    <ResultsLabel
                        title="Strategies"
                        totalItems={totalSubItems}
                        foundItems={foundSubItems}
                        displayFound={true}
                        isSearching={isSearching}
                    />
                </>
            );
        }

        return render;
    }, [isSearching, totalItems, foundItems, totalSubItems, foundSubItems]);

    return (
        <div>
            <StyledForm>
                <Grid container direction="row" alignItems="center" spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <StyledContainer maxWidth="lg">
                            <StyledTextField
                                variant="outlined"
                                onChange={onChange}
                                type="search"
                                value={searchText}
                                placeholder="Search by vault/strategy address/name, strategist address, token name/symbol, share token symbol/name or API version."
                                InputProps={
                                    searchText == ''
                                        ? {
                                              startAdornment: (
                                                  <InputAdornment position="end">
                                                      <Search />
                                                  </InputAdornment>
                                              ),
                                          }
                                        : {
                                              endAdornment: (
                                                  <InputAdornment position="end">
                                                      <IconButton
                                                          aria-label="delete"
                                                          onClick={
                                                              handleClickClearSearch
                                                          }
                                                      >
                                                          <Delete />
                                                      </IconButton>
                                                  </InputAdornment>
                                              ),
                                          }
                                }
                            />
                        </StyledContainer>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <StyledContainer maxWidth="lg">
                            <StyledFormControlLabel
                                control={
                                    <Switch
                                        checked={filterVaultsWithWarnings}
                                        onChange={onFilterVaultsWithWarnings}
                                        color="primary"
                                    />
                                }
                                labelPlacement="start"
                                label="Only show Vaults with warnings"
                            />
                        </StyledContainer>
                    </Grid>
                </Grid>
            </StyledForm>
            <StyledContainerResult maxWidth="lg">
                {renderSearchingLabel()}
            </StyledContainerResult>
        </div>
    );
};

export default SearchInput;
