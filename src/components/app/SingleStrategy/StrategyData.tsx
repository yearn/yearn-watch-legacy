import Chip from '@material-ui/core/Chip';

import EtherScanLink from '../../common/EtherScanLink';
import { formatBPS, displayAmount } from '../../../utils/commonUtils';
import CardContent from './CardContent';

export const SingleData = (props: any) => {
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
    const estimatedAsset = strategy
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
    const data = [
        { name: 'API Version:', strategyName: apiVersion },
        { name: ' Activation Date', strategyName: activationDate },
        { name: ' Time Since Last Harvest:', strategyName: lastReportText },
        { name: ' Emergency exit:', strategyName: emergencyExit },
        { name: ' Active:', strategyName: isActive },
        { name: ' Total Estimated Assets:', strategyName: estimatedAsset },
        { name: ' Credit Available:', strategyName: creditAvailable },
        { name: ' Debt Outstanding:', strategyName: debtOutstanding },
        { name: ' Debt Ratio:', strategyName: debtRatio },
        { name: 'Total Debt::', strategyName: totalDebt },
        { name: ' Total Gain:', strategyName: totalGain },
        { name: ' Total Loss:', strategyName: totalLoss },
        { name: ' Expected Return:', strategyName: expectReturn },
        { name: ' Performance Fee:', strategyName: performanceFee },
        { name: ' Rate Limit:', strategyName: rateLimit },
        { name: ' Min Debt Per Harvest:', strategyName: minDebtPerHarvest },
        { name: ' Max Debt Per Harvest:', strategyName: maxDebtPerHarvest },
        { name: ' Keeper:', strategyName: keeper },
        { name: ' Rewards:', strategyName: rewards },
        { name: ' Strategist:', strategyName: strategist },
        { name: ' Vault:', strategyName: vaults },
    ];
    return <CardContent data={data} />;
};

export default SingleData;
