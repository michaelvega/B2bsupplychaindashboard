import { useState } from 'react';
import { forecastingItems } from '../data/mockData';
import { forecastingProducts, monthlyStockData, macroMetrics } from '../data/forecastingData';
import { WorkCard } from '../components/WorkCard';
import { DetailPane } from '../components/DetailPane';
import { WorkItem } from '../data/mockData';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceLine } from 'recharts';
import { AlertTriangle, TrendingDown, TrendingUp, UploadCloud, Database, Globe, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function Forecasting() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [expandedSku, setExpandedSku] = useState<string | null>(null);
  const [hoveredSku, setHoveredSku] = useState<string | null>(null);

  const getChartColor = (sku: string) => {
    const product = forecastingProducts.find(p => p.sku === sku);
    if (!product) return '#94a3b8';

    const baseColors: Record<string, string> = {
      '#8842': '#8b5cf6', // purple-500
      '#2201': '#0ea5e9', // sky-500
      '#5512': '#6366f1', // indigo-500
      '#7734': '#ec4899', // pink-500
    };

    if (!hoveredSku) return baseColors[sku] || '#94a3b8';
    if (hoveredSku !== sku) return '#e5e7eb'; // grayout

    return product.riskLevel === 'high' ? '#ef4444' : product.riskLevel === 'medium' ? '#f59e0b' : '#10b981';
  };

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Forecasting</h1>
        <p className="text-gray-600 mt-1">
          Operational forecasting alerts and stockout risk detection
        </p>
      </div>

      {/* Data Integration Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-colors">
          <UploadCloud className="w-8 h-8 text-indigo-500 mb-3" />
          <h3 className="font-semibold text-gray-900">Upload Data (CSV)</h3>
          <p className="text-sm text-gray-500 mt-1 text-center">Drag and drop your historical sales or inventory CSV files here</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:border-sky-400 transition-all">
          <Database className="w-8 h-8 text-sky-500 mb-3" />
          <h3 className="font-semibold text-gray-900">Connect Live Source</h3>
          <p className="text-sm text-gray-500 mt-1 text-center">Configure API endpoints for real-time ERP or WMS synchronization</p>
        </div>
      </div>

      {/* ML Forecasting Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Inventory Forecast - ML Predictions</h2>
        
        {/* Product List */}
        <div className="grid grid-cols-4 gap-3 mb-6 items-start">
          {forecastingProducts.map((product) => (
            <div
              key={product.sku}
              onClick={() => setExpandedSku(expandedSku === product.sku ? null : product.sku)}
              className={`p-3 rounded-lg border cursor-pointer transition-shadow hover:shadow-md ${
                product.riskLevel === 'high'
                  ? 'border-red-200 bg-red-50'
                  : product.riskLevel === 'medium'
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-semibold text-sm text-gray-900">{product.sku}</span>
                {product.riskLevel === 'high' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                {product.riskLevel === 'medium' && <TrendingDown className="w-4 h-4 text-yellow-600" />}
                {product.riskLevel === 'low' && <TrendingUp className="w-4 h-4 text-green-600" />}
              </div>
              <p className="text-xs text-gray-600 mb-2">{product.name}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900">{product.currentStock}</span>
                <span className="text-xs text-gray-500">units</span>
              </div>
              <span
                className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                  product.riskLevel === 'high'
                    ? 'bg-red-100 text-red-800'
                    : product.riskLevel === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {product.riskLevel === 'high' ? 'High Risk' : product.riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk'}
              </span>
              
              <div 
                className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out border-t ${
                  expandedSku === product.sku 
                    ? 'grid-rows-[1fr] opacity-100 mt-3 border-gray-200/50' 
                    : 'grid-rows-[0fr] opacity-0 mt-0 border-transparent'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-700 leading-relaxed font-medium pt-3">
                    {product.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={monthlyStockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Stock Level', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
            
            {/* Actual Stock (Bars) */}
            <Bar dataKey="SKU #8842" fill={getChartColor('#8842')} name="SKU #8842 (Actual)" onMouseEnter={() => setHoveredSku('#8842')} onMouseLeave={() => setHoveredSku(null)} />
            <Bar dataKey="SKU #2201" fill={getChartColor('#2201')} name="SKU #2201 (Actual)" onMouseEnter={() => setHoveredSku('#2201')} onMouseLeave={() => setHoveredSku(null)} />
            <Bar dataKey="SKU #5512" fill={getChartColor('#5512')} name="SKU #5512 (Actual)" onMouseEnter={() => setHoveredSku('#5512')} onMouseLeave={() => setHoveredSku(null)} />
            <Bar dataKey="SKU #7734" fill={getChartColor('#7734')} name="SKU #7734 (Actual)" onMouseEnter={() => setHoveredSku('#7734')} onMouseLeave={() => setHoveredSku(null)} />
            
            {/* ML Predictions (Lines) */}
            <Line type="monotone" dataKey="SKU #8842-predicted" stroke={getChartColor('#8842')} strokeWidth={2} strokeDasharray="5 5" name="SKU #8842 (ML)" onMouseEnter={() => setHoveredSku('#8842')} onMouseLeave={() => setHoveredSku(null)} />
            <Line type="monotone" dataKey="SKU #2201-predicted" stroke={getChartColor('#2201')} strokeWidth={2} strokeDasharray="5 5" name="SKU #2201 (ML)" onMouseEnter={() => setHoveredSku('#2201')} onMouseLeave={() => setHoveredSku(null)} />
            <Line type="monotone" dataKey="SKU #5512-predicted" stroke={getChartColor('#5512')} strokeWidth={2} strokeDasharray="5 5" name="SKU #5512 (ML)" onMouseEnter={() => setHoveredSku('#5512')} onMouseLeave={() => setHoveredSku(null)} />
            <Line type="monotone" dataKey="SKU #7734-predicted" stroke={getChartColor('#7734')} strokeWidth={2} strokeDasharray="5 5" name="SKU #7734 (ML)" onMouseEnter={() => setHoveredSku('#7734')} onMouseLeave={() => setHoveredSku(null)} />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span>Solid bars = Actual stock</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-gray-600"></div>
            <span>Dashed lines = ML predicted trend</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Red zone = Stockout risk detected</span>
          </div>
        </div>
      </div>

      {/* Macroeconomics Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Global Macroeconomic Market Factors</h2>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {macroMetrics.map((metric) => (
            <div key={metric.id} className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                {metric.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-red-500" />}
                {metric.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-green-500" />}
                {metric.trend === 'stable' && <Minus className="w-4 h-4 text-gray-500" />}
              </div>
              <div className="text-xl font-bold text-gray-900 mb-2">{metric.value}</div>
              <p className="text-xs text-gray-500 leading-snug">{metric.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <h2 className="font-semibold text-gray-900 mb-4">Pending Actions</h2>
      <div className="space-y-4">
        {forecastingItems.map((item) => (
          <WorkCard
            key={item.id}
            item={item}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      <DetailPane
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}