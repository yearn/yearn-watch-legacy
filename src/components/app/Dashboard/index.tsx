import { MouseEvent, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';
import { ProtocolsList } from '../../common/ProtocolsList';
import { getStrategyTVLsPerProtocol } from '../../../utils/strategiesHelper';
import { ProtocolTVL } from '../../../types/protocol-tvl';

export const Dashboard = () => {
    const [protocolsTVL, setProtocolsTVL] = useState<ProtocolTVL[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const onSearchProtocol = async (protocol: string) => {
        const protocolTVL = await getStrategyTVLsPerProtocol(protocol);
        const newProtocolsTVL = [...protocolsTVL, protocolTVL];
        setProtocolsTVL(newProtocolsTVL);
    };
    /*
    useEffect(() => {
        const settings = [];
        getStrategyTVLsPerProtocol(settings.protocol).then((protocolTVL: ProtocolTVL) => {
            protocolsTVL.push(protocolTVL);
            setProtocolsTVL(protocolsTVL);
            setIsLoaded(true);
        });
    }, []);
    */
    const onRemoveProtocol = async (
        event: MouseEvent,
        protocolName: string
    ) => {
        event.preventDefault();
        setProtocolsTVL(
            protocolsTVL.filter((protocol) => !protocol.hasName(protocolName))
        );
    };

    return (
        <div>
            {isLoaded ? (
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
                    onSearch={onSearchProtocol}
                    onRemove={onRemoveProtocol}
                />
            )}
        </div>
    );
};
