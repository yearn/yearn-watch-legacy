/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import CardContent from '../../app/SingleStrategy/CardContent';
import { Paper, Grid, TableCell, TableRow } from '@mui/material';
import { GenericListItem } from '../../app';
import { SpiderWeb } from '../../app/Charts/SpiderWeb';
import { LongevityTooltip } from '../LongevityTooltip';
import { TVLImpactTooltip } from '../TVLImpactTooltip';
import { AuditScoreTooltip } from '../AuditScoreTooltip';
import { CodeReviewTooltip } from '../CodeReviewTooltip';
import { ComplexityTooltip } from '../ComplexityTooltip';
import { ProtocolSafetyTooltip } from '../ProtocolSafetyTooltip';
import { TeamKnowledgeTooltip } from '../TeamKnowledgeTooltip';
import { TestTooltip } from '../TestTooltip';
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

    const TVLImpact = (
        <>
            {parseInt(item.tvlImpact.toString())}
            <TVLImpactTooltip value={parseInt(item.tvlImpact.toString())} />
        </>
    );

    const audit = (
        <>
            {parseInt(item.auditScore.toString())}
            <AuditScoreTooltip value={parseInt(item.auditScore.toString())} />
        </>
    );

    const codeReview = (
        <>
            {parseInt(item.codeReviewScore.toString())}
            <CodeReviewTooltip
                value={parseInt(item.codeReviewScore.toString())}
            />
        </>
    );

    const complexity = (
        <>
            {parseInt(item.complexityScore.toString())}
            <ComplexityTooltip
                value={parseInt(item.complexityScore.toString())}
            />
        </>
    );

    const protocolSafety = (
        <>
            {parseInt(item.protocolSafetyScore.toString())}
            <ProtocolSafetyTooltip
                value={parseInt(item.protocolSafetyScore.toString())}
            />
        </>
    );

    const teamknowledge = (
        <>
            {parseInt(item.teamKnowledgeScore.toString())}
            <TeamKnowledgeTooltip
                value={parseInt(item.teamKnowledgeScore.toString())}
            />
        </>
    );

    const testValue = (
        <>
            {parseInt(item.testingScore.toString())}
            <TestTooltip value={parseInt(item.testingScore.toString())} />
        </>
    );

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
            renderValue: (
                <TableRow key={index}>
                    <TableCell>
                        {'TVL Impact:'}
                        <MediaQuery query="(max-device-width: 1224px)">
                            {TVLImpact}
                        </MediaQuery>
                    </TableCell>
                    <MediaQuery query="(min-device-width: 1224px)">
                        <TableCell>{TVLImpact}</TableCell>
                    </MediaQuery>
                </TableRow>
            ),
        },
        {
            key: 'Audit Score:',
            value: item.auditScore.toString(),
            renderValue: (
                <TableRow key={index}>
                    <TableCell>
                        {'Audit Score:'}
                        <MediaQuery query="(max-device-width: 1224px)">
                            {audit}
                        </MediaQuery>
                    </TableCell>
                    <MediaQuery query="(min-device-width: 1224px)">
                        <TableCell>{audit}</TableCell>
                    </MediaQuery>
                </TableRow>
            ),
        },
        {
            key: 'Code Review Score:',
            value: item.codeReviewScore.toString(),
            renderValue: (
                <TableRow key={index}>
                    <TableCell>
                        {'Code Review Score:'}
                        <MediaQuery query="(max-device-width: 1224px)">
                            {codeReview}
                        </MediaQuery>
                    </TableCell>
                    <MediaQuery query="(min-device-width: 1224px)">
                        <TableCell>{codeReview}</TableCell>
                    </MediaQuery>
                </TableRow>
            ),
        },
        {
            key: 'Complexity Score:',
            value: item.complexityScore.toString(),
            renderValue: (
                <TableRow key={index}>
                    <TableCell>
                        {'Complexity Score:'}
                        <MediaQuery query="(max-device-width: 1224px)">
                            {complexity}
                        </MediaQuery>
                    </TableCell>
                    <MediaQuery query="(min-device-width: 1224px)">
                        <TableCell>{complexity}</TableCell>
                    </MediaQuery>
                </TableRow>
            ),
        },
        {
            key: 'Longevity Score:',
            value: item.longevityScore.toString(),
            renderValue: (
                <TableRow key={index}>
                    <TableCell>
                        {'Longevity Score:'}
                        <MediaQuery query="(max-device-width: 1224px)">
                            {longevityValue}
                        </MediaQuery>
                    </TableCell>
                    <MediaQuery query="(min-device-width: 1224px)">
                        <TableCell>{longevityValue}</TableCell>
                    </MediaQuery>
                </TableRow>
            ),
        },
        {
            key: 'Protocol Safety Score:',
            value: item.protocolSafetyScore.toString(),
            renderValue: (
                <TableRow key={index}>
                    <TableCell>
                        {'Protocol Safety Score:'}
                        <MediaQuery query="(max-device-width: 1224px)">
                            {protocolSafety}
                        </MediaQuery>
                    </TableCell>
                    <MediaQuery query="(min-device-width: 1224px)">
                        <TableCell>{protocolSafety}</TableCell>
                    </MediaQuery>
                </TableRow>
            ),
        },
        {
            key: 'Team Knowledge Score:',
            value: item.teamKnowledgeScore.toString(),
            renderValue: (
                <TableRow key={index}>
                    <TableCell>
                        {'Team Knowledge Score:'}
                        <MediaQuery query="(max-device-width: 1224px)">
                            {teamknowledge}
                        </MediaQuery>
                    </TableCell>
                    <MediaQuery query="(min-device-width: 1224px)">
                        <TableCell>{teamknowledge}</TableCell>
                    </MediaQuery>
                </TableRow>
            ),
        },
        {
            key: 'Testing Score:',
            value: item.testingScore.toString(),
            renderValue: (
                <TableRow key={index}>
                    <TableCell>
                        {'Testing Score:'}
                        <MediaQuery query="(max-device-width: 1224px)">
                            {testValue}
                        </MediaQuery>
                    </TableCell>
                    <MediaQuery query="(min-device-width: 1224px)">
                        <TableCell>{testValue}</TableCell>
                    </MediaQuery>
                </TableRow>
            ),
        },
    ];
    const label = item.label.toString().toUpperCase();
    return (
        <Grid container className={classes.root} spacing={1}>
            <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={1}>
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
