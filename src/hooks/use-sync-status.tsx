import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { querySubgraphData } from '../utils/apisRequest';
import { Network } from '../types';
import { getEthersDefaultProvider } from '../utils/ethers';

export type SyncStatus = {
    syncError: boolean;
    syncHeight: BigNumber;
};

export function useSyncStatus(network: Network) {
    const [subgraphLoading, setSubgraphLoading] = useState<boolean>(true);
    const [rpcLoading, setRpcLoading] = useState<boolean>(false);

    const [subgraphData, setSubgraphData] = useState<SyncStatus>();
    const [rpcData, setRpcData] = useState<SyncStatus>();

    const [subgraphRequestError, setSubgraphRequestError] =
        useState<boolean>(false);
    const [rpcRequestError, setRpcRequestError] = useState<boolean>(false);

    type SubgraphGQLResult = {
        data: {
            _meta: {
                hasIndexingErrors: boolean;
                block: {
                    number: BigNumber;
                };
            };
        };
    };

    useEffect(() => {
        // reset loading state
        setSubgraphLoading(true);
        setRpcLoading(true);

        const fetchSubgraphStatus = async () => {
            try {
                const query = `
                {
                    _meta{
                      block {
                        number
                      }
                      hasIndexingErrors
                    }
                  }
                `;
                const results: SubgraphGQLResult = (await querySubgraphData(
                    query,
                    network
                )) as SubgraphGQLResult;
                const subgraphSyncStatus = {
                    syncError: results.data._meta.hasIndexingErrors,
                    syncHeight: results.data._meta.block.number,
                } as SyncStatus;
                setSubgraphData(subgraphSyncStatus);
                setSubgraphRequestError(false);
            } catch (e) {
                setSubgraphRequestError(true);
            } finally {
                setSubgraphLoading(false);
            }
        };

        const fetchRpcStatus = async () => {
            try {
                const provider = getEthersDefaultProvider(network);
                const blockNumber = await provider.getBlockNumber();

                const rpcSyncStatus = {
                    syncError: false,
                    syncHeight: BigNumber.from(blockNumber),
                } as SyncStatus;
                setRpcData(rpcSyncStatus);
            } catch (e) {
                setRpcRequestError(true);
            } finally {
                setRpcLoading(false);
            }
        };
        fetchSubgraphStatus();
        fetchRpcStatus();
    }, [network]);

    return {
        subgraphLoading,
        subgraphData,
        subgraphRequestError,
        rpcLoading,
        rpcData,
        rpcRequestError,
    };
}
