import Chip from '@material-ui/core/Chip';

import EtherScanLink from '../../common/EtherScanLink';
import { formatBPS, displayAmount } from '../../../utils/commonUtils';
import CardContent from './CardContent';
import { Strategy } from '../../../types';
import TokenPrice from '../../common/TokenPrice';

type StrategyDetailProps = {
    strategy: Strategy;
};
export const StrategyDetail = (props: StrategyDetailProps) => {
    const { strategy } = props;

    const apiVersion = strategy ? strategy.apiVersion : '';
    const activationDate = strategy ? strategy.params.activation : '';
    const lastReportText = strategy ? strategy.params.lastReportText : '';
    const emergencyExit =
        strategy && strategy.emergencyExit === false ? (
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
    const isActive =
        strategy && strategy.isActive === true ? (
            <Chip
                label="true"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: 'rgba(1,201,147,1)',
                }}
            />
        ) : (
            <Chip
                label="false"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: '#ff6c6c',
                }}
            />
        );

    const estimatedAsset =
        strategy && strategy.estimatedTotalAssets
            ? displayAmount(
                  strategy.estimatedTotalAssets.toString(),
                  strategy.token.decimals
              )
            : '';
    const creditAvailable = strategy
        ? displayAmount(
              strategy.creditAvailable.toString(),
              strategy.token.decimals
          )
        : '';
    const debtOutstanding = strategy
        ? displayAmount(
              strategy.debtOutstanding.toString(),
              strategy.token.decimals
          )
        : '';
    const debtRatio = strategy
        ? formatBPS(strategy.params.debtRatio.toString())
        : '';
    const totalDebt = strategy
        ? displayAmount(
              strategy.params.totalDebt.toString(),
              strategy.token.decimals
          )
        : '';
    const totalGain = strategy
        ? displayAmount(
              strategy.params.totalGain.toString(),
              strategy.token.decimals
          )
        : '';
    const totalLoss = strategy
        ? displayAmount(
              strategy.params.totalLoss.toString(),
              strategy.token.decimals
          )
        : '';
    const expectReturn = strategy
        ? displayAmount(
              strategy.expectedReturn.toString(),
              strategy.token.decimals
          )
        : '';
    const performanceFee = strategy
        ? formatBPS(strategy.params.performanceFee.toString())
        : '';
    const rateLimit =
        strategy && strategy.params.rateLimit
            ? displayAmount(
                  strategy.params.rateLimit.toString(),
                  strategy.token.decimals
              )
            : 'N/A';
    const minDebtPerHarvest =
        strategy && strategy.params.minDebtPerHarvest
            ? displayAmount(
                  strategy.params.minDebtPerHarvest.toString(),
                  strategy.token.decimals
              )
            : 'N/A';
    const maxDebtPerHarvest =
        strategy && strategy.params.maxDebtPerHarvest
            ? displayAmount(
                  strategy.params.maxDebtPerHarvest.toString(),
                  strategy.token.decimals
              )
            : 'N/A';
    const keeper = strategy ? <EtherScanLink address={strategy.keeper} /> : '';
    const rewards = strategy ? (
        <EtherScanLink address={strategy.rewards} />
    ) : (
        ''
    );
    const strategist = strategy ? (
        <EtherScanLink address={strategy.strategist} />
    ) : (
        ''
    );
    const vaults = strategy ? <EtherScanLink address={strategy.vault} /> : '';
    const tokenPrice = (
        <TokenPrice
            label="Total Estimated Assets (USD):"
            token={strategy.token}
            amount={strategy.estimatedTotalAssets}
        />
    );
    const data = [
        { key: 'API Version:', value: apiVersion },
        { key: ' Activation Date', value: activationDate },
        { key: ' Time Since Last Harvest:', value: lastReportText },
        { key: ' Emergency exit:', value: emergencyExit },
        { key: ' Active:', value: isActive },
        { key: ' Total Estimated Assets:', value: estimatedAsset },
        {
            key: ' Total Estimated Assets (USD):',
            value: tokenPrice,
            render: true,
        },
        { key: ' Credit Available:', value: creditAvailable },
        { key: ' Debt Outstanding:', value: debtOutstanding },
        { key: ' Debt Ratio:', value: debtRatio },
        { key: ' Total Debt:', value: totalDebt },
        { key: ' Total Gain:', value: totalGain },
        { key: ' Total Loss:', value: totalLoss },
        { key: ' Expected Return:', value: expectReturn },
        { key: ' Performance Fee:', value: performanceFee },
        { key: ' Rate Limit:', value: rateLimit },
        { key: ' Min Debt Per Harvest:', value: minDebtPerHarvest },
        { key: ' Max Debt Per Harvest:', value: maxDebtPerHarvest },
        { key: ' Keeper:', value: keeper },
        { key: ' Rewards:', value: rewards },
        { key: ' Strategist:', value: strategist },
        { key: ' Vault:', value: vaults },
    ];
    return <CardContent data={data} />;
};

export default StrategyDetail;
