import { useState } from 'react';
import { useLocation, useParams } from 'react-router';
import SearchProtocolInput from '../../common/SearchProtocolInput';
import { GroupQuery } from '../../common/GroupQuery';
import qs from 'query-string';

interface ParamTypes {
    groupingId: string;
    groups: string;
}
interface QueryParams {
    names?: string;
    include?: string;
    exclude?: string;
}

export const Query = () => {
    const paramTypes = useParams<ParamTypes>();
    const location = useLocation<QueryParams>();
    const params = qs.parse(location.search);
    const nameGroups = paramTypes.groups.split(',');
    const excludeStrategies = (params.exclude as string[]) || [];
    const includeStrategies = (params.include as string[]) || [];
    /*
    console.log('nameGroups');
    console.log(nameGroups);
    console.log('excludeStrategies');
    console.log(excludeStrategies);
    console.log('includeStrategies');
    console.log(includeStrategies);
    */
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
                />
            </>
        </div>
    );
};
