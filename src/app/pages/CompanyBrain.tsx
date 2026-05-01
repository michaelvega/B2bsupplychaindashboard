import { useState, useEffect, useRef } from 'react';
import { Brain, RefreshCw, Database, Mail, FolderOpen, CheckCircle, XCircle, Clock, Paperclip, FileSpreadsheet, FileText, Folder, AlertTriangle, MessageSquare, Send, Bot, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ThinkingTimer } from '../components/ThinkingTimer';

const ERP_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/erp-data-lake';
const COMPOSIO_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/composio';

const CACHE_ERP = '/api/azure/localdata/erp-data.json';
const CACHE_EMAILS = '/api/azure/localdata/emails.json';
const CACHE_ONEDRIVE = '/api/azure/localdata/onedrive.json';
const TARGET_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/chat';
const CHAT_STORAGE_KEY = 'company_brain_chat_history';

type ScanStatus = 'idle' | 'scanning' | 'done' | 'error';

interface SectionState {
  status: ScanStatus;
  lastUpdated: string | null;
  data: any;
}

const emptySection = (): SectionState => ({ status: 'idle', data: null, lastUpdated: null });

function getMimeIcon(mimeType?: string) {
  if (!mimeType) return <Folder className="w-4 h-4 text-blue-400" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
  if (mimeType.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
  return <FileText className="w-4 h-4 text-gray-400" />;
}

async function saveToAzure(path: string, data: any) {
  const body = JSON.stringify(data, null, 2);
  await fetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

async function loadFromAzure(path: string): Promise<{ ok: boolean; data: any }> {
  try {
    const res = await fetch(path);
    if (!res.ok) return { ok: false, data: null };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false, data: null };
  }
}

export function CompanyBrain() {
  const [erp, setErp] = useState<SectionState>(emptySection());
  const [emails, setEmails] = useState<SectionState>(emptySection());
  const [onedrive, setOnedrive] = useState<SectionState>(emptySection());
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'agent', content: string }[]>([]);
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatTopRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // On mount, try to load cached data
  useEffect(() => {
    (async () => {
      const [e, m, o] = await Promise.all([
        loadFromAzure(CACHE_ERP),
        loadFromAzure(CACHE_EMAILS),
        loadFromAzure(CACHE_ONEDRIVE),
      ]);
      if (e.ok) setErp({ status: 'done', data: e.data.data, lastUpdated: e.data.cachedAt });
      if (m.ok) setEmails({ status: 'done', data: m.data.data, lastUpdated: m.data.cachedAt });
      if (o.ok) setOnedrive({ status: 'done', data: o.data.data, lastUpdated: o.data.cachedAt });
      if (e.ok || m.ok || o.ok) setLastScan(e.data?.cachedAt || m.data?.cachedAt || o.data?.cachedAt || null);
    })();

    // Load chat history
    const savedChat = localStorage.getItem(CHAT_STORAGE_KEY);
    if (savedChat) {
      try {
        setChatHistory(JSON.parse(savedChat));
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Scroll management
  useEffect(() => {
    if (isGeneratingChat) {
      // While generating, scroll to bottom to show progress
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (chatHistory.length > 0) {
      // When done generating, scroll to the top of the chat section as requested
      chatTopRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isGeneratingChat]);

  const handleSendChat = async (messageOverride?: string) => {
    const messageToSend = messageOverride || chatInput;
    if (!messageToSend.trim() || isGeneratingChat) return;

    if (!messageOverride) setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: messageToSend }]);
    setIsGeneratingChat(true);

    try {
      const res = await fetch(TARGET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });
      const data = await res.json();
      let responseText = data.response || 'No response.';
      const lobsterIndex = responseText.indexOf('🦞');
      if (lobsterIndex !== -1) responseText = responseText.split('🦞').slice(1).join('🦞').trim();

      setChatHistory(prev => [...prev, { role: 'agent', content: responseText }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'agent', content: 'Connection error.' }]);
    } finally {
      setIsGeneratingChat(false);
    }
  };


  const cancelScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsScanning(false);
      setErp(s => ({ ...s, status: s.status === 'scanning' ? 'idle' : s.status }));
      setEmails(s => ({ ...s, status: s.status === 'scanning' ? 'idle' : s.status }));
      setOnedrive(s => ({ ...s, status: s.status === 'scanning' ? 'idle' : s.status }));
    }
  };

  const scanAll = async () => {
    setIsScanning(true);
    const now = new Date().toISOString();

    // Setup AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // --- ERP ---
    setErp(s => ({ ...s, status: 'scanning' }));
    try {
      const res = await fetch(ERP_URL, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
        signal
      });
      if (!res.ok) throw new Error('ERP fetch failed');
      const data = await res.json();
      await saveToAzure(CACHE_ERP, { cachedAt: now, data });
      setErp({ status: 'done', data, lastUpdated: now });
    } catch (e: any) {
      if (e.name !== 'AbortError') setErp(s => ({ ...s, status: 'error' }));
    }

    // --- Emails ---
    setEmails(s => ({ ...s, status: 'scanning' }));
    try {
      const res = await fetch(COMPOSIO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ command: "execute OUTLOOK_QUERY_EMAILS --account proceptai@outlook.com -d '{\"top\":15,\"folder\":\"inbox\",\"orderby\":\"receivedDateTime desc\"}'" }),
        signal
      });
      const json = await res.json();
      const emailList = json?.output ? JSON.parse(json.output)?.data?.value : json?.data?.value;
      await saveToAzure(CACHE_EMAILS, { cachedAt: now, data: emailList });
      setEmails({ status: 'done', data: emailList, lastUpdated: now });
    } catch (e: any) {
      if (e.name !== 'AbortError') setEmails(s => ({ ...s, status: 'error' }));
    }

    // --- OneDrive ---
    setOnedrive(s => ({ ...s, status: 'scanning' }));
    try {
      const res = await fetch(COMPOSIO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ command: "execute ONE_DRIVE_LIST_FOLDER_CHILDREN -d '{\"drive_id\":\"6631d2fa1dc0782d\",\"folder_path\":\"/\"}'" }),
        signal
      });
      const json = await res.json();
      const items = json?.output ? JSON.parse(json.output)?.data?.value : json?.data?.value;
      await saveToAzure(CACHE_ONEDRIVE, { cachedAt: now, data: items });
      setOnedrive({ status: 'done', data: items, lastUpdated: now });
    } catch (e: any) {
      if (e.name !== 'AbortError') setOnedrive(s => ({ ...s, status: 'error' }));
    }

    if (!signal.aborted) {
      setLastScan(now);
      setIsScanning(false);
      // Auto-send "TODO" after data is updated
      handleSendChat("Run a comprehensive check accross all the data in azure ./localdata emails.json, erp-data.json, onedrive.json for any discrepancies, errors, or impending catatrophies. Also list potential risks. If needed for deeper inspection, use the RLM skill to parse out and inspect the data corpus. Do not make new outside internet queries.");
    }
  };

  const statusIcon = (s: ScanStatus) => {
    if (s === 'scanning') return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
    if (s === 'done') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (s === 'error') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleString() : 'Never';

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Company Brain</h1>
              <p className="text-sm text-gray-500">
                {lastScan ? `Last synced: ${fmtDate(lastScan)}` : 'No data scanned yet. Click Scan All Data to begin.'}
              </p>
            </div>
          </div>
          <Button
            onClick={scanAll}
            disabled={isScanning}
            className="bg-indigo-600 hover:bg-indigo-700 gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan All Data'}
          </Button>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-4 mt-4">
          {[
            { label: 'ERP Data', state: erp },
            { label: 'Outlook Emails', state: emails },
            { label: 'OneDrive', state: onedrive },
          ].map(({ label, state }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm text-gray-600">
              {statusIcon(state.status)}
              <span className="font-medium">{label}</span>
              {state.lastUpdated && (
                <span className="text-gray-400 text-xs">· {fmtDate(state.lastUpdated)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 relative">

        {/* ── CANCEL SCAN OVERLAY ── */}
        {isScanning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 border border-indigo-100 animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <RefreshCw className="w-16 h-16 text-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">Scanning Data Lake</h3>
                <p className="text-gray-500 mt-1 text-sm">This may take a moment while we process your ERP and files.</p>
              </div>

              {/* Mirror Status Pills in Overlay */}
              <div className="grid grid-cols-1 gap-3 w-full max-w-[240px]">
                {[
                  { label: 'ERP Data', state: erp },
                  { label: 'Outlook Emails', state: emails },
                  { label: 'OneDrive', state: onedrive },
                ].map(({ label, state }) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2">
                      {statusIcon(state.status)}
                      <span className="text-sm font-semibold text-gray-700">{label}</span>
                    </div>
                    {state.status === 'scanning' && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full animate-pulse font-bold uppercase tracking-wider">Syncing</span>
                    )}
                    {state.status === 'done' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
              <Button
                onClick={cancelScan}
                className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-8 py-6 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Cancel Scan
              </Button>
            </div>
          </div>
        )}

        {/* ── AGENT CHAT ── */}
        <div ref={chatTopRef} className={`bg-white rounded-xl border border-indigo-200 shadow-sm overflow-hidden flex flex-col h-[500px] ${isScanning ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-indigo-50/30">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">Agent Brain Hub</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Connected to Main Agent</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gray-50/30">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <MessageSquare className="w-8 h-8 opacity-20" />
                <p className="text-sm">Ask anything about your company data...</p>
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <div key={i} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-gray-100">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isGeneratingChat && (
              <div className="flex w-full justify-start">
                <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm bg-white border border-indigo-100 rounded-bl-none flex items-center gap-2 text-indigo-600 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <ThinkingTimer label="Agent is thinking" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="relative flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isScanning || isGeneratingChat}
                placeholder={isScanning ? "Waiting for scan to complete..." : "Message your agent..."}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={isScanning || isGeneratingChat || !chatInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 h-[44px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* ── ERP DATA ── */}
        <Section icon={<Database className="w-5 h-5 text-blue-600" />} title="ERP Data Lake" color="blue" status={erp.status} lastUpdated={erp.lastUpdated}>
          {erp.data ? (
            <div className="space-y-4">
              {Object.entries(erp.data as Record<string, any[]>).map(([table, rows]) => (
                <div key={table}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{table}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{rows.length} records</span>
                  </div>
                  {rows.length === 0 ? (
                    <p className="text-sm text-gray-400 italic pl-2">No records</p>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            {Object.keys(rows[0]).map(k => (
                              <th key={k} className="px-3 py-2 font-semibold text-gray-600 whitespace-nowrap">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {rows.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              {Object.values(row).map((val: any, j) => (
                                <td key={j} className="px-3 py-2 text-gray-700 whitespace-nowrap font-mono">{String(val ?? '—')}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : <EmptyState scanning={erp.status === 'scanning'} label="ERP data" />}
        </Section>

        {/* ── EMAILS ── */}
        <Section icon={<Mail className="w-5 h-5 text-violet-600" />} title="Outlook Inbox (Latest 15)" color="violet" status={emails.status} lastUpdated={emails.lastUpdated}>
          {emails.data && Array.isArray(emails.data) ? (
            <div className="space-y-2">
              {emails.data.map((email: any) => (
                <a
                  key={email.id}
                  href={email.webLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-violet-200 hover:bg-violet-50/40 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-sm font-bold text-violet-600 uppercase">
                    {email.from?.emailAddress?.name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium truncate ${!email.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {email.subject || '(No subject)'}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {new Date(email.receivedDateTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{email.from?.emailAddress?.name} · {email.from?.emailAddress?.address}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{email.bodyPreview}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {email.hasAttachments && <Paperclip className="w-3.5 h-3.5 text-gray-400" />}
                    {!email.isRead && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                  </div>
                </a>
              ))}
            </div>
          ) : <EmptyState scanning={emails.status === 'scanning'} label="email data" />}
        </Section>

        {/* ── ONEDRIVE ── */}
        <Section icon={<FolderOpen className="w-5 h-5 text-emerald-600" />} title="OneDrive Root" color="emerald" status={onedrive.status} lastUpdated={onedrive.lastUpdated}>
          {onedrive.data && Array.isArray(onedrive.data) ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {onedrive.data.map((item: any) => (
                <a
                  key={item.id}
                  href={item.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors group"
                >
                  {item.folder ? <Folder className="w-4 h-4 text-blue-400 shrink-0" /> : getMimeIcon(item.file?.mimeType)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.folder ? `${item.folder.childCount} items` : `${(item.size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : <EmptyState scanning={onedrive.status === 'scanning'} label="OneDrive data" />}
        </Section>

      </div>
    </div>
  );
}

function Section({ icon, title, color, status, lastUpdated, children }: {
  icon: React.ReactNode;
  title: string;
  color: string;
  status: ScanStatus;
  lastUpdated: string | null;
  children: React.ReactNode;
}) {
  const borderColors: Record<string, string> = {
    blue: 'border-blue-200',
    violet: 'border-violet-200',
    emerald: 'border-emerald-200',
  };
  return (
    <div className={`bg-white rounded-xl border ${borderColors[color] || 'border-gray-200'} shadow-sm overflow-hidden`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-gray-900">{title}</h2>
          {status === 'scanning' && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium animate-pulse">Scanning...</span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-medium">
              <AlertTriangle className="w-3 h-3" /> Error
            </span>
          )}
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-400">Updated {new Date(lastUpdated).toLocaleString()}</span>
        )}
      </div>
      <div className="p-6 max-h-[400px] overflow-y-auto">{children}</div>
    </div>
  );
}

function EmptyState({ scanning, label }: { scanning: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
      {scanning ? (
        <RefreshCw className="w-8 h-8 animate-spin mb-3 text-blue-400" />
      ) : (
        <Brain className="w-8 h-8 mb-3" />
      )}
      <p className="text-sm">{scanning ? `Fetching ${label}...` : `No ${label} yet. Click "Scan All Data" to load.`}</p>
    </div>
  );
}
