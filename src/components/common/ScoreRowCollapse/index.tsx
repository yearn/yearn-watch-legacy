/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CardContent from '../../app/SingleStrategy/CardContent';
import { Paper, Grid, TableCell, TableRow } from '@material-ui/core';
import { GenericListItem } from '../../app';
import { SpiderWeb } from '../../app/Charts/SpiderWeb';
import { LongevityTooltip } from '../LongevityTooltip';
import MediaQuery from 'react-responsive';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            alignContent: 'center',
        },
        paper: {
            padding: theme.spacing(1),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    })
);

export interface ScoreRowCollapseProps {
    index: number;
    item: GenericListItem;
}

export const ScoreRowCollapse = (props: ScoreRowCollapseProps) => {
    const { item, index } = props;
    const classes = useStyles();
    const longevityValue = (
        <>
            {parseInt(item.longevityScore.toString())}
            <LongevityTooltip
                value={parseInt(item.longevityScore.toString())}
            />
        </>
    );
    const data = [
        {
            key: 'TVL Impact:',
            value: item.tvlImpact.toString(),
        },
        {
            key: 'Audit Score:',
            value: item.auditScore.toString(),
        },
        {
            key: 'Code Review Score:',
            value: item.codeReviewScore.toString(),
        },
        {
            key: 'Complexity Score:',
            value: item.complexityScore.toString(),
        },
        {
            key: 'Longevity Score:',
            value: item.longevityScore.toString(),
            renderValue: (
                <TableRow key={index}>
                    <TableCell>
                        {'Longevity Score:'}
                        <MediaQuery query="(max-device-width: 1224px)">
                            <br />
                            {longevityValue}
                        </MediaQuery>{' '}
                    </TableCell>
                    <MediaQuery query="(min-device-width: 1224px)">
                        {' '}
                        <TableCell>{longevityValue}</TableCell>
                    </MediaQuery>
                </TableRow>
            ),
        },
        {
            key: 'Protocol Safety Score:',
            value: item.protocolSafetyScore.toString(),
        },
        {
            key: 'Team Knowledge Score:',
            value: item.teamKnowledgeScore.toString(),
        },
        { key: 'Testing Score:', value: item.testingScore.toString() },
    ];
    const label = item.label.toString().toUpperCase();
    return (
        <Grid container className={classes.root} spacing={1}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={1}>
                    <Grid key={`${index}-1`} item xs={8}>
                        <Paper className={classes.paper}>
                            <CardContent data={data} />
                        </Paper>
                    </Grid>
                    <Grid key={`${index}-2`} item xs={4}>
                        <Paper className={classes.paper}>
                            <SpiderWeb
                                title={`${label} Group Scores`}
                                seriesTitle={`${label}`}
                                values={data.map((keyValue) => ({
                                    label: keyValue.key,
                                    value: parseFloat(keyValue.value),
                                }))}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
