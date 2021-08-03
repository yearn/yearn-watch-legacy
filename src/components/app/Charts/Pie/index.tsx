import React from 'react';
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
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
        },
        title: {
            text: `${vault.name} Debt Allocation`,
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
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

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default Pie;
