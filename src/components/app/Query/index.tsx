import { useState } from 'react';
import { useLocation, useParams, Params } from 'react-router-dom';
import SearchProtocolInput from '../../common/SearchProtocolInput';
import { GroupQuery } from '../../common/GroupQuery';
import qs from 'query-string';
import { DEFAULT_NETWORK, Network } from '../../../types';

interface ParamTypes extends Params {
    groupingId: string;
    groups: string;
    network: Network;
}
interface QueryParams {
    names?: string;
    include?: string;
    exclude?: string;
    search: string;
}

export const Query = () => {
    const paramTypes = useParams() as ParamTypes;
    const location = useLocation() as QueryParams;
    const { network = DEFAULT_NETWORK } = paramTypes;
    const params = qs.parse(location.search, { arrayFormatSeparator: ',' });
    const nameGroups = paramTypes.groups ? paramTypes.groups.split(',') : [];
    const excludeStrategies =
        params.exclude === undefined
            ? new Array<string>()
            : typeof params.exclude === 'string'
            ? [params.exclude.toString()]
            : (params.exclude as string[]);
    const includeStrategies =
        params.include === undefined
            ? new Array<string>()
            : typeof params.include === 'string'
            ? [params.include.toString()]
            : (params.include as string[]);

    const initialGroups = nameGroups.map((group) => group.toLowerCase());
    const [groups, setGroups] = useState<string[]>(initialGroups);
    const onSearchProtocol = async (protocol: string) => {
        if (!groups.includes(protocol.toLowerCase())) {
            const newProtocols = [...groups, protocol.toLowerCase()];
            setGroups(newProtocols);
        }
    };
    const onRemoveProtocol = async (protocolName: string) => {
        setGroups(
            groups.filter(
                (protocol) =>
                    protocol.toLowerCase() !== protocolName.toLowerCase()
            )
        );
    };

    return (
        <div>
            <>
                <SearchProtocolInput onSearch={onSearchProtocol} />
                <GroupQuery
                    groups={groups}
                    exclude={excludeStrategies}
                    include={includeStrategies}
                    onRemoveProtocol={onRemoveProtocol}
                    network={network}
                />
            </>
        </div>
    );
};
