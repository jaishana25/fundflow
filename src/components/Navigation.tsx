import { NavLink } from 'react-router-dom';
import { MessageSquare, Wallet } from 'lucide-react';
import { WalletButton } from './WalletButton';


export function Navigation() {
  const navItems = [
    { to: '/', icon: MessageSquare, label: 'Chat' },
    // { to: '/history', icon: History, label: 'History' },
    // { to: '/settings', icon: Settings, label: 'Settings' },
  ];


  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-lg">
              <Wallet className="text-white" size={20} />
            </div>
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              FundFlow
            </span>
          </div>
          <div className="flex items-center space-x-6">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${isActive
                    ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-600'
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
} 