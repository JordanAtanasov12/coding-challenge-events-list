import React, { useState } from "react";
import { getColonyNetworkClient, Network, ColonyRole, getBlockTime } from '@colony/colony-js';
import { EventFilter, Wallet } from 'ethers';
import { getLogs } from '@colony/colony-js';
import * as  ethers from 'ethers';
import { Promise } from 'es6-promise';
import { PayoutClaimedItem } from "../interfaces/eventObjects/PayoutClaimedItem";
import { DisplayEventItem } from "../interfaces/eventObjects/DisplayEventItem";
import { EventLogsService } from "../interfaces/services/EventLogsService";


/*
    Payout Claimed Event Service, preparing respective event logs
*/

export default class PayoudClaimedService implements EventLogsService {

    colonyClient: any;
    eventFilter: EventFilter;
    public displayItems: any;
    public logsService: any;
    public parsedLogs: PayoutClaimedItem[];

    constructor(colonyClient: any) {
        this.colonyClient = colonyClient;
        this.eventFilter = this.colonyClient.filters.PayoutClaimed();
        this.parsedLogs = new Array<PayoutClaimedItem>();
        this.displayItems = new Array<DisplayEventItem>();
    }

    public async prepareLogs() {

        try {

            const parsedLogs: PayoutClaimedItem[] = await this.getParsedLogs();
            this.displayItems = new Array<DisplayEventItem>();

            const promises = await parsedLogs.map(async (singleLog) => {
                return await this.getAssoitaedTypeId(singleLog, this.colonyClient)
                    .then(assosiatedTypeId => this.colonyClient.getPayment(assosiatedTypeId))
                    .then(result => this.prepareDisplayItem(singleLog, result.recipient))
                    .then(displayInfo => this.displayItems.push(displayInfo));
            });


            await Promise.all(promises);
            return this.displayItems;

        } catch (error) {
            console.log(error)
        }
    }

    async getParsedLogs() {

        const payoutClaimedLogs: any = await getLogs(this.colonyClient, this.eventFilter);
        const getLogsPromices = await payoutClaimedLogs.map(async (event: any) => {
            let res: PayoutClaimedItem = await this.colonyClient.interface.parseLog(event);
            return await this.mapLog(res, event);
        });

        await Promise.all(getLogsPromices);

        return this.parsedLogs;
    }


    async mapLog(singleLog: PayoutClaimedItem, unparsedEvent: any) {

        const provider = ethers.getDefaultProvider();
        const timestamp = await getBlockTime(provider, unparsedEvent.blockHash);

        let day = "";
        let month = "";

        if (timestamp) {
            const date = new Date(timestamp);
            day = date.toLocaleString('default', { day: '2-digit' });
            month = date.toLocaleString('default', { month: 'short' });
        }
        

        this.parsedLogs.push({
            name: singleLog.name,
            values: {
                fundingPotId: singleLog.values.fundingPotId,
                token: singleLog.values.token,
                amount: singleLog.values.amount,
            },
            date: `${day} ${month}`,
            timestamp: timestamp
        })
    }

    private async getAssoitaedTypeId(singleLog: PayoutClaimedItem, colonyClient: any) {
        const humanReadableFundingPotId = new ethers.utils.BigNumber(
            singleLog.values.fundingPotId
        ).toString();

        const {
            associatedTypeId,
        } = await colonyClient.getFundingPot(humanReadableFundingPotId);

        return associatedTypeId;
    }

    private async prepareDisplayItem(singleLog: PayoutClaimedItem, userAddress: any) {

        //default Api to lookup contract information and get tokenAmount and tokenInfo from userAddress

        const provider = ethers.getDefaultProvider();
        const abi = [
            // Read-Only Functions
            "function balanceOf(address owner) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)",

            // Authenticated Functions
            "function transfer(address to, uint amount) returns (bool)",

            // Events
            "event Transfer(address indexed from, address indexed to, uint amount)"
        ];

        const erc20 = new ethers.Contract(singleLog.values.token, abi, provider);
        const tokenInfo = await erc20.symbol()
        const humanReadableAmount = new ethers.utils.BigNumber(singleLog.values.amount)
        const convertedAmount = humanReadableAmount.div(humanReadableAmount.pow(18));
        const humanReadableFundingPotId = new ethers.utils.BigNumber(
            singleLog.values.fundingPotId
        ).toString();

        return {
            avatarSeed: userAddress,
            description: `User `,
            date: singleLog.date,
            timestamp: singleLog.timestamp,
            boldItem0: userAddress,
            description0: `  claimed `,
            boldItem1: `${convertedAmount}${tokenInfo}`,
            description1: ` payout from pot `,
            boldItem2: humanReadableFundingPotId,
            description2: `.`
        };
    }

}
