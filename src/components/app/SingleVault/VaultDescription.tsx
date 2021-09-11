import React from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Chip from '@material-ui/core/Chip';

import TokenPrice from '../../common/TokenPrice';
import { checkLabel } from '../../../utils/checks';
import { formatBPS, displayAmount, sub } from '../../../utils/commonUtils';
import Table from '../../common/Table';
import ProgressBars from '../../common/ProgressBar';
import { Vault } from '../../../types';
import { LabelTypography, SubTitle } from '../../common/Labels';

interface VaultDescriptionProps {
    vault: Vault | undefined;
    isLoading: boolean;
}
const StyledTableRow = styled(TableRow)`
    && {
        background-color: ${({ theme }) => theme.body} !important;
    }
`;
const StyledTableCell = styled(TableCell)`
    && {
        /* color: ${({ theme }) => theme.title} !important; */
        border-bottom: 1px solid ${({ theme }) => theme.border} !important;
    }
`;
const renderErrors = (vault: Vault) =>
    vault &&
    vault.configErrors &&
    vault.configErrors.map((message: string) => {
        return (
            <div key={message} style={{ color: '#ff6c6c' }}>
                {message}
            </div>
        );
    });
export const VaultDescription = (props: VaultDescriptionProps) => {
    const { vault } = props;

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
    const vault_list = vault
        ? `Deposit limit :
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
    return (
        <React.Fragment>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle> API Version:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                <LabelTypography>{api_version}</LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <StyledTableCell>
                                <LabelTypography>{api_version}</LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle> Emergency shut down:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />{' '}
                                <LabelTypography>
                                    {emergency_shut_down}
                                </LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                <LabelTypography>
                                    {emergency_shut_down}
                                </LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Governance:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                {' '}
                                <br />
                                <LabelTypography>{governance}</LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                <LabelTypography>{governance}</LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Management:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                {' '}
                                <br />
                                <LabelTypography>{management}</LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <StyledTableCell>
                                {' '}
                                <LabelTypography>{management}</LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Guardian:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                <LabelTypography>{guardian}</LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                {' '}
                                <LabelTypography>
                                    {guardian}
                                </LabelTypography>{' '}
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Rewards:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                <LabelTypography>{rewards}</LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                {' '}
                                <LabelTypography>
                                    {rewards}
                                </LabelTypography>{' '}
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Assets:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                {' '}
                                <br />
                                <LabelTypography>
                                    Total asset:
                                    {total_asset}
                                </LabelTypography>
                                <ProgressBars vault={vault} />
                                <LabelTypography>{vault_list}</LabelTypography>
                            </MediaQuery>
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <StyledTableCell>
                                <LabelTypography>
                                    {' '}
                                    Total asset:
                                    {total_asset}
                                </LabelTypography>
                                <ProgressBars vault={vault} />
                                <LabelTypography>{vault_list}</LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    {vault ? (
                        <TokenPrice
                            label="Total Assets (USD):"
                            token={vault.token}
                            amount={vault.totalAssets}
                        />
                    ) : (
                        ''
                    )}
                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Management fee:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                <LabelTypography>
                                    {' '}
                                    {management_fee} %
                                </LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                {' '}
                                <LabelTypography>
                                    {management_fee}%
                                </LabelTypography>{' '}
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Performance fee:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                <LabelTypography>
                                    {performance_fee}%
                                </LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                <LabelTypography>
                                    {performance_fee}%
                                </LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle> Time Since Last Report:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                <LabelTypography>
                                    {last_report_text}
                                </LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                <LabelTypography>
                                    {last_report_text}
                                </LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Total Debt:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />{' '}
                                <LabelTypography>{total_debt}</LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                <LabelTypography>{total_debt}</LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>{`(Total Asset - Total Debt):`}</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />{' '}
                                <LabelTypography>
                                    {' '}
                                    {unallocated}
                                </LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                <LabelTypography>
                                    {' '}
                                    {unallocated}
                                </LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Total Debt Ratio:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />{' '}
                                <LabelTypography>{debt_ratio}%</LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                {' '}
                                <LabelTypography>
                                    {debt_ratio}%
                                </LabelTypography>{' '}
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            <SubTitle>Debt Usage:</SubTitle>
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />{' '}
                                <LabelTypography>{debt_usage}%</LabelTypography>
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                {' '}
                                <LabelTypography>
                                    {' '}
                                    {debt_usage}%{' '}
                                </LabelTypography>
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    {vault && vault.configOK === false ? (
                        <StyledTableRow
                            style={{
                                border: '2px solid #ff6c6c',
                            }}
                        >
                            <StyledTableCell>
                                <SubTitle>Config Warnings:</SubTitle>
                                <MediaQuery query="(max-device-width: 1224px)">
                                    {' '}
                                    <br />{' '}
                                    <LabelTypography>
                                        {render_error}
                                    </LabelTypography>
                                </MediaQuery>{' '}
                            </StyledTableCell>
                            <MediaQuery query="(min-device-width: 1224px)">
                                {' '}
                                <StyledTableCell>
                                    <LabelTypography>
                                        {render_error}
                                    </LabelTypography>{' '}
                                    {render_error}
                                </StyledTableCell>
                            </MediaQuery>
                        </StyledTableRow>
                    ) : null}
                </TableHead>
            </Table>
        </React.Fragment>
    );
};
