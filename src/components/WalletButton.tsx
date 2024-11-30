import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export function WalletButton() {
  const { connect, disconnect, address, isConnected } = useWallet();

  return (
    <button
      onClick={isConnected ? disconnect : connect}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
    >
      <Wallet size={18} />
      <span className="text-sm font-medium">
        {isConnected
          ? `${address.slice(0, 6)}...${address.slice(-4)}`
          : 'Connect Wallet'}
      </span>
    </button>
  );
}