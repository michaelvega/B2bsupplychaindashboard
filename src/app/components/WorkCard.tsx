import { AlertCircle, FileEdit } from 'lucide-react';
import { WorkItem } from '../data/mockData';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface WorkCardProps {
  item: WorkItem;
  onClick: () => void;
}

export function WorkCard({ item, onClick }: WorkCardProps) {
  return (
    <div
      className="bg-[#FAFAFA] rounded-xl cursor-pointer transition-all border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col relative group overflow-hidden"
      onClick={onClick}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <AlertCircle className={cn(
            'w-[18px] h-[18px]',
            item.priority === 'high' ? 'text-red-500' : item.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
          )} />
          <span className="text-[14px] font-medium text-gray-500 capitalize tracking-tight">
            {item.priority} Priority Alert
          </span>
        </div>
        <span className="text-xs text-gray-400 font-medium">{new Date(item.timestamp).toLocaleString()}</span>
      </div>

      {/* Main Body */}
      <div className="flex flex-col flex-1 p-5 pb-6">
        <h3 className="text-[20px] font-medium text-[#1F2937] leading-tight tracking-tight mb-5">
          {item.title}
        </h3>

        <div className="space-y-5 flex-1">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Detected Discrepancy</p>
            <p className="text-[14px] text-gray-700 leading-relaxed">{item.discrepancy}</p>
          </div>

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Suggested Action</p>
            <p className="text-[14px] text-gray-700 leading-relaxed">{item.suggestedAction}</p>
          </div>

          {/* Preview Box */}
          {item.preview && (
            <div className="bg-white border border-gray-100 rounded-lg p-4 mt-2 shadow-sm">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-50">
                <FileEdit className="w-4 h-4 text-gray-400" />
                <span className="text-[12px] font-bold text-gray-600 uppercase tracking-wider">Preview of Changes</span>
              </div>
              <div className="space-y-3">
                {item.preview.map((change, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3 text-[13px]">
                    {change.before ? (
                      <div className="bg-red-50/40 border border-red-100/50 rounded-md p-2.5">
                        <span className="block text-[10px] text-red-500 font-bold uppercase mb-1">Before</span>
                        <p className="text-gray-700">{change.before}</p>
                      </div>
                    ) : (
                      <div />
                    )}
                    <div className="bg-green-50/40 border border-green-100/50 rounded-md p-2.5">
                      <span className="block text-[10px] text-green-600 font-bold uppercase mb-1">After</span>
                      <p className="text-gray-700">{change.after}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // Handle approve
            }}
            className="flex-1 bg-stone-900 hover:bg-stone-950 text-white shadow-sm transition-all"
          >
            Review & Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // Handle deny
            }}
            className="flex-1 text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}