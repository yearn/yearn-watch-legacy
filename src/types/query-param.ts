export const DEFAULT_BATCH_SIZE = 25;

export type QueryParam = {
    includeExperimental: boolean;
    pagination: {
        offset: number;
        limit: number;
    };
};

export const DEFAULT_QUERY_PARAM: QueryParam = {
    includeExperimental: false,
    pagination: {
        offset: 0,
        limit: DEFAULT_BATCH_SIZE,
    },
};

export const toQueryParam = (
    offset = 0,
    limit = DEFAULT_BATCH_SIZE,
    includeExperimental = false
): QueryParam => ({
    includeExperimental,
    pagination: {
        offset,
        limit,
    },
});
