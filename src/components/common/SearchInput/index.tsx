import { ChangeEvent, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash';
import {
    Container,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Switch,
    TextField,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Delete } from '@material-ui/icons';
import ResultsLabel from '../ResultsLabel';

const useStyles = makeStyles({
    root: {
        width: '100%',
        alignItems: 'center',
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
        alignContent: 'center',
    },
    switch: {
        color: 'white',
        margin: '12px',
    },
    searchInput: {
        width: '100%',
        margin: '15px',
        backgroundColor: 'white',
        alignContent: 'center',
    },
    resultText: {
        width: '90%',
        padding: '10px',
        color: 'white',
        textAlign: 'center',
    },
});

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
    const classes = useStyles();

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
        let render: any;
        if (isSearching) {
            render = (
                <div>
                    {'...loading results'}
                    <CircularProgress style={{ color: '#fff' }} />
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
        // }
        return render;
    }, [isSearching, totalItems, foundItems, totalSubItems, foundSubItems]);

    return (
        <Container maxWidth="lg">
            <form className={classes.root}>
                <Container maxWidth="lg" className={classes.formContainer}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={filterVaultsWithWarnings}
                                onChange={onFilterVaultsWithWarnings}
                                color="primary"
                            />
                        }
                        className={classes.switch}
                        label="Only show Vaults with warnings"
                    />
                </Container>
                <TextField
                    className={classes.searchInput}
                    id="outlined-basic"
                    variant="outlined"
                    onChange={onChange}
                    type="search"
                    value={searchText}
                    placeholder="Search by vault/strategy address/name, strategist address, token name/symbol, share token symbol/name or API version."
                    InputProps={{
                        endAdornment:
                            searchText !== '' ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={handleClickClearSearch}
                                    >
                                        <Delete />
                                    </IconButton>
                                </InputAdornment>
                            ) : (
                                ''
                            ),
                    }}
                />
            </form>
            <Container maxWidth="lg" className={classes.resultText}>
                {renderSearchingLabel()}
            </Container>
        </Container>
    );
};

export default SearchInput;
