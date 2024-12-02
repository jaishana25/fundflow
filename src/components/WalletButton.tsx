import { Wallet } from 'lucide-react';
//import { useWallet } from '../hooks/useWallet';
import { useContract } from '../contexts/walletContext'



export function WalletButton() {
  const { connectedAddress, connectWallet, disconnectWallet, connected } = useContract();

  return (
    <button
      onClick={connected ? disconnectWallet : connectWallet}
      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
    >
      <Wallet size={18} />
      <span className="text-sm font-medium">
        {connected && connectedAddress
          ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`
          : 'Connect Wallet'}
      </span>
    </button>
  );
}