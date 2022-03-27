/* eslint-disable react/display-name */
import { useEffect, useState } from 'react';
import { Theme, Tooltip, Typography } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import LinkIcon from '@mui/icons-material/Link';
import { GenericList, GenericListItem } from '../GenericList';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ParamTypes } from '../../../types/DefaultParamTypes';
import { DEFAULT_NETWORK } from '../../../types';
import { useStrategiesMissingRisk } from '../../../hooks/use-strategies-missing-risk';
import { HeadCell } from '../GenericList/HeadCell';
import { ErrorAlert } from '../../common/Alerts';
import getNetworkConfig from '../../../utils/config';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            padding: theme.spacing(2),
            textAlign: 'center',
        },
    })
);

export const Alerts = () => {
    const { network = DEFAULT_NETWORK } = useParams() as ParamTypes;
    const {
        data: strategiesNotInRiskProfile,
        loading,
        error,
    } = useStrategiesMissingRisk(network);
    const [items, setItems] = useState<GenericListItem[]>([]);
    const classes = useStyles();
    useEffect(() => {
        const genericListItems =
            strategiesNotInRiskProfile?.map((strategy) => {
                return {
                    name: strategy.name,
                    address: strategy.address,
                };
            }) || [];
        setItems(genericListItems);
    }, [strategiesNotInRiskProfile]);

    if (loading) {
        return (
            <div className={classes.root}>
                <CircularProgress />
                <Typography style={{ color: '#fff' }}>
                    Loading info...
                </Typography>
            </div>
        );
    }

    const headCells: HeadCell<GenericListItem>[] = [
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
            align: 'center',
        },
        {
            id: 'address',
            numeric: true,
            disablePadding: false,
            label: 'Address',
            align: 'center',
        },
        {
            numeric: false,
            disablePadding: false,
            label: 'Links',
            align: 'center',
            format: (item: GenericListItem) => {
                return (
                    <Tooltip title={`Etherscan link for: ${item.name}`}>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={getNetworkConfig(
                                network
                            ).toAddressExplorerUrl(item.address.toString())}
                        >
                            <LinkIcon fontSize="small" htmlColor="gray" />
                        </a>
                    </Tooltip>
                );
            },
        },
    ];

    return (
        <div>
            {error && (
                <ErrorAlert message={'Error while loading:'} details={error} />
            )}
            <Typography style={{ color: '#fff' }}>
                <p>Welcome to the Alerts Chart!</p>
            </Typography>
            <GenericList
                headCells={headCells}
                items={items}
                title={`Strategies not in risk framework - ${items.length} `}
                defaultOrder="desc"
                defaultOrderBy="name"
                defaultRowsPerPage={20}
            />
        </div>
    );
};
