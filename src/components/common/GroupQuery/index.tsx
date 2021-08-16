import { MouseEvent, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { ProtocolsList } from '../ProtocolsList';
import { groupStrategyTVLsPerProtocols } from '../../../utils/strategiesHelper';
import { ProtocolTVL } from '../../../types/protocol-tvl';

export interface ProtocolQueryProps {
    groups: string[];
    exclude: string[];
    include: string[];
    onRemoveProtocol: (protocolName: string) => void;
}

export const GroupQuery = (props: ProtocolQueryProps) => {
    const [protocolsTVL, setProtocolsTVL] = useState<ProtocolTVL[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const groupNames = props.groups.filter((elem, index, self) => {
        return index === self.indexOf(elem);
    });
    useEffect(() => {
        if (groupNames.length === 0) {
            setIsLoaded(true);
            return;
        }
        groupStrategyTVLsPerProtocols(
            groupNames,
            props.include,
            props.exclude
        ).then((groupedTVLsPerProtocols) => {
            const allNewProtocolTVLs = [
                ...protocolsTVL,
                groupedTVLsPerProtocols,
            ];
            setProtocolsTVL(allNewProtocolTVLs);
            setIsLoaded(true);
        });
    }, [props.groups]);

    const onRemoveProtocol = async (
        event: MouseEvent,
        protocolName: string
    ) => {
        event.preventDefault();
        setProtocolsTVL(
            protocolsTVL.filter((protocol) => !protocol.hasName(protocolName))
        );
        props.onRemoveProtocol(protocolName);
    };

    return (
        <div>
            {!isLoaded ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '100px',
                    }}
                >
                    <CircularProgress style={{ color: '#fff' }} />
                    <Typography style={{ color: '#fff' }}>
                        Loading protocols information.
                    </Typography>
                </div>
            ) : (
                <ProtocolsList
                    items={protocolsTVL}
                    onRemove={onRemoveProtocol}
                />
            )}
        </div>
    );
};
