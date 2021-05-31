import { Container } from '@material-ui/core';
import { useState } from 'react';
import { Vault } from '../../../types';
import SearchInput from '../SearchInput';
import { VaultItemList } from '../../app';
import _ from 'lodash';

type VaultsListProps = {
    items: Vault[];
};

export const VaultsList = (props: VaultsListProps) => {
    const [filteredItems, setFilteredItems] = useState(props.items);
    const totalStrategies = _.sum(
        props.items.map((item) => item.strategies.length)
    );
    const [totalStrategiesFound, setTotalStrategiesFound] = useState(
        totalStrategies
    );

    if (props.items.length === 0) {
        return <>Vaults not found.</>;
    }

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

    const onFilter = (newText: string) => {
        if (newText.trim() === '') {
            setFilteredItems(props.items);
        } else {
            let totalStrategiesFound = 0;
            const filteredItems = props.items.filter((item: Vault) => {
                const filteredStrategies = filterStrategies(item, newText);
                totalStrategiesFound += filteredStrategies.length;
                return (
                    item.address.toLowerCase().includes(newText) ||
                    item.apiVersion.includes(newText) ||
                    item.name.toLowerCase().includes(newText) ||
                    item.symbol.toLowerCase().includes(newText) ||
                    item.token.symbol.toLowerCase().includes(newText)
                );
            });
            setFilteredItems(filteredItems);
            setTotalStrategiesFound(totalStrategiesFound);
        }
    };

    return (
        <>
            <SearchInput
                onFilter={onFilter}
                debounceWait={250}
                totalItems={props.items.length}
                foundItems={filteredItems.length}
                totalSubItems={totalStrategies}
                foundSubItems={totalStrategiesFound}
            />
            {filteredItems.map((vault: Vault, index: number) => (
                <Container maxWidth="lg" key={index}>
                    <VaultItemList vault={vault} key={index} />
                </Container>
            ))}
        </>
    );
};
