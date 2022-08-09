import React, { useState } from "react";
import { getBlockTime, ColonyRole } from '@colony/colony-js';
import { EventFilter, Wallet } from 'ethers';
import { getLogs } from '@colony/colony-js';
import * as  ethers from 'ethers';
import { Promise } from 'es6-promise';
import { DomainAddedItem } from "../interfaces/eventObjects/DomainAddedItem";
import { DisplayEventItem } from "../interfaces/eventObjects/DisplayEventItem";
import { EventLogsService } from "../interfaces/services/EventLogsService";

/*
    Colony Domain Added Event Service, preparing respective event logs
*/

export default class DomainAddedService implements EventLogsService {

    colonyClient: any;
    eventFilter: EventFilter;
    public displayItems: any;
    public logsService: any;
    public parsedLogs: DomainAddedItem[];

    constructor(colonyClient: any) {
        this.colonyClient = colonyClient;
        this.eventFilter = this.colonyClient.filters.DomainAdded();
        this.parsedLogs = new Array<DomainAddedItem>();
    }

    public async prepareLogs() {

        try {

            const parsedLogs: DomainAddedItem[] = await this.getParsedLogs();
            this.displayItems = new Array<DisplayEventItem>();

            parsedLogs.forEach(singleLog => {
                this.prepareDisplayItem(singleLog);
            })

            return this.displayItems;

        } catch (error) {
            console.log(error)
        }
    }

    async getParsedLogs() {

        const domainAddedLogs: any = await getLogs(this.colonyClient, this.eventFilter);
        const getLogsPromices = await domainAddedLogs.map(async (event: any) => {
            let res: DomainAddedItem = await this.colonyClient.interface.parseLog(event);
            return await this.mapLog(res, event);
        });

        await Promise.all(getLogsPromices);

        return this.parsedLogs;
    }


    async mapLog(singleLog: DomainAddedItem, unparsedEvent: any) {

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
                domainId: singleLog.values.domainId,
                user: singleLog.values.user ? singleLog.values.user : this.colonyClient.address,
            },
            date: `${day} ${month}`,
            timestamp: timestamp,

        })
    }

    private async prepareDisplayItem(singleLog: DomainAddedItem) {

        const domainId = new ethers.utils.BigNumber(
            singleLog.values.domainId
        ).toString();

        this.displayItems.push({
            description0: `Domain `,
            date: singleLog.date,
            timestamp: singleLog.timestamp,
            avatarSeed: singleLog.values.user,
            boldItem1: domainId,
            description1: ` added.` 
        });
    }

}
