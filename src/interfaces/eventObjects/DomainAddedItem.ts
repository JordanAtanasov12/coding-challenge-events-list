export interface DomainAddedItem {
    name: string;
    values: {
        domainId: string;
        user: string;
    };
    date: string;
    timestamp: number
}
