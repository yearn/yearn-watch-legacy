import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';

import CardContent from './CardContent';
import { ErrorAlert } from '../../common/Alerts';
import { GenLenderStrategy, Network, Strategy } from '../../../types';
import { displayAmount, displayAprAmount } from '../../../utils/commonUtils';
import { getError } from '../../../utils/error';
import { getGenLenderStrategy } from '../../../utils/strategies';
import { Box } from '@material-ui/core';
import EtherScanLink from '../../common/EtherScanLink';

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
    const [isLoading, setIsLoading] = useState(true);
    const [genLenderData, setGenLenderData] = useState<GenLenderStrategy>();
    const [error, setError] = useState('');

    useEffect(() => {
        const loadGenLenderData = async () => {
            try {
                const loadedGenLenderData = await getGenLenderStrategy(
                    strategy.address,
                    network
                );
                setGenLenderData(loadedGenLenderData);
                setIsLoading(false);
            } catch (e: unknown) {
                console.log('Error:', e);
                setIsLoading(false);
                setError(getError(e));
            }
        };
        loadGenLenderData();
    }, [strategy.address, network]);

    const renderData = () => {
        const lenderStatuses =
            genLenderData && genLenderData.lendStatuses ? (
                <>
                    {genLenderData.lendStatuses.map((value, index) => (
                        <Box
                            key={`lender_${value[0]}`}
                            sx={{
                                marginBottom:
                                    index ===
                                    genLenderData.lendStatuses.length - 1
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
                            <div>
                                APR: {displayAprAmount(value[2].toString())}%
                            </div>
                        </Box>
                    ))}
                </>
            ) : (
                ''
            );

        const lentTotalAssets = genLenderData
            ? displayAmount(
                  genLenderData.lentTotalAssets.toString(),
                  strategy.token.decimals
              )
            : '';

        const estimatedAPR = genLenderData
            ? displayAprAmount(genLenderData.estimatedAPR.toString())
            : '';

        const estimateAdjustPositionLowest = genLenderData
            ? genLenderData.estimateAdjustPosition[0].toString()
            : '';

        const estimateAdjustPositionHighest = genLenderData
            ? genLenderData.estimateAdjustPosition[2].toString()
            : '';

        const estimateAdjustPositionLowestAPR = genLenderData
            ? displayAprAmount(
                  genLenderData.estimateAdjustPosition[1].toString()
              )
            : '';

        const estimateAdjustPositionPotential = genLenderData
            ? displayAprAmount(
                  genLenderData.estimateAdjustPosition[3].toString()
              )
            : '';

        const data = [
            { key: 'Lender Statuses:', value: lenderStatuses },
            { key: 'Total Assets Lent:', value: lentTotalAssets },
            { key: 'Estimated APR', value: `${estimatedAPR}%` },
            { key: 'Lowest Lender:', value: estimateAdjustPositionLowest },
            { key: 'Highest Lender:', value: estimateAdjustPositionHighest },
            {
                key: 'Lowest APR:',
                value: `${estimateAdjustPositionLowestAPR}%`,
            },
            {
                key: 'Potential:',
                value: `${estimateAdjustPositionPotential}%`,
            },
        ];
        return <CardContent data={data} key={strategy.address} />;
    };

    return (
        <>
            {isLoading ? (
                <StyledTypography>Loading...</StyledTypography>
            ) : error ? (
                <ErrorAlert message={error} />
            ) : (
                renderData()
            )}
        </>
    );
};

export default GenLender;
