import axios from "axios";
import { ethers } from "ethers";

const PATH_FINDER_API_URL = "https://k8-testnet-pf.routerchain.dev/api";

// Function to initiate cross-chain transfer
const crossChainTransfer = async (recipientAddress: string,
    amount: string,
    connectedAddress: string,
    signer: ethers.Signer) => {

    try {
        // Get quote from PathFinder API
        const getQuote = async (params: any) => {
            console.log("getting the quotations...");
            const endpoint = "v2/quote";
            const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`;
            console.log(quoteUrl);

            try {
                const res = await axios.get(`https://k8-testnet-pf.routerchain.dev/api/v2/quote?fromTokenAddress=${params.fromTokenAddress}&toTokenAddress=${params.toTokenAddress}&amount=${amount}&fromTokenChainId=${params.fromTokenChainId}&toTokenChainId=${params.toTokenChainId}`);
                return res.data;
            } catch (e) {
                console.error(`Error fetching quote from PathFinder: ${e}`);
            }
        };

        // Get transaction details from PathFinder API
        const getTransaction = async (quoteData: any, receiverAddress: string) => {
            const endpoint = "v2/transaction";
            const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`;
            console.log("Transaction Data URL: ", txDataUrl);

            const transactionData = {
                ...quoteData,
                senderAddress: connectedAddress, // Sender address, could be dynamic if necessary
                receiverAddress: receiverAddress,
                partnerId: 91,
            };

            const options = {
                method: 'POST',
                url: 'https://k8-testnet-pf.routerchain.dev/api/v2/transaction',
                headers: { 'Content-Type': 'application/json' },
                data: transactionData,
            };

            try {
                const response = await axios.request(options);
                return response.data;
            } catch (error) {
                console.error("Error getting transaction data from PathFinder: ", error);
            }
        };

        // Check if recipient address is provided
        if (!recipientAddress) {
            console.error('Recipient address is required');
            return { error: 'Recipient address is required' };
        }

        try {
            console.log("starting...");
            // 1. Fetch quote data from PathFinder API
            const params = {
                fromTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',  // ETH (or token address)
                toTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',  // Same token or different
                amount: amount,  // Source amount
                fromTokenChainId: "11155111",  // Mumbai (Sepolia or others as needed)
                toTokenChainId: "43113",  // Fuji (or any other destination chain)
                partnerId: 90,  // Optional partner ID
            };

            const quoteData = await getQuote(params);
            console.log("Quote Data: ", quoteData);

            if (!quoteData) {
                console.error("Error fetching quote data");
                return { error: 'Error fetching quote data' };
            }

            // 2. Fetch transaction details
            const txData = await getTransaction(quoteData, recipientAddress);
            console.log("Transaction Data: ", txData);

            if (!txData) {
                console.error("Error fetching transaction data");
                return { error: 'Error fetching transaction data' };
            }

            // 3. Send the transaction using wallet
            const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/a56ee2f67fa347e296cfeb0528c67f60', 11155111); // Sepolia network URL

            console.error("error")

            const wallet = signer;

            if (wallet) {
                const tx = await wallet.sendTransaction(txData.txn); // Send the transaction data received from the API

                await tx.wait(); // Wait for the transaction to be mined
                console.log(`Transaction mined successfully: ${tx.hash}`);

                return { success: true, message: `Transaction mined successfully: ${tx.hash}` };
            }

        } catch (error) {
            console.error("Error during cross-chain transfer: ", error);
            return { error: 'An error occurred while processing the transaction' };
        }
    } catch (error) {
        console.error("Error in crossChainTransfer function: ", error);
        return { error: 'An unexpected error occurred' };
    }
};

export default crossChainTransfer;
