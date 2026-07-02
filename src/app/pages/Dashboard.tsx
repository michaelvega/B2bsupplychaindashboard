import { useState } from 'react';
import { orderErrorItems, forecastingItems, vendorOnboardingItems, WorkItem } from '../data/mockData';
import { forecastingProducts, monthlyStockData } from '../data/forecastingData';
import { WorkCard } from '../components/WorkCard';
import { DetailPane } from '../components/DetailPane';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable';
import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceLine } from 'recharts';
import { X } from 'lucide-react';

export function Dashboard() {
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);
  const [hoveredSku, setHoveredSku] = useState<string | null>(null);

  const [panelsVisible, setPanelsVisible] = useState({
    actionQueue: true,
    affectedOrders: true,
    inventoryForecast: true,
  });

  const togglePanel = (panel: keyof typeof panelsVisible) => {
    setPanelsVisible((prev) => ({ ...prev, [panel]: !prev[panel] }));
  };

  const highPriorityItems = [...orderErrorItems, ...forecastingItems, ...vendorOnboardingItems]
    .filter(item => item.priority === 'high')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getChartColor = (sku: string) => {
    const product = forecastingProducts.find(p => p.sku === sku);
    if (!product) return '#94a3b8';

    const baseColors: Record<string, string> = {
      '#8842': '#8b5cf6',
      '#2201': '#0ea5e9',
      '#5512': '#6366f1',
      '#7734': '#ec4899',
    };

    if (!hoveredSku) return baseColors[sku] || '#94a3b8';
    if (hoveredSku !== sku) return '#e5e7eb';

    return product.riskLevel === 'high' ? '#ef4444' : product.riskLevel === 'medium' ? '#f59e0b' : '#10b981';
  };

  const getValueAtRisk = (itemId: string) => {
    switch (itemId) {
      case 'oe-1': return <><span className="text-red-600 font-semibold">$12,500</span> <span className="text-gray-400 text-xs ml-1">in 4 days</span></>;
      case 'oe-2': return <><span className="text-orange-600 font-semibold">$4,200</span> <span className="text-gray-400 text-xs ml-1">in 48 hrs</span></>;
      case 'oe-4': return <><span className="text-red-700 font-semibold">$2,500</span> <span className="text-gray-400 text-xs ml-1">due Friday</span></>;
      case 'fc-1': return <><span className="text-red-600 font-semibold">$45,000</span> <span className="text-gray-400 text-xs ml-1">in 6 days</span></>;
      default: return <span className="text-gray-400 font-medium text-xs">Awaiting Calculation</span>;
    }
  };

  const allPanelsHidden = !panelsVisible.actionQueue && !panelsVisible.affectedOrders && !panelsVisible.inventoryForecast;

  return (
    <div className="flex flex-col h-full max-w-[1400px] mx-auto overflow-hidden bg-grid-pattern-light bg-gray-50/50">
      <div className="flex-1 min-h-0">
        {allPanelsHidden ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No panels open. Use the buttons below to add panels.
          </div>
        ) : (
          <ResizablePanelGroup direction="horizontal" className="p-8">
            {/* Left: Action Queue */}
            {panelsVisible.actionQueue && (
              <>
                <ResizablePanel defaultSize={40} minSize={20}>
                  <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
                      <h2 className="text-sm font-semibold text-gray-700">Action Queue</h2>
                      <button
                        onClick={() => togglePanel('actionQueue')}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors flex-shrink-0"
                        aria-label="Close Action Queue panel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {highPriorityItems.map((item) => (
                        <WorkCard
                          key={item.id}
                          item={item}
                          onClick={() => setSelectedItem(item)}
                        />
                      ))}
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle />
              </>
            )}

            {/* Right Column */}
            <ResizablePanel defaultSize={60} minSize={30}>
              <ResizablePanelGroup direction="vertical">
                {/* Top Right: Affected Orders Table */}
                {panelsVisible.affectedOrders && (
                  <>
                    <ResizablePanel defaultSize={50} minSize={20}>
                      <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
                          <h2 className="text-sm font-semibold text-gray-700">Affected Orders & Products</h2>
                          <button
                            onClick={() => togglePanel('affectedOrders')}
                            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors flex-shrink-0"
                            aria-label="Close Affected Orders panel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto relative">
                          <table className="w-full text-left text-sm text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10 shadow-sm">
                              <tr>
                                <th className="px-4 py-3 font-medium">Issue ID</th>
                                <th className="px-4 py-3 font-medium">Type</th>
                                <th className="px-4 py-3 font-medium">Title</th>
                                <th className="px-4 py-3 font-medium">Value at Risk</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {highPriorityItems.map(item => (
                                <tr key={`table-${item.id}`} className="bg-white hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedItem(item)}>
                                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{item.id}</td>
                                  <td className="px-4 py-3 capitalize whitespace-nowrap">{item.type.replace('-', ' ')}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                                      <span className="line-clamp-1 truncate" title={item.title}>{item.title}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    {getValueAtRisk(item.id)}
                                  </td>
                                  <td className="px-4 py-3 capitalize whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {item.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </ResizablePanel>
                    <ResizableHandle />
                  </>
                )}

                {/* Bottom Right: Inventory Forecast Chart */}
                {panelsVisible.inventoryForecast && (
                  <ResizablePanel defaultSize={50} minSize={15}>
                    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-sm font-semibold text-gray-700">Inventory Forecast - ML Predictions</h2>
                        <button
                          onClick={() => togglePanel('inventoryForecast')}
                          className="p-1.5 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors flex-shrink-0"
                          aria-label="Close Inventory Forecast panel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex-1 min-h-0 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={monthlyStockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="month" height={20} tick={{fontSize: 11, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                            <YAxis width={40} tick={{fontSize: 11, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                            <Tooltip
                              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              itemStyle={{ fontSize: '12px' }}
                              labelStyle={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}
                            />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />

                            {/* Actual Stock */}
                            <Bar dataKey="SKU #8842" fill={getChartColor('#8842')} name="#8842" onMouseEnter={() => setHoveredSku('#8842')} onMouseLeave={() => setHoveredSku(null)} radius={[2, 2, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="SKU #2201" fill={getChartColor('#2201')} name="#2201" onMouseEnter={() => setHoveredSku('#2201')} onMouseLeave={() => setHoveredSku(null)} radius={[2, 2, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="SKU #5512" fill={getChartColor('#5512')} name="#5512" onMouseEnter={() => setHoveredSku('#5512')} onMouseLeave={() => setHoveredSku(null)} radius={[2, 2, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="SKU #7734" fill={getChartColor('#7734')} name="#7734" onMouseEnter={() => setHoveredSku('#7734')} onMouseLeave={() => setHoveredSku(null)} radius={[2, 2, 0, 0]} maxBarSize={40} />

                            {/* ML Predictions */}
                            <Line type="monotone" dataKey="SKU #8842-predicted" stroke={getChartColor('#8842')} strokeWidth={2} strokeDasharray="4 4" name="#8842 (ML)" dot={false} activeDot={{ r: 4 }} onMouseEnter={() => setHoveredSku('#8842')} onMouseLeave={() => setHoveredSku(null)} />
                            <Line type="monotone" dataKey="SKU #2201-predicted" stroke={getChartColor('#2201')} strokeWidth={2} strokeDasharray="4 4" name="#2201 (ML)" dot={false} activeDot={{ r: 4 }} onMouseEnter={() => setHoveredSku('#2201')} onMouseLeave={() => setHoveredSku(null)} />
                            <Line type="monotone" dataKey="SKU #5512-predicted" stroke={getChartColor('#5512')} strokeWidth={2} strokeDasharray="4 4" name="#5512 (ML)" dot={false} activeDot={{ r: 4 }} onMouseEnter={() => setHoveredSku('#5512')} onMouseLeave={() => setHoveredSku(null)} />
                            <Line type="monotone" dataKey="SKU #7734-predicted" stroke={getChartColor('#7734')} strokeWidth={2} strokeDasharray="4 4" name="#7734 (ML)" dot={false} activeDot={{ r: 4 }} onMouseEnter={() => setHoveredSku('#7734')} onMouseLeave={() => setHoveredSku(null)} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </ResizablePanel>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      {/* Panel restore bar */}
      {(!panelsVisible.actionQueue || !panelsVisible.affectedOrders || !panelsVisible.inventoryForecast) && (
        <div className="flex-shrink-0 px-8 pb-3 flex items-center gap-2">
          <span className="text-xs text-gray-400 mr-1">Hidden panels:</span>
          {!panelsVisible.actionQueue && (
            <button
              onClick={() => togglePanel('actionQueue')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              + Action Queue
            </button>
          )}
          {!panelsVisible.affectedOrders && (
            <button
              onClick={() => togglePanel('affectedOrders')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              + Affected Orders
            </button>
          )}
          {!panelsVisible.inventoryForecast && (
            <button
              onClick={() => togglePanel('inventoryForecast')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              + Inventory Forecast
            </button>
          )}
        </div>
      )}

      <DetailPane
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
