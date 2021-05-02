import React from 'react';
import MediaQuery from 'react-responsive';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

import { checkLabel } from '../../../utils/checks';
import { formatBPS, displayAmount } from '../../../utils/commonUtils';
import Table from '../../common/Table';
import ProgressBars from '../../common/ProgressBar';

export const VaultDescription = (v: any, isLoading: boolean) => {
    const vault = v.vault;

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
    const governance = vault ? checkLabel(vault.governance) : '';
    const management = vault ? checkLabel(vault.management) : '';
    const guardian = vault ? checkLabel(vault.guardian) : '';
    const total_asset =
        vault &&
        displayAmount(vault.totalAssets, vault.token.decimals) +
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
    const deb_usage = vault ? formatBPS(vault.debtUsage) : '';
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
                            Debt Usage:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {deb_usage}%
                            </MediaQuery>{' '}
                        </TableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <TableCell>{deb_usage}%</TableCell>
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
