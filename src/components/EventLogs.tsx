import React, { useState } from "react";
import ReactDOM from 'react-dom';
import PayoutClaimedService from '../services/PayoudClaimedService';
import ColonyInitService from "../services/ColonyInitService";
import ColonyRoleSetService from "../services/ColonyRoleSetService";
import DomainAddedService from "../services/DomainAddedService";
import { EventLogsService } from '../interfaces/services/EventLogsService'
import { DisplayEventItem } from "../interfaces/eventObjects/DisplayEventItem";
import ColonyNetworkClientFactory from "../clients/ColonyNetworkClientFactory";
import Blockies from 'react-blockies';
import { styles } from '../styles';



export default class EventLogs extends React.Component {

    public displayItems: any;
    private colonyClient: any;

    state = { events: [] };

    async componentDidMount() {

        this.colonyClient = await ColonyNetworkClientFactory.getColonyClient();
        this.displayItems = new Array<DisplayEventItem>();

        /*
            Get all event types logs, sort and map them to generic Display Item 
        */

        const eventService: EventLogsService[] = [ new ColonyInitService(this.colonyClient),
                                                    new ColonyRoleSetService(this.colonyClient),
                                                    new DomainAddedService(this.colonyClient)
                                                ];

                
        const getLogPromices = eventService.map(async (service) => {
            const preparedLogs = await service.prepareLogs();
            this.displayItems = [...this.displayItems, ...preparedLogs]
        })

        await Promise.all(getLogPromices);

        this.setState({
            events: this.displayItems.sort(function (x: DisplayEventItem, y: DisplayEventItem) {
                return x.timestamp - y.timestamp;
            })
        });
    }


    render() {
        return (
            <div>
                <ul style={styles.eventList}>
                    {this.state.events.map((post: DisplayEventItem) => (
                        <li style={styles.eventBox}>
                            <div data-testid="Div::Blockie" style={styles.eventHeader}>
                                <Blockies
                                    seed={post.avatarSeed}
                                    size={37}
                                    scale={1}
                                    color="#dfe"
                                    bgColor="#ffe"
                                    spotColor="#abc"
                                    className="avatar-display"
                                />
                            </div>
                            <div style={styles.eventFooter}>
                                <div style={styles.descriptionText}>
                                    {post.description}
                                    {
                                        post.boldItem0 ?
                                            <span style={styles.heavyDescription}>
                                                {post.boldItem0}
                                            </span>
                                            : ''
                                    }
                                    {post.description0}
                                    {
                                        post.boldItem1 ?
                                            <span style={styles.heavyDescription}>
                                                {post.boldItem1}
                                            </span>
                                            : ''
                                    }
                                    {post.description1}
                                    {
                                        post.boldItem2 ?
                                            <span style={styles.heavyDescription}>
                                                {post.boldItem2}
                                            </span>
                                            : ''
                                    }
                                    {post.description2}
                                </div>
                                <div style={styles.dateText} > {post.date.toString()} </div>
                            </div>
                        </li>
                    ))
                    }
                </ul>
            </div>
        )
    }
}
