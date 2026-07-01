import { useState, useEffect, useRef } from 'react';
import {
  Loader2, RefreshCw, AlertCircle, TrendingUp, Calendar, CheckCircle,
  FileText, ChevronRight, Clock, Shield, AlertTriangle, Package,
  ArrowUpRight, ArrowDownRight, Minus, Activity, Download, Zap, BarChart3
} from 'lucide-react';
import { Button } from '../components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import { ThinkingTimer } from '../components/ThinkingTimer';
import { orderErrorItems, forecastingItems } from '../data/mockData';
import { forecastingProducts } from '../data/forecastingData';

const TARGET_URL = 'https://membrain-agent.jollygrass-e659853e.eastus2.azurecontainerapps.io/api/chat';
const STORAGE_KEY = 'daily_brief_content';
const STORAGE_TS_KEY = 'daily_brief_timestamp';
const PROMPT = "Run a comprehensive check accross all the data in azure ./localdata emails.json, erp-data.json, onedrive.json for any discrepancies, errors, or impending catatrophies. Also list potential risks. If needed for deeper inspection, use the RLM skill to parse out and inspect the data corpus. Every data or fact you list you must cite parenthetically. For example (SAP, Sales Order Table). It should be formatted as a daily brief and update. Do not make new outside internet queries.";

const downloadAsWord = async (text: string, title: string) => {
  const htmlContent = await marked.parse(text);
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  const footer = "</body></html>";
  const html = header + htmlContent + footer;
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' };
    case 'medium': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' };
    default: return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' };
  }
}

function getRiskColor(risk: string) {
  switch (risk) {
    case 'high': return 'text-red-600';
    case 'medium': return 'text-amber-600';
    default: return 'text-emerald-600';
  }
}

function getRiskBg(risk: string) {
  switch (risk) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-amber-500';
    default: return 'bg-emerald-500';
  }
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function DailyBrief() {
  const [content, setContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefTimestamp, setBriefTimestamp] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedTs = localStorage.getItem(STORAGE_TS_KEY);
    if (saved) {
      setContent(saved);
      setBriefTimestamp(savedTs);
    } else {
      generateBrief();
    }
  }, []);

  const generateBrief = async () => {
    setIsGenerating(true);
    setContent('');
    setBriefTimestamp(null);
    try {
      const res = await fetch(TARGET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: PROMPT })
      });
      const data = await res.json();
      let responseText = data.response || 'No response.';
      const lobsterIndex = responseText.indexOf('🦞');
      if (lobsterIndex !== -1) responseText = responseText.split('🦞').slice(1).join('🦞').trim();

      const now = new Date().toISOString();
      setContent(responseText);
      setBriefTimestamp(now);
      localStorage.setItem(STORAGE_KEY, responseText);
      localStorage.setItem(STORAGE_TS_KEY, now);
    } catch (err) {
      setContent('Error generating brief. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TS_KEY);
    generateBrief();
  };

  const activeErrors = orderErrorItems.filter(i => i.status === 'pending');
  const highErrors = activeErrors.filter(i => i.priority === 'high');
  const activeForecasts = forecastingItems.filter(i => i.status === 'pending');

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const totalRisks = activeErrors.length + activeForecasts.length;
  const criticalCount = highErrors.length + activeForecasts.filter(f => f.priority === 'high').length;

  return (
    <div className="h-full flex flex-col bg-[#fafbfc]">
      {/* ── Top Hero Bar ── */}
      <div className="shrink-0 bg-white border-b border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-indigo-400 text-xs font-semibold tracking-wide uppercase">{dateStr}</p>
            <h1 className="text-2xl font-bold mt-1 tracking-tight text-gray-900">{greeting} ☀️</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {briefTimestamp
                ? `Last generated ${new Date(briefTimestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                : 'AI-powered operations overview'
              }
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {content && !isGenerating && (
              <button
                onClick={() => downloadAsWord(content, `Daily-Brief-${now.toISOString().split('T')[0]}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 text-sm font-medium transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Analyzing...' : 'Refresh Brief'}
            </button>
          </div>
        </div>

        {/* ── Summary KPI Strip ── */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            {
              label: 'Order Errors',
              value: activeErrors.length,
              sub: `${highErrors.length} critical`,
              icon: AlertCircle,
              iconColor: activeErrors.length > 0 ? 'text-red-500' : 'text-emerald-500',
              subColor: activeErrors.length > 0 ? 'text-red-500' : 'text-emerald-500',
              iconBg: activeErrors.length > 0 ? 'bg-red-50' : 'bg-emerald-50',
            },
            {
              label: 'Forecast Alerts',
              value: activeForecasts.length,
              sub: 'active warnings',
              icon: TrendingUp,
              iconColor: activeForecasts.length > 0 ? 'text-amber-500' : 'text-emerald-500',
              subColor: activeForecasts.length > 0 ? 'text-amber-500' : 'text-emerald-500',
              iconBg: activeForecasts.length > 0 ? 'bg-amber-50' : 'bg-emerald-50',
            },
            {
              label: 'Total Risks',
              value: totalRisks,
              sub: `${criticalCount} need action`,
              icon: Shield,
              iconColor: criticalCount > 0 ? 'text-orange-500' : 'text-emerald-500',
              subColor: criticalCount > 0 ? 'text-orange-500' : 'text-emerald-500',
              iconBg: criticalCount > 0 ? 'bg-orange-50' : 'bg-emerald-50',
            },
            {
              label: 'System Status',
              value: 'Online',
              sub: 'All systems operational',
              icon: Activity,
              iconColor: 'text-emerald-500',
              subColor: 'text-emerald-500',
              iconBg: 'bg-emerald-50',
            }
          ].map((kpi, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${kpi.iconBg} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">{kpi.label}</p>
                <p className="text-gray-900 text-lg font-bold leading-tight">{kpi.value}</p>
                <p className={`text-[11px] ${kpi.subColor} truncate font-medium`}>{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">

          {/* ── LEFT: Brief Content (8 cols) ── */}
          <div className="col-span-12 lg:col-span-8" ref={containerRef}>
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-7 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900 text-sm">Intelligence Report</h2>
                </div>
                {briefTimestamp && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(briefTimestamp).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Content body */}
              <div className="px-7 py-5 md:px-10 md:py-6">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">Generating Intelligence Report</p>
                      <p className="text-xs text-gray-400 mt-1">Scanning ERP, Outlook, and OneDrive data lakes...</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-5 py-2.5 border border-gray-100">
                      <ThinkingTimer label="Agent processing" />
                    </div>
                  </div>
                ) : content ? (
                  <div className="prose prose-base font-sans max-w-none text-[#1f2937]
                    prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:tracking-tight
                    prose-h1:text-xl prose-h1:border-b prose-h1:border-gray-100 prose-h1:pb-3 prose-h1:mb-4
                    prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-2
                    prose-h3:text-base prose-h3:mt-4
                    prose-p:leading-[1.7] prose-p:text-[14.5px] prose-p:text-gray-700 prose-p:my-2
                    prose-li:text-[14.5px] prose-li:leading-[1.7] prose-li:text-gray-700
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                    prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
                    prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:rounded-xl
                    prose-table:text-sm prose-th:bg-gray-50 prose-th:font-semibold
                    prose-hr:border-gray-100
                    prose-ul:my-2 prose-ol:my-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
                    <FileText className="w-10 h-10 text-gray-200" />
                    <p className="text-sm font-medium">No brief available</p>
                    <p className="text-xs">Click "Refresh Brief" to generate one</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Dashboard Panels (4 cols) ── */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">

            {/* ── Order Errors Panel ── */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Order Errors</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                  {activeErrors.length}
                </span>
              </div>
              <div className="p-3 space-y-2 max-h-[320px] overflow-y-auto">
                {activeErrors.map(err => {
                  const colors = getPriorityColor(err.priority);
                  return (
                    <div key={err.id} className={`p-3 rounded-xl border ${colors.border} ${colors.bg} transition-all hover:shadow-sm`}>
                      <div className="flex items-start gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${colors.dot} mt-1.5 shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-gray-900 text-sm truncate">{err.title}</p>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${colors.badge}`}>
                              {err.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{err.discrepancy}</p>
                          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(err.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Forecasting Panel ── */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Forecasting</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  {activeForecasts.length} Alert{activeForecasts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="p-3 space-y-2">
                {activeForecasts.map(fc => {
                  const colors = getPriorityColor(fc.priority);
                  return (
                    <div key={fc.id} className={`p-3 rounded-xl border ${colors.border} ${colors.bg}`}>
                      <div className="flex items-start gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${colors.dot} mt-1.5 shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm">{fc.title}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{fc.discrepancy}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inventory Risk Snapshot */}
              <div className="px-5 pb-4 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">Inventory Risk Levels</p>
                <div className="space-y-3">
                  {forecastingProducts.map(p => (
                    <div key={p.sku} className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 w-24 shrink-0">
                        <Package className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-mono font-medium text-gray-600">{p.sku}</span>
                      </div>
                      <div className="flex-1">
                        <MiniBar value={p.currentStock} max={1000} color={getRiskBg(p.riskLevel)} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${getRiskColor(p.riskLevel)}`}>
                        {p.riskLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Daily Tasks Panel ── */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Daily Tasks</h3>
                </div>
                <a href="#/agent-suite" className="text-xs text-indigo-600 font-medium flex items-center gap-0.5 hover:text-indigo-700 transition-colors">
                  View All
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
              <DailyTasksFetcher />
            </div>

            {/* ── Quick Stats Panel ── */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-sm text-gray-900">Operations Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'POs Active', value: '12', trend: 'up' },
                  { label: 'Vendors', value: '24', trend: 'stable' },
                  { label: 'Open SKUs', value: '4', trend: 'down' },
                  { label: 'SLA Compliance', value: '94%', trend: 'up' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">{stat.label}</p>
                    <div className="flex items-end justify-between mt-1">
                      <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                      {stat.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />}
                      {stat.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
                      {stat.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-gray-300" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Daily Tasks Fetcher ── */
function DailyTasksFetcher() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/azure/agent-tasks.json');
        if (res.ok) {
          const text = await res.text();
          if (text) {
            const parsed = JSON.parse(text);
            setTasks(Array.isArray(parsed) ? parsed : []);
          }
        }
      } catch { }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
      </div>
    );
  }

  const todoTasks = tasks.filter(t => t.status === 'todo' || t.status === 'doing');
  const doneTasks = tasks.filter(t => t.status === 'done');

  if (tasks.length === 0) {
    return (
      <div className="p-5 flex flex-col items-center text-center gap-2">
        <CheckCircle className="w-8 h-8 text-gray-200" />
        <p className="text-xs text-gray-400">No tasks loaded. Visit Agent Suite to create tasks.</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Progress bar */}
      <div className="px-2 pb-3">
        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1.5">
          <span className="uppercase tracking-wider font-medium">Progress</span>
          <span className="font-bold text-gray-600">{doneTasks.length}/{tasks.length} done</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
            style={{ width: `${tasks.length ? (doneTasks.length / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-1.5 max-h-[250px] overflow-y-auto">
        {todoTasks.slice(0, 5).map(task => (
          <div key={task.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center ${
              task.status === 'doing'
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-gray-300'
            }`}>
              {task.status === 'doing' && <div className="w-2 h-2 rounded-sm bg-indigo-500" />}
            </div>
            <span className="text-sm text-gray-700 truncate flex-1">{task.title}</span>
            {task.status === 'doing' && (
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-medium shrink-0">In Progress</span>
            )}
          </div>
        ))}
        {doneTasks.slice(0, 2).map(task => (
          <div key={task.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg opacity-60">
            <div className="w-4 h-4 rounded border-2 border-emerald-400 bg-emerald-50 shrink-0 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
            </div>
            <span className="text-sm text-gray-500 truncate flex-1 line-through">{task.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
