import { Save } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Settings() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Integrations, notifications, and account setup
        </p>
      </div>

      <div className="space-y-6">
        {/* Integrations */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Integrations</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">SAP ERP</h3>
                <p className="text-sm text-gray-600 mt-1">Connected to production environment</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">3PL WMS</h3>
                <p className="text-sm text-gray-600 mt-1">Warehouse management system integration</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Email (SMTP/IMAP)</h3>
                <p className="text-sm text-gray-600 mt-1">Vendor communication monitoring</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
              <div>
                <span className="font-medium text-gray-900">High priority alerts</span>
                <p className="text-sm text-gray-600">Receive email notifications for high priority action items</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
              <div>
                <span className="font-medium text-gray-900">Daily summary</span>
                <p className="text-sm text-gray-600">Get a daily digest of agent actions</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <div>
                <span className="font-medium text-gray-900">Slack notifications</span>
                <p className="text-sm text-gray-600">Send alerts to Slack channels</p>
              </div>
            </label>
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Account</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                defaultValue="Acme Manufacturing Co."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                defaultValue="admin@acme.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
