import React, { useState } from "react";
import * as  ethers from 'ethers';
import { getLogs, getBlockTime, ColonyRole } from '@colony/colony-js';
import { ColonyInitItem } from "../interfaces/eventObjects/ColonyInitItem";
import { EventLogsService } from "../interfaces/services/EventLogsService";
import { DisplayEventItem } from "../interfaces/eventObjects/DisplayEventItem";


/*
    Colony Initilize Event Service, preparing respective event logs
*/
export default class ColonyInitService implements EventLogsService {

    colonyClient: any;
    eventFilter: ethers.EventFilter;
    public displayItems: any;
    public logsService: any;
    public parsedLogs: ColonyInitItem[];

    constructor(colonyClient: any) {
        this.colonyClient = colonyClient;
        this.eventFilter = this.colonyClient.filters.ColonyInitialised(null, null);
        this.parsedLogs = new Array<ColonyInitItem>();
    }

    public async prepareLogs() {

        try {

            const parsedLogs: ColonyInitItem[] = await this.getParsedLogs();
            this.displayItems = new Array<DisplayEventItem>();

            parsedLogs.forEach((singleLog) => {
                const displayItem = {
                    description: "Congratulations! It's a beautiful baby colony!",
                    date: singleLog.date,
                    timestamp: singleLog.timestamp,
                    avatarSeed: singleLog.values.user
                };
                this.displayItems.push(displayItem);
            });
            return this.displayItems;


        } catch (error) {
            console.log(error)
        }
    }


    async getParsedLogs() {

        const colonyInitEventLogs: any = await getLogs(this.colonyClient, this.eventFilter);
        const getLogsPromices = await colonyInitEventLogs.map(async (event: any) => {
            let res: ColonyInitItem = await this.colonyClient.interface.parseLog(event);
            return await this.mapLog(res, event);
        });

        await Promise.all(getLogsPromices);

        return this.parsedLogs;
    }


    async mapLog(singleLog: ColonyInitItem, unparsedEvent: any) {

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
                user: singleLog.values.user ? singleLog.values.user : this.colonyClient.address,
            },
            date: `${day} ${month}`,
            timestamp: timestamp
        })
    }
}
    