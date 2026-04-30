import { useState, useEffect } from 'react';
import { Save, Loader2, PenLine } from 'lucide-react';
import { Button } from '../components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AGENT_MD_URL = '/api/azure/agent.md';
const CUSTOM_RULES_URL = '/api/azure/rules_custom.md';
const SEPARATOR = '\n\n--- CUSTOM RULES ---\n\n';

export function Settings() {
  const [baseContent, setBaseContent] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [isLoadingRules, setIsLoadingRules] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
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
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">3PL WMS</h3>
                <p className="text-sm text-gray-600 mt-1">Warehouse management system integration</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Email (SMTP/IMAP)</h3>
                <p className="text-sm text-gray-600 mt-1">Vendor communication monitoring</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Connected</span>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input type="text" defaultValue="Acme Manufacturing Co." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <input type="email" defaultValue="admin@acme.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Agent Rules */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Agent Rules</h2>
          </div>

          {isLoadingRules ? (
            <div className="flex items-center gap-2 p-6 text-gray-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading agent instructions...
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Read-only agent.md */}
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

              {/* Editable custom rules */}
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">rules_custom.md</span>
                  <div className="flex items-center gap-2">
                    {isEditing && (
                      <button onClick={() => setIsEditing(false)} className="text-xs text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
                    )}
                    <Button size="sm" onClick={isEditing ? handleSaveRules : () => setIsEditing(true)} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 h-7 text-xs">
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
                  <div onClick={() => setIsEditing(true)} className="p-4 cursor-text hover:bg-indigo-50/30 transition-colors min-h-[60px]">
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

