import Chip from '@material-ui/core/Chip';
import EtherScanLink from '../../common/EtherScanLink';
import CardContent from './CardContent';
import { Strategy } from '../../../types';

type StrategyHealthCheckProps = {
    strategy: Strategy;
};
export const StrategyHealthCheck = (props: StrategyHealthCheckProps) => {
    const { strategy } = props;
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
        />
    ) : (
        ''
    );
    const data = [
        { key: 'Health Check Address:', value: healthCheckAddress },
        { key: 'Do Next Health Check', value: doHealthCheck },
    ];
    return <CardContent data={data} />;
};

export default StrategyHealthCheck;
