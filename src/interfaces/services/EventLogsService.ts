import { EventFilter } from "ethers";

/*
    Decoupling dependency on specific event services, by adding a generic Event service
    responsible for handling data preparation
*/

export interface EventLogsService {
    colonyClient: any;
    eventFilter: EventFilter;
    prepareLogs() : any; //type annotation is 'any' as method returns a type from 3rd party client
    getParsedLogs() : any; //type annotation is 'any' as method returns a type from 3rd party client
    mapLog(singleLog: any, unparsedEvent: any): any
}
