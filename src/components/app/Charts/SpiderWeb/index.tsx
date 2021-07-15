import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';

interface SpiderWebProps {
    values: Array<{ value: number; label: string }>;
    title: string;
    seriesTitle: string;
}

HighchartsMore(Highcharts);

export const SpiderWeb = (props: SpiderWebProps) => {
    const { values } = props;

    const options = {
        chart: {
            polar: true,
        },
        title: {
            text: props.title,
            x: -80,
        },
        pane: {
            size: '80%',
        },
        tooltip: {
            shared: true,
            pointFormat:
                '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f} points</b><br/>',
        },
        xAxis: {
            categories: values.map((value) => value.label),
            tickmarkPlacement: 'on',
            lineWidth: 0,
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
        },
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
        },
        series: [
            {
                name: props.seriesTitle,
                data: values.map((value) => value.value),
                pointPlacement: 'on',
            },
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500,
                    },
                    chartOptions: {
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                        },
                        pane: {
                            size: '70%',
                        },
                    },
                },
            ],
        },
    };

    return (
        <div>
            <HighchartsReact
                allowChartUpdate={false}
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};
