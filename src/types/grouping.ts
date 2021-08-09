export type Groups = {
    groups: Grouping[];
};

export type Grouping = {
    id: string; // id unique label
    label: string;
    criteria: {
        nameLike: string[]; // name contains list of strings
        strategies: string[]; // addresses
        exclude: string[]; // don't include this addresses
    };
    codeReviewScore: number;
    testingScore: number;
    auditScore: number;
    longevityScore: number;
    protocolSafetyScore: number;
    complexityScore: number;
    teamKnowledgeScore: number;
};

export type GroupingsList = Array<Grouping>;
