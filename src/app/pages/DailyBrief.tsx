import { useState, useEffect, useRef } from 'react';
import {
  Loader2, RefreshCw, AlertCircle, TrendingUp, Calendar, CheckCircle,
  FileText, ChevronRight, Clock, Shield, AlertTriangle, Package,
  ArrowUpRight, ArrowDownRight, Minus, Activity, Download, Zap, BarChart3,
  Truck, Anchor
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import { ThinkingTimer } from '../components/ThinkingTimer';
import { orderErrorItems, forecastingItems } from '../data/mockData';
import { forecastingProducts } from '../data/forecastingData';
import {
  ResponsiveContainer, ComposedChart, Line, Area, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const TARGET_URL = 'https://membrain-agent.jollygrass-e659853e.eastus2.azurecontainerapps.io/api/chat';
const STORAGE_KEY = 'daily_brief_content';
const STORAGE_TS_KEY = 'daily_brief_timestamp';
const PROMPT = "Run a comprehensive check accross all the data in azure ./localdata emails.json, erp-data.json, onedrive.json for any discrepancies, errors, or impending catatrophies. Also list potential risks. If needed for deeper inspection, use the RLM skill to parse out and inspect the data corpus. Every data or fact you list you must cite parenthetically. For example (SAP, Sales Order Table). It should be formatted as a daily brief and update. Do not make new outside internet queries.";

/* Chart data: 30-day supply chain metrics */
const CHART_DATA = [
  { day: 'Jun 1', shipments: 820, orders: 145, inventory: 92, delays: 12 },
  { day: 'Jun 2', shipments: 832, orders: 151, inventory: 91, delays: 8 },
  { day: 'Jun 3', shipments: 815, orders: 138, inventory: 93, delays: 15 },
  { day: 'Jun 4', shipments: 845, orders: 162, inventory: 90, delays: 6 },
  { day: 'Jun 5', shipments: 860, orders: 170, inventory: 87, delays: 4 },
  { day: 'Jun 6', shipments: 855, orders: 168, inventory: 88, delays: 5 },
  { day: 'Jun 7', shipments: 840, orders: 155, inventory: 89, delays: 10 },
  { day: 'Jun 8', shipments: 870, orders: 180, inventory: 85, delays: 3 },
  { day: 'Jun 9', shipments: 880, orders: 185, inventory: 83, delays: 2 },
  { day: 'Jun 10', shipments: 865, orders: 175, inventory: 84, delays: 7 },
  { day: 'Jun 11', shipments: 850, orders: 160, inventory: 86, delays: 11 },
  { day: 'Jun 12', shipments: 875, orders: 182, inventory: 82, delays: 4 },
  { day: 'Jun 13', shipments: 890, orders: 190, inventory: 80, delays: 2 },
  { day: 'Jun 14', shipments: 895, orders: 195, inventory: 78, delays: 1 },
  { day: 'Jun 15', shipments: 885, orders: 188, inventory: 79, delays: 3 },
  { day: 'Jun 16', shipments: 900, orders: 200, inventory: 76, delays: 0 },
  { day: 'Jun 17', shipments: 910, orders: 205, inventory: 74, delays: 2 },
  { day: 'Jun 18', shipments: 905, orders: 198, inventory: 75, delays: 5 },
  { day: 'Jun 19', shipments: 920, orders: 210, inventory: 72, delays: 1 },
  { day: 'Jun 20', shipments: 915, orders: 208, inventory: 73, delays: 3 },
  { day: 'Jun 21', shipments: 930, orders: 215, inventory: 70, delays: 0 },
  { day: 'Jun 22', shipments: 925, orders: 212, inventory: 71, delays: 2 },
  { day: 'Jun 23', shipments: 940, orders: 220, inventory: 68, delays: 1 },
  { day: 'Jun 24', shipments: 935, orders: 218, inventory: 69, delays: 4 },
  { day: 'Jun 25', shipments: 950, orders: 225, inventory: 65, delays: 0 },
  { day: 'Jun 26', shipments: 945, orders: 222, inventory: 66, delays: 2 },
  { day: 'Jun 27', shipments: 960, orders: 230, inventory: 63, delays: 1 },
  { day: 'Jun 28', shipments: 955, orders: 228, inventory: 64, delays: 3 },
  { day: 'Jun 29', shipments: 970, orders: 235, inventory: 60, delays: 0 },
  { day: 'Jun 30', shipments: 965, orders: 232, inventory: 62, delays: 1 },
];

const downloadAsWord = async (text: string, title: string) => {
  const htmlContent = await marked.parse(text);
  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  const footer = "</body></html>";
  const html = header + htmlContent + footer;
  const blob = new Blob(['﻿', html], { type: 'application/msword' });
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
      const responseText = data.response || 'No response.';

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
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const totalRisks = activeErrors.length + activeForecasts.length;
  const criticalCount = highErrors.length + activeForecasts.filter(f => f.priority === 'high').length;

  const kpiCards = [
    {
      label: 'Order Errors',
      value: activeErrors.length,
      sub: `${highErrors.length} critical`,
      icon: AlertCircle,
      iconBg: activeErrors.length > 0 ? 'bg-red-50' : 'bg-emerald-50',
      iconColor: activeErrors.length > 0 ? 'text-red-500' : 'text-emerald-500',
      subColor: activeErrors.length > 0 ? 'text-red-500' : 'text-emerald-500',
    },
    {
      label: 'Forecast Alerts',
      value: activeForecasts.length,
      sub: 'active warnings',
      icon: TrendingUp,
      iconBg: activeForecasts.length > 0 ? 'bg-amber-50' : 'bg-emerald-50',
      iconColor: activeForecasts.length > 0 ? 'text-amber-500' : 'text-emerald-500',
      subColor: activeForecasts.length > 0 ? 'text-amber-500' : 'text-emerald-500',
    },
    {
      label: 'Active Shipments',
      value: 847,
      sub: 'in transit',
      icon: Truck,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-500',
      subColor: 'text-sky-500',
    },
    {
      label: 'Port Congestion',
      value: 'Moderate',
      sub: 'LA/LB +2.4 days',
      icon: Anchor,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      subColor: 'text-amber-500',
    },
  ];

  const opsStats = [
    { label: 'POs Active', value: '12', trend: 'up', delta: '+3' },
    { label: 'Vendors', value: '24', trend: 'stable', delta: '--' },
    { label: 'Open SKUs', value: '4', trend: 'down', delta: '-2' },
    { label: 'SLA Compliance', value: '94%', trend: 'up', delta: '+1.2%' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#fafbfc]">
      {/* Top Bar */}
      <div className="shrink-0 bg-white border-b border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-indigo-400 text-[11px] font-semibold tracking-[0.12em] uppercase">{dateStr}</p>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 mt-0.5">
                {greeting}
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Live</span>
              <span className="text-gray-200 mx-1">|</span>
              <span>{timeStr} UTC</span>
            </div>
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
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Supply Chain Trend Chart */}
        <div className="max-w-[1500px] mx-auto px-6 pt-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/30">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <h2 className="font-semibold text-gray-900 text-sm">Supply Chain Performance</h2>
                <span className="text-[10px] text-gray-400 font-medium ml-2">Last 30 Days</span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />Shipments</span>
                <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Orders</span>
                <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />Delays</span>
              </div>
            </div>
            <div className="px-4 py-4" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={CHART_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="shipmentsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    interval={4}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 1050]}
                    tickCount={6}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 20]}
                    tickCount={5}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      fontSize: 12,
                      padding: '10px 14px',
                    }}
                    labelStyle={{ fontWeight: 600, color: '#1e293b', marginBottom: 4 }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="shipments"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#shipmentsGrad)"
                    name="Shipments"
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#ordersGrad)"
                    name="Orders"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="delays"
                    fill="#f87171"
                    radius={[3, 3, 0, 0]}
                    barSize={8}
                    name="Delays"
                    opacity={0.7}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="max-w-[1500px] mx-auto px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((kpi, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)]
                           hover:border-gray-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                    <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
                  </div>
                  {kpi.label === 'Active Shipments' && (
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  )}
                  {kpi.label === 'Port Congestion' && (
                    <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Watch
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-[0.1em] mb-1">{kpi.label}</p>
                <p className="text-gray-900 text-2xl font-bold tracking-tight tabular-nums">{kpi.value}</p>
                <p className={`text-[11px] ${kpi.subColor} mt-0.5 font-medium`}>{kpi.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Panels */}
        <div className="max-w-[1500px] mx-auto px-6 pt-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Order Errors */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Order Errors</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                  {activeErrors.length}
                </span>
              </div>
              <div className="p-3 space-y-2 max-h-[340px] overflow-y-auto">
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
                {activeErrors.length === 0 && (
                  <div className="py-8 text-center text-gray-400 text-sm">No open errors</div>
                )}
              </div>
            </div>

            {/* Forecasting */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
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
              {/* Inventory Risk */}
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

            {/* Operations Summary + Tasks */}
            <div className="flex flex-col gap-5">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-sm text-gray-900">Operations Summary</h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {opsStats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">{stat.label}</p>
                      <div className="flex items-end justify-between mt-1">
                        <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                        <div className="flex items-center gap-0.5">
                          {stat.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />}
                          {stat.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
                          {stat.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-gray-300" />}
                          <span className={`text-[10px] font-medium ${
                            stat.trend === 'up' ? 'text-emerald-500' :
                            stat.trend === 'down' ? 'text-red-500' : 'text-gray-300'
                          }`}>
                            {stat.delta}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Tasks */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
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
            </div>
          </div>
        </div>

        {/* INTELLIGENCE REPORT (Bottom) */}
        <div className="max-w-[1500px] mx-auto px-6 py-6" ref={containerRef}>
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
      </div>
    </div>
  );
}

/* Daily Tasks Fetcher */
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
