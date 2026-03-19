import { AlertCircle, FileEdit } from 'lucide-react';
import { WorkItem } from '../data/mockData';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface WorkCardProps {
  item: WorkItem;
  onClick: () => void;
}

export function WorkCard({ item, onClick }: WorkCardProps) {
  const priorityColors = {
    high: 'border-gray-200 bg-white hover:bg-gray-50',
    medium: 'border-gray-200 bg-white hover:bg-gray-50',
    low: 'border-gray-200 bg-white hover:bg-gray-50',
  };

  const priorityBadgeColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  };

  return (
    <div
      className={cn(
        'border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md bg-white',
        priorityColors[item.priority]
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle className={cn(
            'w-5 h-5 mt-0.5',
            item.priority === 'high' ? 'text-red-600' : item.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
          )} />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
          </div>
        </div>
        <span className={cn(
          'px-2 py-1 rounded text-xs font-medium uppercase',
          priorityBadgeColors[item.priority]
        )}>
          {item.priority}
        </span>
      </div>

      <div className="space-y-3 ml-8">
        <div>
          <p className="text-sm text-gray-500 mb-1">Detected discrepancy:</p>
          <p className="text-sm text-gray-900">{item.discrepancy}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Suggested action:</p>
          <p className="text-sm text-gray-900">{item.suggestedAction}</p>
        </div>

        {/* Preview Box */}
        {item.preview && (
          <div className="bg-white border border-gray-300 rounded-lg p-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <FileEdit className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">Preview of Changes</span>
            </div>
            <div className="space-y-2">
              {item.preview.map((change, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {change.before && (
                      <div className="bg-red-50 border border-red-200 rounded px-2 py-1">
                        <span className="text-xs text-red-600 font-medium">Before:</span>
                        <p className="text-gray-900">{change.before}</p>
                      </div>
                    )}
                    <div className="bg-green-50 border border-green-200 rounded px-2 py-1">
                      <span className="text-xs text-green-600 font-medium">After:</span>
                      <p className="text-gray-900">{change.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Handle approve
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // Handle deny
            }}
          >
            Deny
          </Button>
        </div>
      </div>
    </div>
  );
}