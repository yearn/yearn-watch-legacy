import { MouseEvent, useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { ProtocolsList } from '../ProtocolsList';
import { getStrategyTVLsPerProtocol } from '../../../utils/strategiesHelper';
import { ProtocolTVL } from '../../../types/protocol-tvl';

export interface ProtocolQueryProps {
    protocols: string[];
    onRemoveProtocol: (protocolName: string) => void;
}

export const GroupQuery = (props: ProtocolQueryProps) => {
    const [protocolsTVL, setProtocolsTVL] = useState<ProtocolTVL[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const uniqueProtocolNames = props.protocols.filter((elem, index, self) => {
        return index === self.indexOf(elem);
    });
    useEffect(() => {
        const getStrategyTVLsPerProtocolPromises = uniqueProtocolNames
            .filter((protocolName) => {
                const found = protocolsTVL.find((protocolTVL) =>
                    protocolTVL.hasName(protocolName)
                );
                return found === undefined;
            })
            .map((protocolName) => {
                return getStrategyTVLsPerProtocol(
                    protocolName,
                    [protocolName],
                    [],
                    []
                );
            });
        Promise.all(getStrategyTVLsPerProtocolPromises)
            .then((newProtocolTVLs) => {
                const allNewProtocolTVLs = [
                    ...protocolsTVL,
                    ...newProtocolTVLs,
                ];
                setProtocolsTVL(allNewProtocolTVLs);
                setIsLoaded(true);
            })
            .catch((error) => console.log('Error on getting TVLs   ', error));
    }, [props.protocols]);

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
