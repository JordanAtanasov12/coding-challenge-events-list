import React, { useState } from "react";
import {getBlockTime, ColonyRole } from '@colony/colony-js';
import { EventFilter, Wallet } from 'ethers';
import { getLogs } from '@colony/colony-js';
import * as  ethers from 'ethers';
import { Promise } from 'es6-promise';
import { ColonyRoleSetItem } from "../interfaces/eventObjects/ColonyRoleSetItem";
import {DisplayEventItem} from "../interfaces/eventObjects/DisplayEventItem"; 
import { EventLogsService } from "../interfaces/services/EventLogsService";


/*
    Colony Role Set Service, preparing respective event logs
*/

export default class ColonyRoleSetService implements EventLogsService{

    colonyClient: any;
    eventFilter: EventFilter;
    public displayItems: any;
    public logsService: any;
    public parsedLogs: ColonyRoleSetItem[];

    constructor(colonyClient: any) {
        this.colonyClient = colonyClient;
        this.eventFilter = this.colonyClient.filters.ColonyRoleSet();
        this.parsedLogs = new Array<ColonyRoleSetItem>();
    }

    public async prepareLogs() {

        try {

            const parsedLogs: ColonyRoleSetItem[] = await this.getParsedLogs();
            this.displayItems = new Array<DisplayEventItem>();

            const promises = parsedLogs.forEach((singleLog) => {
                this.prepareDisplayItem(singleLog)
                   
            });


            //await Promise.all(promises);
            return this.displayItems;

        } catch (error) {
            console.log(error)
        }
    }

    async getParsedLogs() {

        const colonyRoleSetLogs: any = await getLogs(this.colonyClient, this.eventFilter);
        const getLogsPromices  = await colonyRoleSetLogs.map(async (event: any) => {
                let res: ColonyRoleSetItem = await this.colonyClient.interface.parseLog(event);
                return await this.mapLog(res, event);
            });
        
        await Promise.all(getLogsPromices);

        return this.parsedLogs;
    }


    async mapLog(singleLog: ColonyRoleSetItem, unparsedEvent: any) {
        
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
                role: singleLog.values.role,
                domainId: singleLog.values.domainId,
                user: singleLog.values.user ? singleLog.values.user : this.colonyClient.address,
            },
            date: `${day} ${month}`,
            timestamp: timestamp
        })
    }

    private async prepareDisplayItem(singleLog: ColonyRoleSetItem) {

        const domainId = new ethers.utils.BigNumber(
            singleLog.values.domainId
        ).toString();

        this.displayItems.push({
            date: singleLog.date, 
            timestamp: singleLog.timestamp,
            avatarSeed: singleLog.values.user,
            boldItem0: singleLog.values.role,
            description0: ` role assigned to user `,
            boldItem1: singleLog.values.user,
            description1: ` in domain `,
            boldItem2: domainId,
            description2: ` .`
        });
    }

}
