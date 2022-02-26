import React from 'react';
import Chip from '@mui/material/Chip';
import { formatBPS, displayAmount, sub } from '../../../utils/commonUtils';
import { Network, Vault } from '../../../types';
import getNetworkConfig from '../../../utils/config';
import { Box, Grid, Typography, useTheme } from '@mui/material';

type VaultDescriptionProps = {
    vault?: Vault;
    isLoading: boolean;
    network: Network;
};

const renderErrors = (vault: Vault) =>
    vault &&
    vault.configErrors &&
    vault.configErrors.map((message: string) => {
        return (
            <Box key={message} style={{ color: '#ff6c6c' }}>
                {message}
            </Box>
        );
    });

export const VaultDescription = (props: VaultDescriptionProps) => {
    const { vault, network } = props;
    const networkConfig = getNetworkConfig(network);

    const theme = useTheme();

    const api_version = vault ? vault.apiVersion : '';
    const emergency_shut_down =
        vault && vault.emergencyShutdown === false ? (
            <Chip
                label="ok"
                clickable
                size="small"
                style={{
                    color: '#fff',
                    backgroundColor: 'rgba(1,201,147,1)',
                }}
            />
        ) : (
            <Chip
                label="Emergency"
                clickable
                size="small"
                style={{
                    color: '#fff',
                    backgroundColor: '#ff6c6c',
                }}
            />
        );
    const rewards = vault
        ? networkConfig.treasury.getEnsOrAddress(vault.rewards)
        : '';
    const governance = vault
        ? networkConfig.governance.getEnsOrAddress(vault.governance)
        : '';
    const management = vault
        ? networkConfig.management.getEnsOrAddress(vault.management)
        : '';
    const guardian = vault
        ? networkConfig.guardian.getEnsOrAddress(vault.guardian)
        : '';
    const total_asset =
        vault &&
        displayAmount(vault.totalAssets, vault.token.decimals) +
            '  ' +
            vault.token.symbol;
    const total_debt =
        vault &&
        displayAmount(vault.totalDebt, vault.token.decimals) +
            '  ' +
            vault.token.symbol;
    const unallocated =
        vault &&
        displayAmount(
            sub(vault.totalAssets, vault.totalDebt),
            vault.token.decimals
        ) +
            '  ' +
            vault.token.symbol;
    const vault_list = vault
        ? `
            ${
                displayAmount(vault.depositLimit, vault.token.decimals) +
                '  ' +
                vault.token.symbol
            }`
        : '';
    const management_fee = vault ? formatBPS(vault.managementFee) : '';
    const performance_fee = vault ? formatBPS(vault.performanceFee) : '';
    const debt_usage = vault ? formatBPS(vault.debtUsage) : '';
    const debt_ratio = vault ? formatBPS(vault.debtRatio) : '';
    const last_report_text = vault ? vault.lastReportText : '';
    const render_error = vault ? renderErrors(vault) : '';

    const renderKeyValue = (
        title: string,
        subtitle: JSX.Element[] | JSX.Element | string | undefined
    ) => {
        return (
            <Grid container marginY={theme.spacing(2)}>
                <Grid item xs={12} md={6} margin="auto">
                    <Typography variant="caption">{title}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    {subtitle}
                </Grid>
            </Grid>
        );
    };

    return (
        <Box>
            <Box paddingBottom={theme.spacing(1)}>
                {renderKeyValue(
                    'API Version',
                    <Typography variant="body2">{api_version}</Typography>
                )}
                {renderKeyValue(
                    'Emergency shut down',
                    <Typography variant="body2">
                        {emergency_shut_down}
                    </Typography>
                )}
                {renderKeyValue(
                    'Time Since Last Report',
                    <Typography variant="body2">{last_report_text}</Typography>
                )}
                {renderKeyValue(
                    'Management Fee',
                    <Typography variant="body2">{management_fee}%</Typography>
                )}
                {renderKeyValue(
                    'Performance Fee',
                    <Typography variant="body2">{performance_fee}%</Typography>
                )}
            </Box>
            <Box paddingBottom={theme.spacing(1)}>
                {renderKeyValue(
                    'Total Asset',
                    <Typography variant="body2">{total_asset}</Typography>
                )}
                {renderKeyValue(
                    'Deposit Limit',
                    <Typography variant="body2">{vault_list}</Typography>
                )}
                {renderKeyValue(
                    'Total Debt',
                    <Typography variant="body2">{total_debt}</Typography>
                )}
                {renderKeyValue(
                    'Total Asset - Total Debt',
                    <Typography variant="body2">{unallocated}</Typography>
                )}
                {renderKeyValue(
                    'Total Debt Ratio',
                    <Typography variant="body2">{debt_ratio}%</Typography>
                )}
                {renderKeyValue(
                    'Total Debt Usage',
                    <Typography variant="body2">{debt_usage}%</Typography>
                )}
            </Box>
            <Box paddingBottom={theme.spacing(1)}>
                {renderKeyValue(
                    'Management',
                    <Typography variant="body2">{management}</Typography>
                )}
                {renderKeyValue(
                    'Governance',
                    <Typography variant="body2">{governance}</Typography>
                )}
                {renderKeyValue(
                    'Guardian',
                    <Typography variant="body2">{guardian}</Typography>
                )}
                {renderKeyValue(
                    'Rewards',
                    <Typography variant="body2">{rewards}</Typography>
                )}
                {vault &&
                    vault.configOK === false &&
                    renderKeyValue(
                        'Config Warnings',
                        <Typography variant="body2">{render_error}</Typography>
                    )}
            </Box>
        </Box>
    );
};
