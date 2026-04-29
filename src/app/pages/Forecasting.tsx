import React, { useState } from 'react';
import { forecastScenarios, historicalDataRows, macroMetrics, monthlyStockData } from '../data/forecastingData';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ThinkingTimer } from '../components/ThinkingTimer';
import {
  Factory,
  Building2,
  ShoppingCart,
  Bot,
  Send,
  Database,
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Menu,
  ChevronDown
} from 'lucide-react';

export function Forecasting() {
  const [activeTab, setActiveTab] = useState<'forecasts' | 'data'>('forecasts');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Forecast Chat State
  const [chatInput, setChatInput] = useState('');
  const [forecastChat, setForecastChat] = useState<any[]>([
    { role: 'assistant', content: 'I am synced with the current Digital Twin graph. How would you like to adjust the scenario parameters?' }
  ]);

  // Telemetry Chat State
  const [telemetryInput, setTelemetryInput] = useState('');
  const [telemetryChat, setTelemetryChat] = useState<any[]>([
    { role: 'assistant', content: 'You can use the agent to build your API connections. Please insert API endpoint or documentation here to begin.' }
  ]);

  const handleForecastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setForecastChat([
      ...forecastChat, 
      { role: 'user', content: chatInput }, 
      { role: 'assistant', content: <ThinkingTimer /> }
    ]);
    setChatInput('');
  };

  const handleTelemetrySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telemetryInput.trim()) return;
    setTelemetryChat([
      ...telemetryChat, 
      { role: 'user', content: telemetryInput }, 
      { role: 'assistant', content: <ThinkingTimer /> }
    ]);
    setTelemetryInput('');
  };

  const getScenarioData = (scenarioIdx: number) => {
    return monthlyStockData.map(d => {
      const modifier = 1 + (scenarioIdx * 0.15); // Just some dummy modifier to make lines look different
      return {
        ...d,
        'SKU #8842-predicted': Math.round(d['SKU #8842-predicted'] * modifier),
        'SKU #2201-predicted': Math.round(d['SKU #2201-predicted'] * (modifier * 0.9)),
        'SKU #5512-predicted': Math.round(d['SKU #5512-predicted'] * (modifier * 1.1)),
        'SKU #7734-predicted': Math.round(d['SKU #7734-predicted'] * modifier),
      };
    });
  };

  const getChartColor = (sku: string) => {
    const colors: Record<string, string> = {
      '#8842': '#8b5cf6',
      '#2201': '#0ea5e9',
      '#5512': '#6366f1',
      '#7734': '#ec4899',
    };
    return colors[sku] || '#94a3b8';
  };

  // Node Component for the Digital Twin Graph
  const TwinNode = ({ icon: Icon, label, sublabel, risk, delay, isCenter }: any) => (
    <div className={`flex items-center gap-3 p-3 rounded-xl border shadow-sm relative group cursor-pointer hover:shadow-md transition-all w-48
      ${isCenter ? 'bg-indigo-50 border-indigo-200 ring-4 ring-white' : 'bg-white border-gray-100'}`}
    >
      {/* Risk Indicator Ring */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 relative
        ${isCenter ? 'bg-indigo-100 border-indigo-300 text-indigo-600' :
          risk === 'green' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 
          risk === 'yellow' ? 'bg-yellow-50 border-yellow-300 text-yellow-600' : 
          'bg-red-50 border-red-300 text-red-600'}`}
      >
        <Icon className="w-5 h-5" />
        {/* Risk Dot */}
        <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white
          ${isCenter ? 'bg-emerald-500' :
            risk === 'green' ? 'bg-emerald-500' : 
            risk === 'yellow' ? 'bg-yellow-500' : 
            'bg-red-500 animate-pulse'}`} 
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-gray-900 truncate">{label}</span>
        <span className={`text-xs truncate ${isCenter ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>{sublabel}</span>
        {delay && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1 rounded inline-block w-max mt-0.5">{delay}</span>}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen flex flex-col">
      {/* Header & Sub-menu */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forecasting Command Center</h1>
          <p className="text-gray-500 text-sm mt-1">Simulate supply chain scenarios and manage external data.</p>
        </div>
        
        {/* Sub Hamburger Menu / Tabs Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <Menu className="w-4 h-4 text-gray-500" />
            {activeTab === 'forecasts' ? 'Forecasts View' : 'Data Management'}
            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <button 
                onClick={() => { setActiveTab('forecasts'); setIsMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${activeTab === 'forecasts' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Forecasts View
              </button>
              <button 
                onClick={() => { setActiveTab('data'); setIsMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${activeTab === 'data' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Data Management
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {activeTab === 'forecasts' ? (
          // FORECASTS TAB
          <div className="flex gap-6 pb-8">
            {/* Left/Center Column (Graph + Chat) */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              
              {/* Top: Digital Twin Graph */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col shrink-0 relative overflow-hidden">
                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-6">Digital Twin: Procurement Process</h2>
                
                <div className="flex items-center justify-between w-full max-w-4xl mx-auto relative px-8 py-2">
                  
                  {/* Connecting Lines Background SVG */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {/* Factory to Manufacturer lines */}
                    <path d="M 220 50 L 350 140" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                    <path d="M 220 140 L 350 140" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                    <path d="M 220 230 L 350 140" stroke="#fca5a5" strokeWidth="3" strokeDasharray="5,5" fill="none" />
                    
                    {/* Manufacturer to Buyers lines */}
                    <path d="M 520 140 L 650 95" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                    <path d="M 520 140 L 650 185" stroke="#e5e7eb" strokeWidth="3" fill="none" />
                  </svg>

                  {/* Nodes Container */}
                  <div className="flex justify-between w-full relative z-10">
                    
                    {/* 3 Factories (Left) */}
                    <div className="flex flex-col gap-4">
                      <TwinNode icon={Factory} label="Factory 1" sublabel="Electronics" risk="green" />
                      <TwinNode icon={Factory} label="Factory 2" sublabel="Plastics" risk="yellow" />
                      <TwinNode icon={Factory} label="Factory 3" sublabel="Metals" risk="red" delay="15d delay" />
                    </div>

                    {/* 1 Manufacturer (Middle) */}
                    <div className="flex flex-col justify-center items-center relative z-10">
                      <TwinNode icon={Building2} label="Your Plant" sublabel="Central Operations" risk="green" isCenter={true} />
                    </div>

                    {/* 2 Buyers (Right) */}
                    <div className="flex flex-col gap-10 justify-center">
                      <TwinNode icon={ShoppingCart} label="Distributor A" sublabel="NA Region" risk="green" />
                      <TwinNode icon={ShoppingCart} label="Distributor B" sublabel="EU Region" risk="yellow" />
                    </div>

                  </div>
                </div>
              </div>

              {/* Middle: Agent Chat Window */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col flex-1 min-h-[500px] overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Scenario Simulation Agent</h3>
                    <p className="text-xs text-gray-500">Ask the agent to edit the Digital Twin parameters</p>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {forecastChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-gray-900 text-white rounded-br-sm' 
                          : 'bg-indigo-50 text-gray-800 rounded-bl-sm border border-indigo-100'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                  <form onSubmit={handleForecastSubmit} className="relative flex items-center">
                    <input 
                      type="text" 
                      placeholder="e.g., Factory 3 has a 15 day delay due to port closures..."
                      className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 placeholder-gray-400"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column (Scenarios Sidebar) */}
            <div className="w-[450px] bg-gray-50/80 rounded-2xl border border-gray-200 p-5 flex flex-col shrink-0">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Forecast Scenarios</h2>
                <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-md">{forecastScenarios.length} Scenarios</span>
              </div>
              
              <div className="space-y-4">
                {forecastScenarios.map((scenario, idx) => {
                  const scenarioChartData = getScenarioData(idx);
                  return (
                    <div key={scenario.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col gap-3">
                      
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{scenario.name}</h3>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {scenario.status === 'Complete' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                          {scenario.status === 'Running' && <Clock className="w-3.5 h-3.5 text-blue-500" />}
                          {scenario.status === 'Failed' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                          <span className="text-[10px] uppercase font-bold text-gray-500">{scenario.type}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{scenario.description}</p>
                      
                      {/* Mini Chart for the scenario */}
                      <div className="h-32 w-full bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={scenarioChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="month" tick={{fontSize: 9}} tickLine={false} axisLine={false} />
                            <YAxis tick={{fontSize: 9}} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{fontSize: '10px', padding: '4px 8px', borderRadius: '8px'}} />
                            <Line type="monotone" dataKey="SKU #8842-predicted" stroke={getChartColor('#8842')} strokeWidth={1.5} dot={false} />
                            <Line type="monotone" dataKey="SKU #2201-predicted" stroke={getChartColor('#2201')} strokeWidth={1.5} dot={false} />
                            <Line type="monotone" dataKey="SKU #5512-predicted" stroke={getChartColor('#5512')} strokeWidth={1.5} dot={false} />
                            <Line type="monotone" dataKey="SKU #7734-predicted" stroke={getChartColor('#7734')} strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2 grid grid-cols-2 gap-2 border border-gray-100 mt-1">
                        {scenario.metrics.map((m, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-semibold">{m.label}</span>
                            <span className="text-xs font-bold text-gray-900 mt-0.5">{m.value}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-400">{scenario.timeAgo}</span>
                        {scenario.accuracy && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">{scenario.accuracy}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // DATA TAB
          <div className="h-full flex flex-col gap-6 overflow-y-auto pr-2 pb-8">
            
            <div className="grid grid-cols-3 gap-6 shrink-0">
              {/* Section 2: Macro Economic Data */}
              <div className="col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Globe className="w-5 h-5 text-gray-700" />
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Macroeconomic & Weather Factors</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {macroMetrics.map((metric) => (
                    <div key={metric.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-gray-500">{metric.name}</span>
                        {metric.trend === 'up' && <TrendingUp className={`w-4 h-4 ${metric.value === 'Severe' ? 'text-red-500' : 'text-red-500'}`} />}
                        {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-500" />}
                        {metric.trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="text-lg font-bold text-gray-900 mb-1.5">{metric.value}</div>
                      <p className="text-[11px] text-gray-500 leading-snug">{metric.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Custom Telemetry */}
              <div className="col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-[300px]">
                <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Custom Telemetry Agent</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30">
                  {telemetryChat.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`text-sm p-3.5 rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-gray-900 text-white rounded-br-sm max-w-[90%]' 
                          : 'bg-white text-gray-700 rounded-bl-sm border border-gray-200 shadow-sm max-w-[95%]'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-white">
                  <form onSubmit={handleTelemetrySubmit} className="relative">
                    <input 
                      type="text" 
                      placeholder="Insert API here..."
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400"
                      value={telemetryInput}
                      onChange={(e) => setTelemetryInput(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1.5 bottom-1.5 aspect-square bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Section 1: Historical Data */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden shrink-0">
              <div className="p-5 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <Database className="w-5 h-5 text-gray-700" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Historical Data Repository</h2>
              </div>
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Units Sold</th>
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory Level</th>
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead Time (Days)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {historicalDataRows && historicalDataRows.length > 0 ? (
                      historicalDataRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 px-5 text-sm text-gray-900 font-medium">{row.date}</td>
                          <td className="py-3 px-5 text-sm text-indigo-600 font-semibold">{row.sku}</td>
                          <td className="py-3 px-5 text-sm text-gray-700">{row.unitsSold}</td>
                          <td className="py-3 px-5 text-sm text-gray-700">{row.revenue}</td>
                          <td className="py-3 px-5 text-sm text-gray-700">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              row.inventoryLevel < 200 ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}>
                              {row.inventoryLevel}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-sm text-gray-700">{row.leadTime}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-gray-500 text-sm">
                          No historical data found. Please check your data source.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}