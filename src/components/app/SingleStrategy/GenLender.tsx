import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';

import CardContent from './CardContent';
import { ErrorAlert } from '../../common/Alerts';
import { GenLenderStrategy, Network, Strategy } from '../../../types';
import { displayAmount, displayAprAmount } from '../../../utils/commonUtils';
import { getError } from '../../../utils/error';
import { getGenLenderStrategy } from '../../../utils/strategies';

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
        const estimateAdjustPosition = genLenderData
            ? genLenderData.estimateAdjustPosition.toString()
            : '';

        const estimatedAPR = genLenderData
            ? displayAprAmount(genLenderData.estimatedAPR.toString())
            : '';

        const lentTotalAssets = genLenderData
            ? displayAmount(
                  genLenderData.lentTotalAssets.toString(),
                  strategy.token.decimals
              )
            : '';

        const data = [
            { key: 'Estimate Adjust Position:', value: estimateAdjustPosition },
            { key: 'Estimated APR', value: `${estimatedAPR}%` },
            { key: 'Total Assets Lent:', value: lentTotalAssets },
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
