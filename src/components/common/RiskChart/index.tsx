/* eslint-disable react/display-name */
import { Link } from 'react-router-dom';
import { GenericList, GenericListItem } from '../../app/GenericList';
import { CellPosition, HeadCell } from '../../app/GenericList/HeadCell';
import { colors, getSemaphoreInfo } from '../Semaphore';

const splitString = (
    item: string,
    separator: string,
    defaultList: string[]
) => {
    return item === '' ? defaultList : item.split(separator);
};

type GroupQueryLinkProps = {
    key: string;
    group: string;
    grouping: string;
};
const GroupQueryLink = (props: GroupQueryLinkProps) => {
    const { group, key, grouping } = props;
    if (group === '-') {
        return <li key={key}>{group}</li>;
    }
    return (
        <li key={key}>
            <Link to={`/query/${grouping}/group/${group}`} target="_blank">
                {group}
            </Link>
        </li>
    );
};

export const headCells: HeadCell[] = [
    {
        id: 'label',
        numeric: true,
        disablePadding: false,
        label: 'Impact',
        align: 'center',
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Rare (1)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groups = splitString(item.rareLabels.toString(), ',', ['-']);

            return (
                <ol>
                    {groups.map((group, index) => (
                        <GroupQueryLink
                            key={`rare-${position.columnNumber}-${position.rowNumber}`}
                            group={group}
                            grouping={item.grouping.toString()}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                backgroundColor: colors[4][5 - position.rowNumber],
            };
        },
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Unlikely (2)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groups = splitString(item.unlikelyLabels.toString(), ',', [
                '-',
            ]);
            return (
                <ol>
                    {groups.map((group, index) => (
                        <GroupQueryLink
                            key={`unlikely-${position.columnNumber}-${position.rowNumber}`}
                            group={group}
                            grouping={item.grouping.toString()}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                backgroundColor: colors[3][5 - position.rowNumber],
            };
        },
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Even Chance (3)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groups = splitString(item.evenChanceLabels.toString(), ',', [
                '-',
            ]);
            return (
                <ol>
                    {groups.map((group, index) => (
                        <GroupQueryLink
                            key={`even-chance-${position.columnNumber}-${position.rowNumber}`}
                            group={group}
                            grouping={item.grouping.toString()}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                backgroundColor: colors[2][5 - position.rowNumber],
            };
        },
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Likely (4)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groups = splitString(item.likelyLabels.toString(), ',', [
                '-',
            ]);
            return (
                <ol>
                    {groups.map((group, index) => (
                        <GroupQueryLink
                            key={`likely-${position.columnNumber}-${position.rowNumber}`}
                            group={group}
                            grouping={item.grouping.toString()}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                backgroundColor: colors[1][5 - position.rowNumber],
            };
        },
    },
    {
        numeric: true,
        disablePadding: false,
        label: 'Almost Certain (5)',
        align: 'center',
        format: (
            item: GenericListItem,
            value: string | number | boolean,
            position: CellPosition
        ) => {
            const groups = splitString(
                item.almostCertainLabels.toString(),
                ',',
                ['-']
            );
            return (
                <ol>
                    {groups.map((group, index) => (
                        <GroupQueryLink
                            key={`almost-certain-${position.columnNumber}-${position.rowNumber}`}
                            group={group}
                            grouping={item.grouping.toString()}
                        />
                    ))}
                </ol>
            );
        },
        getStyle: (item: GenericListItem, position: CellPosition) => {
            return {
                backgroundColor: colors[0][5 - position.rowNumber],
            };
        },
    },
];
type RiskChartProps = {
    items: Array<{
        label: string;
        impact: number;
        likelihood: number;
    }>;
};

type RiskItem = {
    label: string;
    grouping: string;
    rareLabels: string;
    rareImpact: number;
    rareLikelihood: number;

    unlikelyLabels: string;
    unlikelyImpact: number;
    unlikelyLikelihood: number;

    evenChanceLabels: string;
    evenChanceImpact: number;
    evenChanceLikelihood: number;

    likelyLabels: string;
    likelyImpact: number;
    likelyLikelihood: number;

    almostCertainLabels: string;
    almostCertainImpact: number;
    almostCertainLikelihood: number;
};

const createRiskItem = (label: string, impact: number): RiskItem => {
    return {
        label,
        grouping: 'default',
        rareLabels: '',
        rareImpact: impact,
        rareLikelihood: 1,

        unlikelyLabels: '',
        unlikelyImpact: impact,
        unlikelyLikelihood: 2,

        evenChanceLabels: '',
        evenChanceImpact: impact,
        evenChanceLikelihood: 3,

        likelyLabels: '',
        likelyImpact: impact,
        likelyLikelihood: 4,

        almostCertainLabels: '',
        almostCertainImpact: impact,
        almostCertainLikelihood: 5,
    };
};

export const RiskChart = (props: RiskChartProps) => {
    const riskItems = new Array<RiskItem>();
    riskItems.push(createRiskItem('Extreme (5)', 5));
    riskItems.push(createRiskItem('Very High (4)', 4));
    riskItems.push(createRiskItem('High (3)', 3));
    riskItems.push(createRiskItem('Medium (2)', 2));
    riskItems.push(createRiskItem('Low (1)', 1));
    props.items.forEach((item) => {
        const semaphoreInfo = getSemaphoreInfo({
            impact: item.impact,
            likelihood: item.likelihood,
        });
        const riskItem = riskItems[semaphoreInfo.impactIndex];
        if (semaphoreInfo.likelihoodIndex === 0) {
            riskItem.rareLabels =
                riskItem.rareLabels === ''
                    ? item.label
                    : `${riskItem.rareLabels},${item.label}`;
        }
        if (semaphoreInfo.likelihoodIndex === 1) {
            riskItem.unlikelyLabels =
                riskItem.unlikelyLabels === ''
                    ? item.label
                    : `${riskItem.unlikelyLabels},${item.label}`;
        }
        if (semaphoreInfo.likelihoodIndex === 2) {
            riskItem.evenChanceLabels =
                riskItem.evenChanceLabels === ''
                    ? item.label
                    : `${riskItem.evenChanceLabels},${item.label}`;
        }
        if (semaphoreInfo.likelihoodIndex === 3) {
            riskItem.likelyLabels =
                riskItem.likelyLabels === ''
                    ? item.label
                    : `${riskItem.likelyLabels},${item.label}`;
        }
        if (semaphoreInfo.likelihoodIndex === 4) {
            riskItem.almostCertainLabels =
                riskItem.almostCertainLabels === ''
                    ? item.label
                    : `${riskItem.almostCertainLabels},${item.label}`;
        }
    });
    return (
        <GenericList
            defaultRowsPerPage={5}
            headCells={headCells}
            items={riskItems}
            title="Groups Risk Chart"
        />
    );
};
