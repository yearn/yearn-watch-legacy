import { useState, useEffect, useRef } from 'react';
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
    moreToLoad: boolean;
    network: Network;
};

const getTotalStrategies = (items: Vault[]): number =>
    sum(items.map((item) => item.strategies.length));

export const VaultsList = (props: VaultsListProps) => {
    const { moreToLoad, items, network } = props;
    const [filteredItems, setFilteredItems] = useState(items);
    const totalStrategies = getTotalStrategies(items);
    const [totalStrategiesFound, setTotalStrategiesFound] =
        useState(totalStrategies);
    const refItems = useRef(items);

    if (items.length === 0) {
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

    const filterStrategiesHealthCheck = (vault: Vault, health: string) => {
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
    };

    // It's important to use refItems and not items because items will be within a stale scope that wont be updated
    const onFilter = (newText: string, flags: Flags, health: string) => {
        if (
            !flags.onlyWithWarnings &&
            !flags.onlyMissingRisk &&
            newText.trim() === '' &&
            health.trim() === ''
        ) {
            setFilteredItems(refItems.current);
            setTotalStrategiesFound(getTotalStrategies(refItems.current));
        } else {
            let totalStrategiesFound = 0;
            const filteredItems = refItems.current
                .filter((item: Vault) => {
                    const applyFlags =
                        !flags.onlyWithWarnings ||
                        (flags.onlyWithWarnings && !item.configOK);
                    return applyFlags;
                })
                .filter((item: Vault) => {
                    const applyFlags =
                        !flags.onlyMissingRisk ||
                        (flags.onlyMissingRisk && !item.checkRiskOk);
                    return applyFlags;
                })
                .filter((item: Vault) => {
                    const filteredStrategies = filterStrategies(item, newText);
                    const hasVaultStrategies = filteredStrategies.length > 0;

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
    };

    useEffect(() => {
        refItems.current = items;
        setFilteredItems(items);
        const totalStrategies = getTotalStrategies(items);
        setTotalStrategiesFound(totalStrategies);
    }, [items, totalStrategies]);

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

            {moreToLoad && <ProgressSpinnerBar label={`all vaults...`} />}
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

export default VaultsList;
