
import { getColonyNetworkClient, Network, ColonyRole, getBlockTime } from '@colony/colony-js';
import { Wallet } from 'ethers';
import { InfuraProvider } from 'ethers/providers';
import { MAINNET_NETWORK_ADDRESS, MAINNET_BETACOLONY_ADDRESS } from '../helpers/constants';


export default class ColonyNetworkClientFactory {

    public static async getColonyClient() {
        try {
            const provider = new InfuraProvider();

            // Get a random wallet
            const wallet = Wallet.createRandom();
            // Connect wallet to the provider
            const connectedWallet = wallet.connect(provider);
            const networkClient = await getColonyNetworkClient(
                Network.Mainnet,
                connectedWallet,
                {
                    networkAddress: MAINNET_NETWORK_ADDRESS
                },
            );
            
            // Get the colony client instance for the betacolony
            const colonyClient = await networkClient.getColonyClient(MAINNET_BETACOLONY_ADDRESS);

            return colonyClient;
        }
        catch (e) {
            throw new Error(`Failed to instantiate Colony Client with error : ${e}`);
        }
    }

}
