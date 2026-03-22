import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Actions() {
  const [input, setInput] = useState('');

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Command Center</h1>
        <p className="text-gray-600 mt-1">
          Instruct the SAP agent to perform CRUD operations on your ERP system
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <label htmlFor="agent-input" className="block text-sm font-medium text-gray-700 mb-2">
            Agent Instructions
          </label>
          <textarea
            id="agent-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: Update lead time for Material #4521 from Supplier B to 45 days and increase safety stock by 10%..."
            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              The agent will automatically integrate your instructions with SAP ERP
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Execute
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Example Commands</h3>
          <div className="space-y-2">
            <button
              onClick={() => setInput('Convert this manual PDF scan purchase order into an PO ERP entry')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              Convert this manual PDF scan purchase order into an PO ERP entry
            </button>
            <button
              onClick={() => setInput('Update vendor master record for Supplier C with new payment terms Net 45')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              Update vendor master record for Supplier C with new payment terms Net 45
            </button>
            <button
              onClick={() => setInput('Block invoice payment for PO #1099 due to 50 unit shortage')}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              Block invoice payment for PO #1099 due to 50 unit shortage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
