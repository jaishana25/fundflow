"use client";

import { ethers } from "ethers";
import React, { createContext, useState, useContext, useEffect } from "react";
import Web3Modal from "web3modal";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";

// Define the context type
type ContractContextType = {
    connectedAddress: string | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    connected: boolean;
    balance: string;
    signer: JsonRpcSigner | null; // Add signer to the context type
    provider: Web3Provider | null; // Add provider to the context type
};

// Create the context
const contractContext = createContext<ContractContextType | undefined>(
    undefined
);

// Create the provider component
export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
    const [provider, setProvider] = useState<Web3Provider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [balance, setBalance] = useState<string>("");

    const connectWallet = async () => {
        try {
            console.log("Starting wallet connection...");

            const web3Modal = new Web3Modal();
            const instance = await web3Modal.connect();
            const web3Provider = new Web3Provider(instance);
            setProvider(web3Provider);

            const signerInstance = web3Provider.getSigner();
            setSigner(signerInstance);

            const address = await signerInstance.getAddress();
            const rawBalance = await signerInstance.getBalance();
            const formattedBalance = ethers.utils.formatEther(rawBalance);

            setConnectedAddress(address);
            setConnected(true);
            setBalance(formattedBalance);

            console.log(`Wallet connected: ${address}`);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
        }
    };

    const disconnectWallet = async () => {
        try {
            setConnectedAddress(null);
            setProvider(null);
            setSigner(null);
            setConnected(false);
            setBalance("");
        } catch (error) {
            console.error("Failed to disconnect wallet:", error);
        }
    };

    useEffect(() => {
        console.log("Connected address changed:", connectedAddress);
    }, [connectedAddress]);

    return (
        <contractContext.Provider
            value={{
                connectedAddress,
                connectWallet,
                disconnectWallet,
                connected,
                balance,
                signer,
                provider,
            }}
        >
            {children}
        </contractContext.Provider>
    );
};

// Custom hook to use the contract context
export const useContract = (): ContractContextType => {
    const context = useContext(contractContext);
    if (!context) {
        throw new Error("useContract must be used within a ContractProvider");
    }
    return context;
};
