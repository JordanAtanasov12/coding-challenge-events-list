import React from 'react';
import logo from './logo.svg';
import './App.css';
import EventLogs from './components/EventLogs'
import { getColonyNetworkClient, Network, ColonyRole, getBlockTime } from '@colony/colony-js';

import { Wallet } from 'ethers';
import { InfuraProvider } from 'ethers/providers';
import { getLogs } from '@colony/colony-js';
import { Filter, Log, Provider } from 'ethers/providers';
import { utils } from 'ethers';
//import { ColonyRole } from '@colony/colony-js';
import { Console } from 'console';




function App() {
  return (
    <div className="App">
      <div className='list-container'>
        <EventLogs/>
      </div>
    </div>
  );
}

export default App;
