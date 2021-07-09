import React from 'react';
import MediaQuery from 'react-responsive';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

import TokenPrice from '../../common/TokenPrice';
import { checkLabel } from '../../../utils/checks';
import { formatBPS, displayAmount, sub } from '../../../utils/commonUtils';
import Table from '../../common/Table';
import ProgressBars from '../../common/ProgressBar';
import { Vault } from '../../../types';

interface VaultDescriptionProps {
    vault: Vault | undefined;
    isLoading: boolean;
}

export const VaultDescription = (props: VaultDescriptionProps) => {
    const { vault } = props;

    const renderErrors = () =>
        vault &&
        vault.configErrors &&
        vault.configErrors.map((message: string) => {
            return (
                <div key={message} style={{ color: '#ff6c6c' }}>
                    {message}
                </div>
            );
        });
    const api_version = vault ? vault.apiVersion : '';
    const emergency_shut_down =
        vault && vault.emergencyShutdown === false ? (
            <Chip
                label="ok"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: 'rgba(1,201,147,1)',
                }}
            />
        ) : (
            <Chip
                label="Emergency"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: '#ff6c6c',
                }}
            />
        );
    const rewards = vault ? checkLabel(vault.rewards) : '';
    const governance = vault ? checkLabel(vault.governance) : '';
    const management = vault ? checkLabel(vault.management) : '';
    const guardian = vault ? checkLabel(vault.guardian) : '';
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
    const vault_list = vault ? (
        <Typography variant="body2" color="textSecondary">
            {' '}
            Deposit limit :
            {displayAmount(vault.depositLimit, vault.token.decimals) +
                '  ' +
                vault.token.symbol}
        </Typography>
    ) : (
        ''
    );
    const management_fee = vault ? formatBPS(vault.managementFee) : '';
    const performance_fee = vault ? formatBPS(vault.performanceFee) : '';
    const debt_usage = vault ? formatBPS(vault.debtUsage) : '';
    const debt_ratio = vault ? formatBPS(vault.debtRatio) : '';
    const last_report_text = vault ? vault.lastReportText : '';
    const render_error = vault ? renderErrors() : '';
    return (
        <React.Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            API Version:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {api_version}
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{api_version}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Emergency shut down:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {emergency_shut_down}
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{emergency_shut_down}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Governance:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {' '}
                                <br />
                                {governance}
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{governance}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Management:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {' '}
                                <br />
                                {management}
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>{management}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Guardian:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {guardian}
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{guardian}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Rewards:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {rewards}
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{rewards}</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Assets:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {' '}
                                <br />
                                Total asset:
                                {total_asset}
                                <ProgressBars vault={vault} />
                                {vault_list}
                            </MediaQuery>
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <TableCell>
                                Total asset:
                                {total_asset}
                                <ProgressBars vault={vault} />
                                {vault_list}
                            </TableCell>
                        </MediaQuery>
                    </TableRow>
                    {vault ? (
                        <TokenPrice
                            label="Total Assets (USD):"
                            token={vault.token}
                            amount={vault.totalAssets}
                        />
                    ) : (
                        ''
                    )}
                    <TableRow>
                        <TableCell>
                            Management fee:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {management_fee} %
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{management_fee}%</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Performance fee:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {performance_fee}%
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{performance_fee}%</TableCell>
                        </MediaQuery>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Time Since Last Report:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {last_report_text}
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{last_report_text}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Total Debt:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {total_debt}
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{total_debt}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            {`(Total Asset - Total Debt):`}
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {unallocated}
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{unallocated}</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Total Debt Ratio:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {debt_ratio}%
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{debt_ratio}%</TableCell>
                        </MediaQuery>
                    </TableRow>

                    <TableRow>
                        <TableCell>
                            Debt Usage:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {debt_usage}%
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{debt_usage}%</TableCell>
                        </MediaQuery>
                    </TableRow>

                    {vault && vault.configOK === false ? (
                        <TableRow
                            style={{
                                border: '2px solid #ff6c6c',
                            }}
                        >
                            <TableCell>
                                Config Warnings:
                                <MediaQuery query="(max-device-width: 1224px)">
                                    {' '}
                                    <br /> {render_error}
                                </MediaQuery>{' '}
                            </TableCell>
                            <MediaQuery query="(min-device-width: 1224px)">
                                {' '}
                                <TableCell>{render_error}</TableCell>
                            </MediaQuery>
                        </TableRow>
                    ) : null}
                </TableHead>
            </Table>
        </React.Fragment>
    );
};
