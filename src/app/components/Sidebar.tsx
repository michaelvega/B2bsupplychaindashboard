import { Link, useLocation } from 'react-router';
import { FileText, Calendar, AlertCircle, Brain, Terminal, TrendingUp, Users, History, Settings, ChevronLeft, ChevronRight, ChevronDown, FolderKanban } from 'lucide-react';
import { cn } from './ui/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';

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

interface LeafMenuItem {
  type: 'leaf';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

interface ParentMenuItem {
  type: 'parent';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: Omit<LeafMenuItem, 'type'>[];
}

type MenuItem = LeafMenuItem | ParentMenuItem;

const menuItems: MenuItem[] = [
  {
    type: 'leaf',
    label: 'Daily Brief',
    icon: FileText,
    path: '/daily-brief',
  },
  {
    type: 'parent',
    label: 'Action Backlog',
    icon: FolderKanban,
    children: [
      { label: 'Daily Tasks', icon: Calendar, path: '/agent-suite' },
      { label: 'Order Errors', icon: AlertCircle, path: '/queues/order-errors' },
      { label: 'Forecasting', icon: TrendingUp, path: '/queues/forecasting' },
      { label: 'Vendor Onboarding', icon: Users, path: '/queues/vendor-onboarding' },
    ],
  },
  {
    type: 'parent',
    label: 'Knowledge',
    icon: Brain,
    children: [
      { label: 'Assistant', icon: Terminal, path: '/command-center' },
    ],
  },
  {
    type: 'parent',
    label: 'System',
    icon: Settings,
    children: [
      { label: 'History', icon: History, path: '/history' },
      { label: 'Settings', icon: Settings, path: '/settings' },
    ],
  },
];

function NavLink({
  path,
  label,
  icon: Icon,
  collapsed,
  indent,
}: {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed: boolean;
  indent?: boolean;
}) {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      title={collapsed ? label : undefined}
      className={cn(
        'flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-sm',
        collapsed ? 'justify-center' : '',
        indent && !collapsed ? 'ml-4' : '',
        isActive
          ? 'bg-gray-100 text-gray-900 font-medium'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  const isParentActive = (parent: ParentMenuItem) =>
    parent.children.some((child) => location.pathname === child.path);

  return (
    <div
      className={cn(
        'border-r border-gray-200 bg-white flex flex-col h-full transition-all duration-300 ease-in-out relative',
        collapsed ? 'w-16' : 'w-full'
      )}
    >
      {/* Header */}
      <div className={cn('p-4 border-b border-gray-200 flex items-center', collapsed ? 'justify-center' : 'justify-between gap-2')}>
        {collapsed ? (
          <img src="/procept-logo-light.jpg" alt="Procept Logo" className="w-7 h-7 rounded-full object-cover shrink-0" />
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <img src="/procept-logo-light.jpg" alt="Procept Logo" className="w-7 h-7 rounded-full object-cover shrink-0" />
            <h1 className="font-semibold text-lg leading-none truncate">Procept</h1>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
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
          onClick={onToggleCollapse}
          className="mx-auto mt-3 flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            if (item.type === 'leaf') {
              return (
                <NavLink
                  key={item.path}
                  path={item.path}
                  label={item.label}
                  icon={item.icon}
                  collapsed={collapsed}
                />
              );
            }

            // Parent item — expandable via Collapsible, default open if active child
            const ParentIcon = item.icon;
            const active = isParentActive(item);

            if (collapsed) {
              // In collapsed mode, show a divider and render children as icon-only links
              return (
                <div key={item.label}>
                  <div className="border-t border-gray-100 my-2 mx-1" />
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      path={child.path}
                      label={child.label}
                      icon={child.icon}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              );
            }

            return (
              <Collapsible key={item.label} defaultOpen={active}>
                <CollapsibleTrigger
                  className={cn(
                    'flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm transition-colors group',
                    active
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <ParentIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 group-data-[state=closed]:-rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <div className="pt-0.5 pb-1 space-y-0.5">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        path={child.path}
                        label={child.label}
                        icon={child.icon}
                        collapsed={collapsed}
                        indent
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
