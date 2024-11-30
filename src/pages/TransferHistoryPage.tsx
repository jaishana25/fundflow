import { History, Search } from 'lucide-react';
import { formatCurrency } from '../utils/chat-helpers';

interface TransferRecord {
  id: string;
  date: Date;
  amount: number;
  fromAccount: string;
  toAccount: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransfers: TransferRecord[] = [
  {
    id: '1',
    date: new Date('2024-03-10'),
    amount: 1500,
    fromAccount: '****4321',
    toAccount: '****8765',
    status: 'completed',
  },
  {
    id: '2',
    date: new Date('2024-03-09'),
    amount: 2500,
    fromAccount: '****4321',
    toAccount: '****9999',
    status: 'completed',
  },
];

export function TransferHistoryPage() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <History size={24} className="text-white" />
          </div>
          <h1 className="text-white text-xl font-semibold">Transfer History</h1>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search transfers..."
            className="pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-blue-100 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <Search className="absolute left-3 top-2.5 text-white/70" size={18} />
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.date.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(transfer.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.fromAccount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transfer.toAccount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        transfer.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transfer.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}