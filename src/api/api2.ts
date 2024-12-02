// routerChainService.ts
import dotenv from 'dotenv';
import axios from 'axios';
import { ethers } from 'ethers';

dotenv.config();

const PATH_FINDER_API_URL = 'https://k8-testnet-pf.routerchain.dev/api';

interface QuoteParams {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string;
    fromTokenChainId: string;
    toTokenChainId: string;
    partnerId?: number;
}

interface QuoteData {
    // Define the structure based on the API response
    [key: string]: any;
}

interface TransactionData {
    txn: any;
    [key: string]: any;
}

interface ExecuteTransactionResponse {
    hash: string;
    // Include other relevant transaction receipt properties
}

const getQuote = async (params: QuoteParams): Promise<QuoteData> => {
    const endpoint = 'v2/quote';
    const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

    try {
        const res = await axios.get(quoteUrl, { params });
        return res.data;
    } catch (e: any) {
        console.error(`Error fetching quote data from pathfinder: ${e.message}`);
        throw e;
    }
};

const getTransaction = async (
    quoteData: QuoteData,
    senderAddress: string,
    receiverAddress: string
): Promise<TransactionData> => {
    const endpoint = 'v2/transaction';
    const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

    const transactionData = {
        ...quoteData,
        senderAddress,
        receiverAddress,
        partnerId: 91,
    };

    try {
        const response = await axios.post(txDataUrl, transactionData, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (e: any) {
        console.error(`Error fetching transaction data: ${e.message}`);
        throw e;
    }
};

const executeTransaction = async (
    txData: TransactionData
): Promise<ExecuteTransactionResponse> => {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('Private key not set in environment variables');
    }

    const providerUrl =
        process.env.PROVIDER_URL ||
        'https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID';
    const provider = new ethers.JsonRpcProvider(providerUrl, 11155111);
    const wallet = new ethers.Wallet(privateKey, provider);

    try {
        const txResponse = await wallet.sendTransaction(txData.txn);
        const receipt = await txResponse.wait();
        console.log(`Transaction mined successfully: ${txResponse.hash}`);
        return receipt;
    } catch (error: any) {
        console.error(`Transaction failed: ${error.message}`);
        throw error;
    }
};

export { getQuote, getTransaction, executeTransaction };
