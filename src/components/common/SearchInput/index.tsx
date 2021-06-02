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
import { ChangeEvent, useState } from 'react';
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

const SearchInput = (props: SearchInputProps) => {
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filterVaultsWithWarnings, setFilterVaultsWithWarnings] = useState(
        false
    );
    const classes = useStyles();

    const getCurrentFlags = (onlyWithWarnings: boolean) => ({
        onlyWithWarnings,
    });

    const debounceFilter = debounce((newSearchText, flags) => {
        const newSearchTextLowerCase = newSearchText.toLowerCase();
        props.onFilter(newSearchTextLowerCase, flags);
        setIsSearching(false);
    }, props.debounceWait);

    // Event listener called on every change
    const onChange = (event: ChangeEvent) => {
        const value = (event.target as HTMLInputElement).value;
        setIsSearching(true);
        setSearchText(value);
        debounceFilter(value, getCurrentFlags(filterVaultsWithWarnings));
    };
    const onFilterVaultsWithWarnings = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterVaultsWithWarnings(e.target.checked);
        setIsSearching(true);
        debounceFilter(searchText, getCurrentFlags(e.target.checked));
    };
    const handleClickClearSearch = () => {
        setSearchText('');
        setFilterVaultsWithWarnings(false);
        props.onFilter('', getCurrentFlags(false));
    };
    const renderSearchingLabel = () => {
        let render: any;
        if (isSearching) {
            render = 'Searching items...';
        } else {
            render = (
                <>
                    <ResultsLabel
                        title="Vaults"
                        totalItems={props.totalItems}
                        foundItems={props.foundItems}
                        displayFound={true}
                        isSearching={isSearching}
                    />
                    <ResultsLabel
                        title="Strategies"
                        totalItems={props.totalSubItems}
                        foundItems={props.foundSubItems}
                        displayFound={true}
                        isSearching={isSearching}
                    />
                </>
            );
        }
        // }
        return render;
    };

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
