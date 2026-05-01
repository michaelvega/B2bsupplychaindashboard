import { useState, useEffect } from 'react';
import { Brain, RefreshCw, Database, Mail, FolderOpen, CheckCircle, XCircle, Clock, Paperclip, FileSpreadsheet, FileText, Folder, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';

const ERP_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/erp-data-lake';
const COMPOSIO_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/composio';

const CACHE_ERP = '/api/azure/localdata/erp-data.json';
const CACHE_EMAILS = '/api/azure/localdata/emails.json';
const CACHE_ONEDRIVE = '/api/azure/localdata/onedrive.json';

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
  }, []);

  const scanAll = async () => {
    setIsScanning(true);
    const now = new Date().toISOString();

    // --- ERP ---
    setErp(s => ({ ...s, status: 'scanning' }));
    try {
      const res = await fetch(ERP_URL, { headers: { 'ngrok-skip-browser-warning': 'true' } });
      if (!res.ok) throw new Error('ERP fetch failed');
      const data = await res.json();
      await saveToAzure(CACHE_ERP, { cachedAt: now, data });
      setErp({ status: 'done', data, lastUpdated: now });
    } catch (e) {
      setErp(s => ({ ...s, status: 'error' }));
    }

    // --- Emails ---
    setEmails(s => ({ ...s, status: 'scanning' }));
    try {
      const res = await fetch(COMPOSIO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ command: "execute OUTLOOK_QUERY_EMAILS --account proceptai@outlook.com -d '{\"top\":15,\"folder\":\"inbox\",\"orderby\":\"receivedDateTime desc\"}'" }),
      });
      const json = await res.json();
      const emailList = json?.output ? JSON.parse(json.output)?.data?.value : json?.data?.value;
      await saveToAzure(CACHE_EMAILS, { cachedAt: now, data: emailList });
      setEmails({ status: 'done', data: emailList, lastUpdated: now });
    } catch {
      setEmails(s => ({ ...s, status: 'error' }));
    }

    // --- OneDrive ---
    setOnedrive(s => ({ ...s, status: 'scanning' }));
    try {
      const res = await fetch(COMPOSIO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify({ command: "execute ONE_DRIVE_LIST_FOLDER_CHILDREN -d '{\"drive_id\":\"6631d2fa1dc0782d\",\"folder_path\":\"/\"}'" }),
      });
      const json = await res.json();
      const items = json?.output ? JSON.parse(json.output)?.data?.value : json?.data?.value;
      await saveToAzure(CACHE_ONEDRIVE, { cachedAt: now, data: items });
      setOnedrive({ status: 'done', data: items, lastUpdated: now });
    } catch {
      setOnedrive(s => ({ ...s, status: 'error' }));
    }

    setLastScan(now);
    setIsScanning(false);
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
      <div className="flex-1 overflow-y-auto p-8 space-y-8">

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
      <div className="p-6">{children}</div>
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
