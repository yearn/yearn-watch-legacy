import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import sum from 'lodash/sum';
import Button from '@mui/material/Button';

import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';

import { Network, Vault } from '../../../types';
import SearchInput, { Flags } from '../SearchInput';
import { VaultItemList } from '../../app';
import { EMPTY_ADDRESS } from '../../../utils/commonUtils';

const StyledReportContainer = styled.div`
    && {
        display: flex;
        justify-content: center;
        margin: 16px auto;
        background: ${({ theme }) => theme.container};
        border: 1px solid ${({ theme }) => theme.secondary};
        max-width: fit-content;
        border-radius: 8px;
    }
`;

const StyledReportTitle = styled.div`
    && {
        color: ${({ theme }) => theme.title};
    }
`;

type VaultsListProps = {
    items: Vault[];
    totalItems: number;
    network: Network;
};

const getTotalStrategies = (items: Vault[]): number =>
    sum(items.map((item) => item.strategies.length));

const _VaultsList = (props: VaultsListProps) => {
    const { totalItems, items, network } = props;
    const [filteredItems, setFilteredItems] = useState(items);
    const totalStrategies = useMemo(() => getTotalStrategies(items), [items]);
    const [totalStrategiesFound, setTotalStrategiesFound] =
        useState(totalStrategies);

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

    const filterStrategiesHealthCheck = useMemo(
        () => (vault: Vault, health: string) => {
            const strategies = vault.strategies.filter((strategy) => {
                switch (health) {
                    case 'Enabled':
                        return (
                            strategy.healthCheck !== null &&
                            strategy.doHealthCheck === true
                        );
                    case 'Disabled':
                        return (
                            (strategy.healthCheck !== null &&
                                strategy.doHealthCheck === false) ||
                            (strategy.doHealthCheck === true &&
                                strategy.healthCheck?.toLowerCase() ===
                                    EMPTY_ADDRESS)
                        );
                    case 'None':
                        return strategy.healthCheck === null;
                    default:
                        return true;
                }
            });
            return strategies;
        },
        []
    );

    const onFilter = useCallback(
        (newText: string, flags: Flags, health: string) => {
            console.time('timer');
            const hasFlags = flags.onlyWithWarnings;
            if (!hasFlags && newText.trim() === '' && health.trim() === '') {
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
                    })
                    .filter((item: Vault) => {
                        const healthFilteredStrategies =
                            filterStrategiesHealthCheck(item, health);
                        totalStrategiesFound += healthFilteredStrategies.length;
                        return healthFilteredStrategies.length > 0;
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
                <ProgressSpinnerBar label={`Total Vaults ${totalItems}...`} />
            )}
            <div style={{ height: '60vh', overflow: 'auto' }}>
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
            <StyledReportContainer>
                <Button
                    component={RouterLink}
                    to={`/network/${network}/report`}
                >
                    <StyledReportTitle>HealthCheck Report</StyledReportTitle>
                </Button>
            </StyledReportContainer>
        </>
    );
};

export const VaultsList = memo(_VaultsList);
