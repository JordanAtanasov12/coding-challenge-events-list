export interface PayoutClaimedItem {
    name: string;
    values: {
        fundingPotId: string;
        token: string;
        amount: string;
    };
    date: string;
    timestamp: number;
}
