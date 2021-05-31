import { makeStyles } from '@material-ui/core/styles';
import { debounce } from 'lodash';
import {
    Container,
    IconButton,
    InputAdornment,
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

type SearchInputProps = {
    debounceWait: number;
    totalItems: number;
    foundItems: number;
    totalSubItems: number;
    foundSubItems: number;
    onFilter: (text: string) => void;
};

const SearchInput = (props: SearchInputProps) => {
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const classes = useStyles();

    const debounceFilter = debounce((newSearchText) => {
        const newSearchTextLowerCase = newSearchText.toLowerCase();
        props.onFilter(newSearchTextLowerCase);
        setIsSearching(false);
    }, props.debounceWait);

    // Event listener called on every change
    const onChange = (event: ChangeEvent) => {
        const value = (event.target as HTMLInputElement).value;
        setIsSearching(true);
        setSearchText(value);
        debounceFilter(value);
    };
    const handleClickClearSearch = () => {
        setSearchText('');
        props.onFilter('');
    };
    return (
        <Container maxWidth="lg">
            <form className={classes.root}>
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
                {isSearching ? 'Searching items...' : ''}
                {!isSearching && searchText.trim() !== '' ? (
                    <>
                        <ResultsLabel
                            title="Vaults"
                            totalItems={props.totalItems}
                            foundItems={props.foundItems}
                            isSearching={isSearching}
                        />
                        <ResultsLabel
                            title="Strategies"
                            totalItems={props.totalSubItems}
                            foundItems={props.foundSubItems}
                            isSearching={isSearching}
                        />
                    </>
                ) : isSearching ? (
                    ''
                ) : (
                    `Total Vaults: ${props.totalItems}`
                )}
            </Container>
        </Container>
    );
};

export default SearchInput;
