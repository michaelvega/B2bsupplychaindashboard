import { X, FileText, CheckCircle2, XCircle, Edit } from 'lucide-react';
import { WorkItem } from '../data/mockData';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DetailPaneProps {
  item: WorkItem | null;
  onClose: () => void;
}

export function DetailPane({ item, onClose }: DetailPaneProps) {
  if (!item) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div 
        className="fixed inset-y-0 right-0 w-[600px] bg-white border-l border-gray-200 shadow-2xl overflow-y-auto z-50"
        style={{ animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">{item.title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{item.details.summary}</p>
        </div>

        {/* Metrics */}
        {item.details.metrics && item.details.metrics.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {item.details.metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                  <p className="font-semibold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart for Forecasting */}
        {item.details.chartData && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Inventory Projection</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={item.details.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Stock Level', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
                  <ReferenceLine x={6.6} stroke="red" strokeDasharray="5 5" label="Stockout" />
                  <ReferenceLine x={10} stroke="orange" strokeDasharray="5 5" label="Delivery" />
                  <Line type="monotone" dataKey="stock" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-600">Stockout Zone (Day 6.6-10)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Source Data */}
        {item.details.sourceData && item.details.sourceData.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Source Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
              {item.details.sourceData.map((data, index) => (
                <div key={index} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                  <span className="text-sm text-gray-600">{data.label}:</span>
                  <span className="text-sm text-gray-900 font-medium">{data.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staged Actions */}
        {item.details.stagedActions && item.details.stagedActions.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Staged Actions</h3>
            <div className="space-y-3">
              {item.details.stagedActions.map((action) => (
                <div key={action.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900">{action.type}</p>
                      <p className="text-sm text-gray-700 mt-1">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {item.details.attachments && item.details.attachments.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Attachments</h3>
            <div className="space-y-2">
              {item.details.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{attachment}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Approve All
          </Button>
          <Button variant="outline" className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" className="flex-1">
            <XCircle className="w-4 h-4 mr-2" />
            Deny
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
