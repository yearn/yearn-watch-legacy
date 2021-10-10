import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import sum from 'lodash/sum';

import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';

import { Vault } from '../../../types';
import SearchInput, { Flags } from '../SearchInput';
import { VaultItemList } from '../../app';

type VaultsListProps = {
    items: Vault[];
    totalItems: number;
    network: string;
};

const getTotalStrategies = (items: Vault[]): number =>
    sum(items.map((item) => item.strategies.length));

const _VaultsList = (props: VaultsListProps) => {
    const { totalItems, items, network } = props;
    const [filteredItems, setFilteredItems] = useState(items);
    const totalStrategies = useMemo(() => getTotalStrategies(items), [items]);
    const [totalStrategiesFound, setTotalStrategiesFound] = useState(
        totalStrategies
    );

    if (items.length === 0) {
        return <>Vaults not found.</>;
    }

    const filterStrategies = useMemo(
        () => (vault: Vault, newText: string) => {
            const strategies = vault.strategies.filter((strategy) => {
                return (
                    strategy.address.toLowerCase().includes(newText) ||
                    strategy.name.toLowerCase().includes(newText) ||
                    strategy.strategist.toLowerCase().includes(newText)
                );
            });
            return strategies;
        },
        []
    );

    const onFilter = useCallback(
        (newText: string, flags: Flags) => {
            console.time('timer');
            const hasFlags = flags.onlyWithWarnings;
            if (!hasFlags && newText.trim() === '') {
                console.log('click clear');
                console.time('clear');
                setFilteredItems(items);
                setTotalStrategiesFound(getTotalStrategies(items));
                console.timeEnd('clear');
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
            console.timeEnd('timer');
        },
        [items]
    );

    useEffect(() => {
        setFilteredItems(items);
        const totalStrategies = getTotalStrategies(items);
        setTotalStrategiesFound(totalStrategies);
    }, [items, totalStrategies]);

    const stillLoading = totalItems !== items.length;

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

            {stillLoading && (
                <ProgressSpinnerBar label={`total Vaults ${totalItems}...`} />
            )}
            <div style={{ height: '60vh', overflow: 'scroll' }}>
                {filteredItems.map((vault: Vault, index: number) => (
                    <div key={index}>
                        <VaultItemList
                            vault={vault}
                            key={index}
                            network={network}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export const VaultsList = memo(_VaultsList);
