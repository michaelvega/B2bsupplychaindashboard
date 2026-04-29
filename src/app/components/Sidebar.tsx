import { Link, useLocation } from 'react-router';
import { Home, Clock, History, Settings, FileText, LayoutDashboard, Terminal, AlertCircle, TrendingUp, Users, Bot } from 'lucide-react';
import { cn } from './ui/utils';

export function Sidebar() {
  const location = useLocation();

  const mainNavItems = [
    { path: '/demo', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/command-center', label: 'Command Center', icon: Terminal },
    { path: '/agent-suite', label: 'Agent Suite', icon: Bot },
  ];

  const backlogNavItems = [
    { path: '/queues/order-errors', label: 'Order errors', icon: AlertCircle },
  ];

  const synthesisNavItems = [
    { path: '/queues/forecasting', label: 'Forecasting', icon: TrendingUp },
    { path: '/queues/vendor-onboarding', label: 'Vendor onboarding and analytics', icon: Users },
  ];

  const otherNavItems = [
    { path: '/history', label: 'History', icon: History },
    { path: '/rules', label: 'Rules', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/agent-files', label: 'Under the Hood', icon: FileText },
  ];

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="font-semibold text-lg">Procept Supply Chain Agent</h1>
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
              Action Backlog
            </h2>
          </div>
          <div className="space-y-1">
            {backlogNavItems.map((item) => {
              const Icon = item.icon;
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
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="px-3 mb-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Data Synthesis
            </h2>
          </div>
          <div className="space-y-1">
            {synthesisNavItems.map((item) => {
              const Icon = item.icon;
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
                  <Icon className="w-4 h-4" />
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
