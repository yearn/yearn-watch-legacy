import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Vault } from '../../../../types';
import { getChartData } from '../../../../utils/strategyParams';

interface PieProps {
    vault: Vault;
}

const Pie = (props: PieProps) => {
    const { vault } = props;

    const options = {
        chart: {
            backgroundColor: 'transparent',

            type: 'pie',
        },

        title: {
            text: `${vault.name} Debt Allocation`,
            style: { color: '#80699B', position: 'absolute' },
        },
        colors: [
            '#4572A7',
            '#AA4643',
            '#89A54E',
            '#80699B',
            '#3D96AE',
            '#DB843D',
            '#92A8CD',
            '#A47D7C',
            '#B5CA92',
        ],
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
            style: { color: '#4572A7', position: 'absolute' },
        },
        accessibility: {
            point: {
                valueSuffix: '%',
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                    style: {
                        color: '#A47D7C',
                    },
                },
            },
        },
        series: [
            {
                name: 'Strategies',
                colorByPoint: true,
                data: getChartData(vault),
            },
        ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default Pie;
