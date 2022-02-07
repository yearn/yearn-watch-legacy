import styled from 'styled-components';
import { BigNumber } from 'ethers';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import CardContent from './CardContent';
import { ErrorAlert } from '../../common/Alerts';
import { LendStatus, Network, Strategy } from '../../../types';
import { displayAmount, displayAprAmount } from '../../../utils/commonUtils';
import EtherScanLink from '../../common/EtherScanLink';
import { useStrategyGenLender } from '../../../hooks';

const StyledTypography = styled(Typography)`
    && {
        color: ${({ theme }) => theme.title};
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }
`;

type GenLenderProps = {
    strategy: Strategy;
    network: Network;
};

export const GenLender = (props: GenLenderProps) => {
    const { strategy, network } = props;
    const { data, loading, error } = useStrategyGenLender(
        network,
        strategy.address
    );

    const getLowestApr = (
        lendStatuses: LendStatus[],
        lowestApr: BigNumber,
        lowestIdx: BigNumber
    ): BigNumber => {
        // If there are no assets lent, the lowestApr returned may be
        // unreasonably high and we should use the actual lender value
        const lenderLowest = lendStatuses[Number(lowestIdx)][2];
        if (Number(lowestApr) > Number(lenderLowest)) {
            return lenderLowest;
        }
        return lowestApr;
    };

    const getLenderName = (
        lendStatuses: LendStatus[],
        index: BigNumber
    ): string => {
        if (Number(index) >= lendStatuses.length) {
            return '';
        }
        const name = lendStatuses[Number(index)][0];
        return `${name} (${index.toString()})`;
    };

    const renderData = () => {
        if (!data) {
            return <Box>No data available</Box>;
        }

        const lenderStatuses = (
            <>
                {data.lendStatuses.map((value, index) => (
                    <Box
                        key={`lender_${value[0]}`}
                        sx={{
                            marginBottom:
                                index === data.lendStatuses.length - 1
                                    ? '0'
                                    : '20px',
                        }}
                    >
                        <div>
                            <div>{value[0]}</div>
                            <EtherScanLink
                                address={value[3]}
                                network={network}
                            />
                        </div>
                        <div>
                            {'  '}Deposits:{' '}
                            {displayAmount(
                                value[1].toString(),
                                strategy.token.decimals
                            )}
                        </div>
                        <div>APR: {displayAprAmount(value[2].toString())}</div>
                    </Box>
                ))}
            </>
        );

        const lentTotalAssets = displayAmount(
            data.lentTotalAssets.toString(),
            strategy.token.decimals
        );

        const estimatedAPR = displayAprAmount(data.estimatedAPR.toString());
        const estimateAdjustPositionLowest = getLenderName(
            data.lendStatuses,
            data.estimateAdjustPosition[0]
        );
        const estimateAdjustPositionHighest = getLenderName(
            data.lendStatuses,
            data.estimateAdjustPosition[2]
        );

        const lowestApr = getLowestApr(
            data.lendStatuses,
            data.estimateAdjustPosition[1],
            data.estimateAdjustPosition[0]
        ).toString();
        const estimateAdjustPositionLowestAPR = displayAprAmount(lowestApr);
        const estimateAdjustPositionPotential = displayAprAmount(
            data.estimateAdjustPosition[3].toString()
        );

        const cardData = [
            { key: 'Lender Statuses:', value: lenderStatuses },
            { key: 'Total Assets Lent:', value: lentTotalAssets },
            { key: 'Estimated APR', value: estimatedAPR },
            { key: 'Lowest Lender:', value: estimateAdjustPositionLowest },
            { key: 'Highest Lender:', value: estimateAdjustPositionHighest },
            {
                key: 'Lowest APR:',
                value: estimateAdjustPositionLowestAPR,
            },
            {
                key: 'Potential APR:',
                value: estimateAdjustPositionPotential,
            },
        ];
        return <CardContent data={cardData} key={strategy.address} />;
    };

    if (loading && !data) {
        return <StyledTypography>Loading...</StyledTypography>;
    }
    if (error) {
        return <ErrorAlert message={error} />;
    }
    return renderData();
};

export default GenLender;
