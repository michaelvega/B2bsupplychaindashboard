import { useState } from 'react';
import { monthlyStockData, macroMetrics } from '../data/forecastingData';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  Factory, Plus, X, Globe, TrendingUp, TrendingDown, Minus, Newspaper, ChevronDown, ChevronUp,
  Building2, Gauge
} from 'lucide-react';
import { cn } from '../components/ui/utils';

interface FactoryData {
  id: string;
  name: string;
  type: string;
  risk: 'low' | 'medium' | 'high';
  included: boolean;
}

interface FactorData {
  id: string;
  name: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  impact: string;
  included: boolean;
}

const DEFAULT_FACTORIES: FactoryData[] = [
  { id: 'f1', name: 'Electronics Assembly', type: 'Electronics', risk: 'low', included: true },
  { id: 'f2', name: 'Plastics Molding', type: 'Plastics', risk: 'medium', included: true },
  { id: 'f3', name: 'Metals Foundry', type: 'Metals', risk: 'high', included: true },
];

const MOCK_NEWS: Record<string, { headline: string; source: string; date: string; snippet: string }[]> = {
  'Global Steel Prices': [
    { headline: 'Steel tariffs shake global supply chains as prices climb 12%', source: 'Reuters', date: '2h ago', snippet: 'New trade restrictions on steel imports are driving up costs for manufacturers worldwide, with hot-rolled coil prices reaching multi-year highs.' },
    { headline: 'China steel output cuts could tighten global supply', source: 'Bloomberg', date: '1d ago', snippet: 'China\'s latest environmental mandates are expected to reduce steel production by 15M tons in Q3, impacting global availability.' },
    { headline: 'US steel mills announce capacity expansion plans', source: 'WSJ', date: '3d ago', snippet: 'Domestic producers are investing $3.2B in new capacity to meet rising demand and reduce import dependency.' },
  ],
  'Shipping Container Rates': [
    { headline: 'Container rates surge as Red Sea disruptions continue', source: 'Financial Times', date: '5h ago', snippet: 'Spot rates for 40ft containers from Asia to Europe have tripled since November, with no relief expected until Q4.' },
    { headline: 'Maersk warns of prolonged supply chain disruption', source: 'CNBC', date: '1d ago', snippet: 'The shipping giant revised its full-year guidance downward, citing unprecedented operational challenges in key trade lanes.' },
  ],
  'Copper Futures': [
    { headline: 'Copper prices ease as Chilean production stabilizes', source: 'Mining Weekly', date: '8h ago', snippet: 'Improved output from the world\'s largest copper producer has helped cool futures, offering relief to electrical manufacturers.' },
    { headline: 'EV demand continues to support copper outlook', source: 'Bloomberg', date: '2d ago', snippet: 'Despite short-term price dips, analysts remain bullish on copper through 2026, driven by electrification and renewable energy buildout.' },
  ],
  'Energy Costs (Oil)': [
    { headline: 'OPEC+ extends production cuts through Q3', source: 'Reuters', date: '6h ago', snippet: 'The cartel agreed to maintain current output levels, keeping crude prices elevated and pressuring logistics budgets globally.' },
    { headline: 'US shale production hits record, partially offsets cuts', source: 'EIA Report', date: '2d ago', snippet: 'Domestic production reached 13.4M barrels per day, providing some counterbalance to international supply constraints.' },
  ],
  'Typhoon Season (APAC)': [
    { headline: 'Super Typhoon Maliksi threatens Southeast Asian ports', source: 'BBC News', date: '4h ago', snippet: 'Category 4 storm expected to make landfall near major shipping hubs, with port closures likely affecting 15-20% of Pacific freight capacity.' },
    { headline: 'Supply chain contingency plans activated across APAC', source: 'SCMP', date: '1d ago', snippet: 'Manufacturers are rerouting shipments and building buffer stock ahead of what forecasters predict could be an unusually active typhoon season.' },
  ],
  'European Winter Freeze': [
    { headline: 'Mild winter forecast eases European energy concerns', source: 'Euronews', date: '1d ago', snippet: 'Updated seasonal models show above-average temperatures across the continent, reducing strain on heating fuel supplies and transit routes.' },
    { headline: 'Gas storage levels remain healthy heading into spring', source: 'FT Energy', date: '4d ago', snippet: 'European gas reserves sit at 58% capacity, well above the five-year average for this time of year.' },
  ],
};

const DEFAULT_NEWS: { headline: string; source: string; date: string; snippet: string }[] = [
  { headline: 'Supply chain industry outlook remains cautiously optimistic', source: 'Gartner', date: '1d ago', snippet: 'Analysts project moderate growth in global supply chain technology investments through 2026.' },
];

export function Forecasting() {
  const [factories, setFactories] = useState<FactoryData[]>(DEFAULT_FACTORIES);
  const [factors, setFactors] = useState<FactorData[]>(
    macroMetrics.map(m => ({ ...m, included: true }))
  );
  const [expandedNews, setExpandedNews] = useState<string | null>(null);
  const [showAddFactory, setShowAddFactory] = useState(false);
  const [showAddFactor, setShowAddFactor] = useState(false);
  const [newFactoryName, setNewFactoryName] = useState('');
  const [newFactoryType, setNewFactoryType] = useState('Electronics');
  const [newFactorName, setNewFactorName] = useState('');
  const [newFactorValue, setNewFactorValue] = useState('');
  const [newFactorTrend, setNewFactorTrend] = useState<'up' | 'down' | 'stable'>('stable');

  const includedFactories = factories.filter(f => f.included);
  const includedFactors = factors.filter(f => f.included);

  const handleAddFactory = () => {
    if (!newFactoryName.trim()) return;
    const risk = Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low';
    setFactories(prev => [...prev, {
      id: `f${Date.now()}`,
      name: newFactoryName.trim(),
      type: newFactoryType,
      risk: risk as 'low' | 'medium' | 'high',
      included: true,
    }]);
    setNewFactoryName('');
    setShowAddFactory(false);
  };

  const handleRemoveFactory = (id: string) => {
    setFactories(prev => prev.filter(f => f.id !== id));
  };

  const handleToggleFactory = (id: string) => {
    setFactories(prev => prev.map(f => f.id === id ? { ...f, included: !f.included } : f));
  };

  const handleAddFactor = () => {
    if (!newFactorName.trim()) return;
    setFactors(prev => [...prev, {
      id: `factor-${Date.now()}`,
      name: newFactorName.trim(),
      value: newFactorValue || 'N/A',
      trend: newFactorTrend,
      impact: 'Custom factor',
      included: true,
    }]);
    setNewFactorName('');
    setNewFactorValue('');
    setShowAddFactor(false);
  };

  const handleRemoveFactor = (id: string) => {
    setFactors(prev => prev.filter(f => f.id !== id));
  };

  const handleToggleFactor = (id: string) => {
    setFactors(prev => prev.map(f => f.id === id ? { ...f, included: !f.included } : f));
  };

  const getNewsForFactor = (name: string) => {
    return MOCK_NEWS[name] || DEFAULT_NEWS;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3.5 h-3.5 text-rose-500" />;
      case 'down': return <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Minus className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-grid-pattern bg-gray-50/80">
      {/* Header */}
      <div className="relative z-10 px-8 py-5 border-b border-gray-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 rounded-lg shadow-emerald-200 shadow-lg">
            <Factory className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Forecasting Command Center</h1>
            <p className="text-xs text-gray-400">
              {includedFactories.length} factories · {includedFactors.length} factors active
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-[1400px] mx-auto space-y-6">

          {/* Factory Manager */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-800">Factories</h2>
                <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{factories.length}</span>
              </div>
              <button
                onClick={() => setShowAddFactory(!showAddFactory)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Factory
              </button>
            </div>

            {showAddFactory && (
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <input
                  type="text"
                  value={newFactoryName}
                  onChange={e => setNewFactoryName(e.target.value)}
                  placeholder="Factory name..."
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  onKeyDown={e => e.key === 'Enter' && handleAddFactory()}
                />
                <select
                  value={newFactoryType}
                  onChange={e => setNewFactoryType(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option>Electronics</option>
                  <option>Plastics</option>
                  <option>Metals</option>
                  <option>Textiles</option>
                  <option>Chemicals</option>
                </select>
                <button
                  onClick={handleAddFactory}
                  disabled={!newFactoryName.trim()}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
                <button onClick={() => setShowAddFactory(false)} className="p-1.5 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {factories.map(factory => (
                <div
                  key={factory.id}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-lg border transition-all group",
                    factory.included
                      ? "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      : "bg-gray-50 border-gray-100 opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full flex-shrink-0",
                    getRiskColor(factory.risk),
                    factory.risk === 'high' && 'animate-pulse'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{factory.name}</p>
                    <p className="text-[11px] text-gray-400">{factory.type}</p>
                  </div>
                  <button
                    onClick={() => handleToggleFactory(factory.id)}
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors flex-shrink-0",
                      factory.included
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    )}
                  >
                    {factory.included ? 'Active' : 'Off'}
                  </button>
                  <button
                    onClick={() => handleRemoveFactory(factory.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {factories.length === 0 && (
                <div className="col-span-full text-center py-4 text-xs text-gray-400">
                  No factories added. Click "Add Factory" to get started.
                </div>
              )}
            </div>
          </div>

          {/* Forecast Chart */}
          {includedFactories.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
                <Gauge className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-800">
                  Inventory Forecast — {includedFactories.map(f => f.name).join(', ')}
                </h2>
              </div>
              <div className="p-4 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyStockData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" height={20} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis width={40} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '12px' }}
                      labelStyle={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="SKU #8842-predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" name="#8842 (Predicted)" dot={false} />
                    <Line type="monotone" dataKey="SKU #2201-predicted" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="4 4" name="#2201 (Predicted)" dot={false} />
                    <Line type="monotone" dataKey="SKU #5512-predicted" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" name="#5512 (Predicted)" dot={false} />
                    <Line type="monotone" dataKey="SKU #7734-predicted" stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" name="#7734 (Predicted)" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Factors & News */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-gray-500" />
                <h2 className="text-sm font-semibold text-gray-800">Factors & News</h2>
                <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{factors.length}</span>
              </div>
              <button
                onClick={() => setShowAddFactor(!showAddFactor)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Factor
              </button>
            </div>

            {showAddFactor && (
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3 flex-wrap">
                <input
                  type="text"
                  value={newFactorName}
                  onChange={e => setNewFactorName(e.target.value)}
                  placeholder="Factor name..."
                  className="flex-1 min-w-[140px] px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  onKeyDown={e => e.key === 'Enter' && handleAddFactor()}
                />
                <input
                  type="text"
                  value={newFactorValue}
                  onChange={e => setNewFactorValue(e.target.value)}
                  placeholder="Value (e.g. +5%)"
                  className="w-28 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
                <select
                  value={newFactorTrend}
                  onChange={e => setNewFactorTrend(e.target.value as any)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="up">Up</option>
                  <option value="down">Down</option>
                  <option value="stable">Stable</option>
                </select>
                <button
                  onClick={handleAddFactor}
                  disabled={!newFactorName.trim()}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
                <button onClick={() => setShowAddFactor(false)} className="p-1.5 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {factors.map(factor => {
                const isExpanded = expandedNews === factor.id;
                const news = getNewsForFactor(factor.name);

                return (
                  <div key={factor.id} className="space-y-2">
                    <div className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all",
                      factor.included
                        ? "bg-white border-gray-200 hover:border-gray-300"
                        : "bg-gray-50 border-gray-100 opacity-50"
                    )}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(factor.trend)}
                          <span className="text-sm font-medium text-gray-800 truncate">{factor.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{factor.value}</span>
                          <span className="text-[10px] text-gray-400 truncate">{factor.impact}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleToggleFactor(factor.id)}
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors",
                            factor.included
                              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          )}
                        >
                          {factor.included ? 'On' : 'Off'}
                        </button>
                        <button
                          onClick={() => setExpandedNews(isExpanded ? null : factor.id)}
                          className={cn(
                            "p-1.5 rounded-md transition-colors flex items-center gap-0.5",
                            isExpanded
                              ? "text-blue-600 bg-blue-50"
                              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          )}
                          title="View related news"
                        >
                          <Newspaper className="w-3.5 h-3.5" />
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleRemoveFactor(factor.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="ml-4 pl-4 border-l-2 border-blue-200 space-y-2">
                        {news.map((article, i) => (
                          <div key={i} className="bg-blue-50/50 rounded-lg p-3 border border-blue-100/60">
                            <h4 className="text-xs font-semibold text-gray-800 leading-snug">{article.headline}</h4>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                              <span className="font-medium text-gray-500">{article.source}</span>
                              <span>·</span>
                              <span>{article.date}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{article.snippet}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {factors.length === 0 && (
                <div className="col-span-full text-center py-4 text-xs text-gray-400">
                  No factors added. Click "Add Factor" to include market and weather factors.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
