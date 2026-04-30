import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Home, Clock, History, Settings, FileText, LayoutDashboard, Terminal, AlertCircle, TrendingUp, Users, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './ui/utils';

function ProceptLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#2563eb"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <circle cx="43" cy="50" r="28" />
      <path d="M 4 50 L 96 50 M 70 36 L 96 50 L 70 64" />
    </svg>
  );
}

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

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
    { path: '/rules', label: 'Schedule', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={cn(
        'border-r border-gray-200 bg-white flex flex-col h-screen transition-all duration-300 ease-in-out relative',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn('p-4 border-b border-gray-200 flex items-center', collapsed ? 'justify-center' : 'justify-between gap-2')}>
        {collapsed ? (
          <ProceptLogo size={24} />
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <ProceptLogo size={22} />
            <h1 className="font-semibold text-lg leading-none truncate">Procept</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            'flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors flex-shrink-0',
            collapsed && 'hidden'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-3 flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-sm',
                  collapsed ? 'justify-center' : '',
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Action Backlog */}
        <div className="mt-6">
          {!collapsed && (
            <div className="px-2 mb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Action Backlog
              </h2>
            </div>
          )}
          {collapsed && <div className="border-t border-gray-100 my-2 mx-1" />}
          <div className="space-y-1">
            {backlogNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-sm',
                    collapsed ? 'justify-center' : '',
                    isActive
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Data Synthesis */}
        <div className="mt-6">
          {!collapsed && (
            <div className="px-2 mb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Data Synthesis
              </h2>
            </div>
          )}
          {collapsed && <div className="border-t border-gray-100 my-2 mx-1" />}
          <div className="space-y-1">
            {synthesisNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-sm',
                    collapsed ? 'justify-center' : '',
                    isActive
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Other nav */}
        {collapsed && <div className="border-t border-gray-100 my-2 mx-1" />}
        <div className="mt-6 space-y-1">
          {otherNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-sm',
                  collapsed ? 'justify-center' : '',
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
