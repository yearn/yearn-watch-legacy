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
        limit: 30,
    },
};

export const toQueryParam = (
    offset = 0,
    limit = 30,
    includeExperimental = false
): QueryParam => ({
    includeExperimental,
    pagination: {
        offset,
        limit,
    },
});
