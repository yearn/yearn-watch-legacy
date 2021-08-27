import { useState, useEffect, useCallback } from 'react';
import sum from 'lodash/sum';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Vault } from '../../../types';
import SearchInput, { Flags } from '../SearchInput';
import { VaultItemList } from '../../app';

type VaultsListProps = {
    items: Vault[];
    totalItems: number;
};

const useStyles = makeStyles({
    loadingText: {
        width: '90%',
        padding: '10px',
        color: 'white',
        textAlign: 'center',
    },
});

const filterStrategies = (vault: Vault, newText: string) => {
    const strategies = vault.strategies.filter((strategy) => {
        return (
            strategy.address.toLowerCase().includes(newText) ||
            strategy.name.toLowerCase().includes(newText) ||
            strategy.strategist.toLowerCase().includes(newText)
        );
    });
    return strategies;
};

const getTotalStrategies = (items: Vault[]): number =>
    sum(items.map((item) => item.strategies.length));

export const VaultsList = (props: VaultsListProps) => {
    const { totalItems, items } = props;
    const [filteredItems, setFilteredItems] = useState(items);
    const totalStrategies = getTotalStrategies(items);
    const [totalStrategiesFound, setTotalStrategiesFound] = useState(
        totalStrategies
    );

    if (items.length === 0) {
        return <>Vaults not found.</>;
    }

    const onFilter = useCallback(
        (newText: string, flags: Flags) => {
            const hasFlags = flags.onlyWithWarnings;
            if (!hasFlags && newText.trim() === '') {
                setFilteredItems(items);
                setTotalStrategiesFound(getTotalStrategies(items));
            } else {
                let totalStrategiesFound = 0;
                const filteredItems = items
                    .filter((item: Vault) => {
                        const applyFlags =
                            !flags.onlyWithWarnings ||
                            (flags.onlyWithWarnings && !item.configOK);
                        return applyFlags;
                    })
                    .filter((item: Vault) => {
                        const filteredStrategies = filterStrategies(
                            item,
                            newText
                        );
                        totalStrategiesFound += filteredStrategies.length;
                        const hasVaultStrategies =
                            filteredStrategies.length > 0;

                        const applyFilter =
                            item.address.toLowerCase().includes(newText) ||
                            item.apiVersion.includes(newText) ||
                            item.name.toLowerCase().includes(newText) ||
                            item.symbol.toLowerCase().includes(newText) ||
                            item.token.symbol.toLowerCase().includes(newText) ||
                            hasVaultStrategies;
                        return applyFilter;
                    });
                setFilteredItems(filteredItems);
                setTotalStrategiesFound(totalStrategiesFound);
            }
        },
        [items]
    );

    useEffect(() => {
        setFilteredItems(items);
        const totalStrategies = getTotalStrategies(items);
        setTotalStrategiesFound(totalStrategies);
    }, [props]);

    const classes = useStyles();

    const stillLoading = totalItems !== items.length;

    return (
        <>
            <SearchInput
                onFilter={onFilter}
                debounceWait={1000}
                totalItems={props.items.length}
                foundItems={filteredItems.length}
                totalSubItems={totalStrategies}
                foundSubItems={totalStrategiesFound}
            />
            <Container maxWidth="lg" className={classes.loadingText}>
                {stillLoading ? `Loading total Vaults ${totalItems}...` : ''}
                {stillLoading && <CircularProgress style={{ color: '#fff' }} />}
            </Container>

            {filteredItems.map((vault: Vault, index: number) => (
                <Container maxWidth="lg" key={index}>
                    <VaultItemList vault={vault} key={index} />
                </Container>
            ))}
        </>
    );
};
