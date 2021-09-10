import React from 'react';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Highcharts from 'highcharts';

import HighchartsReact from 'highcharts-react-official';

import { Vault } from '../../../../types';
import { getChartData } from '../../../../utils/strategyParams';
import BarChart from './BarChart';

interface PieProps {
    vault: Vault;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme?: any;
}
interface TabPanelProps {
    children?: React.ReactNode;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    index: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
const Pie = (props: PieProps) => {
    const { vault } = props;
    const [value, setValue] = React.useState(0);
    const DATA_CHART = getChartData(vault);
    const options = {
        chart: {
            backgroundColor: 'transparent',

            type: 'pie',
        },

        title: {
            text: `${vault.name} Debt Allocation`,
            style: {
                color: `${props.theme === 'light' ? 'black' : 'white'}`,
                position: 'absolute',
            },
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
                        color: `${props.theme === 'light' ? 'black' : 'white'}`,
                    },
                },
            },
        },
        series: [
            {
                name: 'Strategies',
                colorByPoint: true,
                data: DATA_CHART,
            },
        ],
    };

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };
    return (
        <div>
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
            >
                <Tab label="Pie chart" />
                <Tab label="Bar chart" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <BarChart data={DATA_CHART} />
                {console.log('getChartData(vault)', getChartData(vault))}
            </TabPanel>
        </div>
    );
};

export default Pie;
