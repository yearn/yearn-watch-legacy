import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import sum from 'lodash/sum';
import Button from '@mui/material/Button';

import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';

import { Network, Vault } from '../../../types';
import SearchInput, { Flags } from '../SearchInput';
import { VaultItemList } from '../../app';
import { EMPTY_ADDRESS } from '../../../utils/commonUtils';
import { initRiskFrameworkScores } from '../../../utils/risk-framework';
import { getStrategyTVLsPerProtocol } from '../../../utils/strategiesHelper';
import { ProtocolTVL } from '../../../types/protocol-tvl';

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

    const filterStrategiesNotInRiskFramework = (
        vault: Vault,
        newText: string
    ) => {
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

    const onFilter = (newText: string, flags: Flags, health: string) => {
        // TODO remove me. items has strat ids
        console.log('1!!!!!!!!!!!');
        console.log(flags);
        console.log(
            !flags.onlyWithWarnings &&
                !flags.onlyMissingRisk &&
                newText.trim() === '' &&
                health.trim() === ''
        );
        if (
            !flags.onlyWithWarnings &&
            !flags.onlyMissingRisk &&
            newText.trim() === '' &&
            health.trim() === ''
        ) {
            setFilteredItems(items);
            setTotalStrategiesFound(getTotalStrategies(items));
        } else {
            let totalStrategiesFound = 0;
            console.log('2222222222222222');
            console.log(items);

            const filteredItems = items
                .filter((item: Vault) => {
                    const applyFlags =
                        !flags.onlyWithWarnings ||
                        (flags.onlyWithWarnings && !item.configOK);
                    return applyFlags;
                })
                .filter((item: Vault) => {
                    if (item.strategies.length > 0 && Math.random() < 0.5) {
                        console.log(item.strategies.length);
                        item.strategies.pop();
                        console.log('popped!' + item.name);
                    }
                })
                .filter((item: Vault) => {
                    // find all strategies in risk page that doesn't exist on homepage
                    const strategies = [];
                    if (flags.onlyWithWarnings) {
                        const riskGroups = initRiskFrameworkScores(network);
                        const protocols: Array<ProtocolTVL> = [];
                        const riskPromises = riskGroups.map(async (item) => {
                            const protocol = await getStrategyTVLsPerProtocol(
                                item.id,
                                item.criteria.nameLike,
                                network as Network,
                                item.criteria.strategies,
                                item.criteria.exclude // TODO exclude only strategies on front page
                            );
                            //console.log(protocol);
                            // protocols.push(protocol);
                            return protocol.strategies.map((s) => s.address);
                        });
                        Promise.all(riskPromises);
                    } else {
                        return true;
                    }
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
