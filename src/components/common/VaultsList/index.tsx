import { Container } from '@material-ui/core';
import { useState } from 'react';
import { Vault } from '../../../types';
import SearchInput from '../SearchInput';
import { VaultItemList } from '../../app';

type VaultsListProps = {
    items: Vault[];
};

export const VaultsList = (props: VaultsListProps) => {
    const [filteredItems, setFilteredItems] = useState(props.items);

    if (props.items.length === 0) {
        return <>Vaults not found.</>;
    }

    const onFilter = (newText: string) => {
        if (newText.trim() === '') {
            setFilteredItems(props.items);
        } else {
            const filteredItems = props.items.filter((item: Vault) => {
                return (
                    item.address.toLowerCase().includes(newText) ||
                    item.apiVersion.includes(newText) ||
                    item.name.toLowerCase().includes(newText) ||
                    item.symbol.toLowerCase().includes(newText) ||
                    item.token.symbol.toLowerCase().includes(newText)
                );
            });
            setFilteredItems(filteredItems);
        }
    };

    return (
        <>
            <SearchInput
                onFilter={onFilter}
                debounceWait={250}
                totalItems={props.items.length}
                foundItems={filteredItems.length}
            />
            {filteredItems.map((vault: Vault, index: number) => (
                <Container maxWidth="lg" key={index}>
                    <VaultItemList vault={vault} key={index} />
                </Container>
            ))}
        </>
    );
};
