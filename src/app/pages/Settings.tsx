import { useState, useEffect } from 'react';
import { Save, Loader2, PenLine, Settings2, Plus, X, Plug, Database } from 'lucide-react';
import { Button } from '../components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AGENT_MD_URL = '/api/azure/agent.md';
const CUSTOM_RULES_URL = '/api/azure/rules_custom.md';
const SEPARATOR = '\n\n--- CUSTOM RULES ---\n\n';

interface ApiConnection {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'available';
}

const DEFAULT_APIS: ApiConnection[] = [
  { id: 'shopify', name: 'Shopify API', description: 'E-commerce order and inventory sync', status: 'available' },
  { id: 'netsuite', name: 'NetSuite ERP', description: 'Financial and procurement data integration', status: 'available' },
  { id: 'salesforce', name: 'Salesforce CRM', description: 'Customer and opportunity pipeline sync', status: 'available' },
  { id: 'quickbooks', name: 'QuickBooks Online', description: 'Accounting and invoice automation', status: 'available' },
  { id: 'snowflake', name: 'Snowflake DW', description: 'Data warehouse query and analytics', status: 'available' },
  { id: 'twilio', name: 'Twilio SMS', description: 'Automated vendor SMS notifications', status: 'available' },
];

export function Settings() {
  const [baseContent, setBaseContent] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [isLoadingRules, setIsLoadingRules] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [apis, setApis] = useState<ApiConnection[]>(() => {
    try {
      const saved = localStorage.getItem('settings_apis');
      return saved ? JSON.parse(saved) : DEFAULT_APIS;
    } catch {
      return DEFAULT_APIS;
    }
  });
  const [showAvailable, setShowAvailable] = useState(false);

  useEffect(() => {
    localStorage.setItem('settings_apis', JSON.stringify(apis));
  }, [apis]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(AGENT_MD_URL);
        if (res.ok) {
          const text = await res.text();
          if (text.includes(SEPARATOR)) {
            const parts = text.split(SEPARATOR);
            setBaseContent(parts[0]);
            setCustomContent(parts.slice(1).join(SEPARATOR));
          } else {
            setBaseContent(text);
            const resCustom = await fetch(CUSTOM_RULES_URL);
            if (resCustom.ok) setCustomContent(await resCustom.text());
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingRules(false);
      }
    };
    load();
  }, []);

  const handleSaveRules = async () => {
    setIsSaving(true);
    setSaveMsg(null);
    try {
      await fetch(CUSTOM_RULES_URL, { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: customContent });
      const res = await fetch(AGENT_MD_URL, { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: baseContent + SEPARATOR + customContent });
      if (!res.ok) throw new Error();
      setSaveMsg({ type: 'success', text: 'Custom rules saved.' });
      setIsEditing(false);
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setSaveMsg({ type: 'error', text: 'Failed to save rules.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectApi = (id: string) => {
    setApis(prev => prev.map(a => a.id === id ? { ...a, status: 'connected' as const } : a));
  };

  const handleDisconnectApi = (id: string) => {
    setApis(prev => prev.map(a => a.id === id ? { ...a, status: 'available' as const } : a));
  };

  const connectedApis = apis.filter(a => a.status === 'connected');
  const availableApis = apis.filter(a => a.status === 'available');

  return (
    <div className="h-full flex flex-col overflow-hidden bg-grid-pattern-light bg-gray-50/50">
      {/* Header */}
      <div className="relative z-10 px-8 py-5 border-b border-gray-200/60 bg-white/80 backdrop-blur-md flex items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 p-2 rounded-lg">
            <Settings2 className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Settings</h1>
            <p className="text-xs text-gray-400">Manage integrations, notifications, and agent rules</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* Locally Added Dataset — new */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-gray-500" />
                <div>
                  <h2 className="font-semibold text-gray-900">Connected APIs</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Locally managed API integrations</p>
                </div>
              </div>
              <button
                onClick={() => setShowAvailable(!showAvailable)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add API
              </button>
            </div>

            {/* Connected APIs */}
            <div className="p-4 space-y-2">
              {connectedApis.length === 0 && !showAvailable ? (
                <div className="text-center py-6 text-xs text-gray-400">
                  No custom API connections added yet. Click "Add API" to connect.
                </div>
              ) : (
                connectedApis.map(api => (
                  <div key={api.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{api.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{api.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDisconnectApi(api.id)}
                      className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                    >
                      Disconnect
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Available APIs to add */}
            {showAvailable && availableApis.length > 0 && (
              <div className="border-t border-gray-100">
                <div className="px-4 py-2 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Available APIs
                </div>
                <div className="p-4 space-y-2">
                  {availableApis.map(api => (
                    <div key={api.id} className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <Plug className="w-4 h-4 text-gray-400" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">{api.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{api.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleConnectApi(api.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Integrations */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Integrations</h2>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">SAP ERP</h3>
                  <p className="text-sm text-gray-500 mt-1">Connected to production environment</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">3PL WMS</h3>
                  <p className="text-sm text-gray-500 mt-1">Warehouse management system integration</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Email (SMTP/IMAP)</h3>
                  <p className="text-sm text-gray-500 mt-1">Vendor communication monitoring</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Connected</span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="p-4 space-y-3">
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <div>
                  <span className="font-medium text-gray-900">High priority alerts</span>
                  <p className="text-sm text-gray-500">Receive email notifications for high priority action items</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300" />
                <div>
                  <span className="font-medium text-gray-900">Daily summary</span>
                  <p className="text-sm text-gray-500">Get a daily digest of agent actions</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <div>
                  <span className="font-medium text-gray-900">Slack notifications</span>
                  <p className="text-sm text-gray-500">Send alerts to Slack channels</p>
                </div>
              </label>
            </div>
          </div>

          {/* Account */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Account</h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input type="text" defaultValue="Acme Manufacturing Co." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                <input type="email" defaultValue="admin@acme.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-sm" />
              </div>
            </div>
          </div>

          {/* Agent Rules */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Agent Rules</h2>
            </div>

            {isLoadingRules ? (
              <div className="flex items-center gap-2 p-6 text-gray-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading agent instructions...
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">agent.md</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">read-only</span>
                  </div>
                  <div className="p-4 max-h-64 overflow-y-auto">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{baseContent || '*No base instructions found.*'}</ReactMarkdown>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">rules_custom.md</span>
                    <div className="flex items-center gap-2">
                      {isEditing && (
                        <button onClick={() => setIsEditing(false)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
                      )}
                      <Button size="sm" onClick={isEditing ? handleSaveRules : () => setIsEditing(true)} disabled={isSaving} className="bg-gray-800 hover:bg-gray-900 h-7 text-xs">
                        {isSaving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <PenLine className="w-3 h-3 mr-1" />}
                        {isSaving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
                      </Button>
                    </div>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                      className="w-full p-4 text-sm text-gray-800 resize-none focus:outline-none leading-relaxed min-h-[120px] max-h-[240px]"
                      placeholder="Add custom rules here..."
                      spellCheck={false}
                      autoFocus
                    />
                  ) : (
                    <div onClick={() => setIsEditing(true)} className="p-4 cursor-text hover:bg-gray-50 transition-colors min-h-[60px]">
                      <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                        {customContent || <span className="text-gray-400 italic">No custom rules yet. Click to add some.</span>}
                      </div>
                    </div>
                  )}
                </div>

                {saveMsg && (
                  <p className={`text-sm font-medium ${saveMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{saveMsg.text}</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
