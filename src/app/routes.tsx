import { useRef, useState } from 'react';
import { createHashRouter } from 'react-router';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { LandingPage } from './pages/LandingPage';
import { Actions } from './pages/Actions';
import { AgentSuite } from './pages/AgentSuite';
import { AgentFiles } from './pages/AgentFiles';
import { Dashboard } from './pages/Dashboard';
import { OrderErrors } from './pages/OrderErrors';
import { Forecasting } from './pages/Forecasting';
import { VendorOnboarding } from './pages/VendorOnboarding';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { DailyBrief } from './pages/DailyBrief';
import { Sidebar } from './components/Sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';

function Layout({ children }: { children: React.ReactNode }) {
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (sidebarPanelRef.current?.isCollapsed()) {
      sidebarPanelRef.current?.expand();
    } else {
      sidebarPanelRef.current?.collapse();
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <ResizablePanelGroup direction="horizontal" autoSaveId="main-layout">
        <ResizablePanel
          ref={sidebarPanelRef}
          defaultSize={16}
          minSize={4}
          maxSize={25}
          collapsible
          collapsedSize={3.5}
          onCollapse={() => setSidebarCollapsed(true)}
          onExpand={() => setSidebarCollapsed(false)}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={handleToggleSidebar}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={84} minSize={40}>
          <main className="h-full overflow-y-auto">
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export const router = createHashRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/demo',
    element: (
      <Layout>
        <Dashboard />
      </Layout>
    ),
  },
  {
    path: '/command-center',
    element: (
      <Layout>
        <Actions />
      </Layout>
    ),
  },
  {
    path: '/command-center/:chatId',
    element: (
      <Layout>
        <Actions />
      </Layout>
    ),
  },
  {
    path: '/agent-suite',
    element: (
      <Layout>
        <AgentSuite />
      </Layout>
    ),
  },
  {
    path: '/agent-files',
    element: (
      <Layout>
        <AgentFiles />
      </Layout>
    ),
  },
  {
    path: '/queues/order-errors',
    element: (
      <Layout>
        <OrderErrors />
      </Layout>
    ),
  },
  {
    path: '/queues/forecasting',
    element: (
      <Layout>
        <Forecasting />
      </Layout>
    ),
  },
  {
    path: '/queues/vendor-onboarding',
    element: (
      <Layout>
        <VendorOnboarding />
      </Layout>
    ),
  },
  {
    path: '/history',
    element: (
      <Layout>
        <History />
      </Layout>
    ),
  },
  {
    path: '/settings',
    element: (
      <Layout>
        <Settings />
      </Layout>
    ),
  },
  {
    path: '/daily-brief',
    element: (
      <Layout>
        <DailyBrief />
      </Layout>
    ),
  },
]);

