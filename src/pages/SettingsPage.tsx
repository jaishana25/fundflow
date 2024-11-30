
import { Settings, Bell, Shield, Clock } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <Settings size={24} className="text-white" />
        </div>
        <h1 className="text-white text-xl font-semibold">Settings</h1>
      </div>

      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Bell size={20} className="text-blue-500" />
            Notifications
          </h2>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-gray-900 font-medium">Transfer Notifications</span>
              <p className="text-sm text-gray-500">Get notified about your transfers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Shield size={20} className="text-blue-500" />
            Security
          </h2>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-gray-900 font-medium">Two-Factor Authentication</span>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Clock size={20} className="text-blue-500" />
            Transfer Limits
          </h2>
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-gray-900 font-medium">Daily Transfer Limit</span>
              <p className="text-sm text-gray-500">Maximum amount per day</p>
            </div>
            <select className="bg-white rounded-lg border border-gray-200 px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
              <option>$5,000</option>
              <option>$10,000</option>
              <option>$25,000</option>
              <option>$50,000</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}