import { Container } from '@material-ui/core';
import { useState } from 'react';
import { Vault } from '../../../types';
import SearchInput, { Flags } from '../SearchInput';
import { VaultItemList } from '../../app';
import _ from 'lodash';

type VaultsListProps = {
    items: Vault[];
};

export const VaultsList = (props: VaultsListProps) => {
    const [filteredItems, setFilteredItems] = useState(props.items);
    const getTotalStrategies = () =>
        _.sum(props.items.map((item) => item.strategies.length));
    const totalStrategies = getTotalStrategies();
    const [totalStrategiesFound, setTotalStrategiesFound] = useState(
        totalStrategies
    );

    if (props.items.length === 0) {
        return <>Vaults not found.</>;
    }

    const filterStrategies = (vault: Vault, newText: string) => {
        const strategies = vault.strategies.filter((strategy) => {
            console.log(
                `${strategy.name.toLowerCase()} includes ${newText} ? ${strategy.name
                    .toLowerCase()
                    .includes(newText)}`
            );
            return (
                strategy.address.toLowerCase().includes(newText) ||
                strategy.name.toLowerCase().includes(newText) ||
                strategy.strategist.toLowerCase().includes(newText) ||
                strategy.healthCheck?.toLowerCase().includes(newText)
            );
        });
        return strategies;
    };

    const onFilter = (newText: string, flags: Flags) => {
        const hasFlags = flags.onlyWithWarnings;
        if (!hasFlags && newText.trim() === '') {
            setFilteredItems(props.items);
            setTotalStrategiesFound(getTotalStrategies());
        } else {
            let totalStrategiesFound = 0;
            const filteredItems = props.items
                .filter((item: Vault) => {
                    const applyFlags =
                        !flags.onlyWithWarnings ||
                        (flags.onlyWithWarnings && !item.configOK);
                    return applyFlags;
                })
                .filter((item: Vault) => {
                    const filteredStrategies = filterStrategies(item, newText);
                    totalStrategiesFound += filteredStrategies.length;
                    const hasVaultStrategies = filteredStrategies.length > 0;

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
