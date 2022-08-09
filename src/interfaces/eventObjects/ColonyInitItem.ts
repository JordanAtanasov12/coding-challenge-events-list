import * as  ethers from 'ethers';

// Mapping only relevant display data from the parsed logs
export interface ColonyInitItem {
    name: string;
    values: {
        fundingPotId: string;
        user: string;
    };
    date: string;
    timestamp: number
}
