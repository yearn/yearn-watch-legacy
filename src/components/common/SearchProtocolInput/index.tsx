import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    IconButton,
    InputAdornment,
    TextField,
} from '@material-ui/core';
import { ChangeEvent, FormEvent, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';

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

type SearchProtocolInputProps = {
    onSearch: (text: string) => Promise<void>;
};

const SearchProtocolInput = (props: SearchProtocolInputProps) => {
    const [searchText, setSearchText] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const classes = useStyles();

    const handleOnChange = (event: ChangeEvent) => {
        event.preventDefault();
        const value = (event.target as HTMLInputElement).value;
        setSearchText(value);
    };
    const handleClickSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSearching(true);
        props.onSearch(searchText.trim()).then(() => {
            setIsSearching(false);
            setSearchText('');
        });
    };
    const renderSearchingLabel = () => {
        let render: any;
        if (isSearching) {
            render = 'Searching items...';
        } else {
            render = ``;
        }
        return render;
    };
    const isSearchDisabled =
        isSearching || searchText === undefined || searchText.trim() === '';

    return (
        <Container maxWidth="lg">
            <form className={classes.root} onSubmit={handleClickSearch}>
                <TextField
                    className={classes.searchInput}
                    id="outlined-basic"
                    variant="outlined"
                    type="text"
                    value={searchText}
                    onChange={handleOnChange}
                    disabled={isSearching}
                    placeholder="Type your terms (protocol name -ex: maker, convex-) and click on the search icon."
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="search"
                                    disabled={isSearchDisabled}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
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

export default SearchProtocolInput;
