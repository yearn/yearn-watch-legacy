import { useState } from 'react';
import { useParams } from 'react-router';
import SearchProtocolInput from '../../common/SearchProtocolInput';
import { ProtocolQuery } from '../../common/ProtocolQuery';

interface ParamTypes {
    groupingId?: string;
    groups?: string;
}

export const Query = () => {
    const { groups } = useParams<ParamTypes>();
    const initialGroups = groups
        ? groups.split(',').map((group) => group.toLowerCase())
        : [];
    const [protocols, setProtocols] = useState<string[]>(initialGroups);
    const onSearchProtocol = async (protocol: string) => {
        if (!protocols.includes(protocol.toLowerCase())) {
            const newProtocols = [...protocols, protocol.toLowerCase()];
            setProtocols(newProtocols);
        }
    };
    const onRemoveProtocol = async (protocolName: string) => {
        setProtocols(
            protocols.filter(
                (protocol) =>
                    protocol.toLowerCase() !== protocolName.toLowerCase()
            )
        );
    };

    return (
        <div>
            <>
                <SearchProtocolInput onSearch={onSearchProtocol} />
                <ProtocolQuery
                    protocols={protocols}
                    onRemoveProtocol={onRemoveProtocol}
                />
            </>
        </div>
    );
};
