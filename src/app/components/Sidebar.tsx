import { Link, useLocation } from 'react-router';
import { Home, Clock, History, Settings, FileText } from 'lucide-react';
import { cn } from './ui/utils';

export function Sidebar() {
  const location = useLocation();

  const mainNavItems = [
    { path: '/', label: 'Command Center', icon: Home },
  ];

  const queueNavItems = [
    { path: '/queues/order-errors', label: 'Order errors', icon: null },
    { path: '/queues/forecasting', label: 'Forecasting', icon: null },
    { path: '/queues/vendor-onboarding', label: 'Vendor onboarding and analytics', icon: null },
  ];

  const otherNavItems = [
    { path: '/history', label: 'History', icon: History },
    { path: '/rules', label: 'Rules', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="font-semibold text-lg">Membrain Supply Chain Agent</h1>
        <p className="text-sm text-gray-500 mt-1">Supply Chain Automation</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6">
          <div className="px-3 mb-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Action Queues
            </h2>
          </div>
          <div className="space-y-1">
            {queueNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Clock className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6 space-y-1">
          {otherNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
