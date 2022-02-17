import styled from 'styled-components';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import EtherScanLink from '../../common/EtherScanLink';
import CardContent from './CardContent';
import { Network, Strategy } from '../../../types';

const StyledTypography = styled(Typography)`
    && {
        color: ${({ theme }) => theme.title};
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }
`;

type StrategyHealthCheckProps = {
    strategy: Strategy;
    network: Network;
};
export const StrategyHealthCheck = (props: StrategyHealthCheckProps) => {
    const { strategy, network } = props;
    const doHealthCheck =
        strategy && strategy.doHealthCheck ? (
            <Chip
                label="enabled"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: 'rgba(1,201,147,1)',
                }}
            />
        ) : (
            <Chip
                label="disabled"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: '#ff6c6c',
                }}
            />
        );
    const healthCheckAddress = strategy ? (
        <EtherScanLink
            address={strategy.healthCheck ? strategy.healthCheck : undefined}
            network={network}
        />
    ) : (
        ''
    );
    const data = [
        { key: 'Health Check Address:', value: healthCheckAddress },
        { key: 'Do Next Health Check', value: doHealthCheck },
    ];
    return strategy.healthCheck === null ? (
        <StyledTypography>{'Not Supported'}</StyledTypography>
    ) : (
        <CardContent data={data} key={strategy.address + '-health'} />
    );
};

export default StrategyHealthCheck;
