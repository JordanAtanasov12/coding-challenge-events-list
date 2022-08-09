// Mapping only relevant display data from the parsed logs
export interface ColonyRoleSetItem {
    name: string;
    values: {
        role: number;
        domainId: string;
        user: string;
    };
    date: string;
    timestamp: number
}
