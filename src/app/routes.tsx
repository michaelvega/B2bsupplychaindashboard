import { useRef, useState } from 'react';
import { createHashRouter } from 'react-router';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { LandingPage } from './pages/LandingPage';
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
import { AssistantPanel } from './components/AssistantPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';

function Layout({ children }: { children: React.ReactNode }) {
  const sidebarPanelRef = useRef<ImperativePanelHandle>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const assistantPanelRef = useRef<ImperativePanelHandle>(null);
  const [assistantCollapsed, setAssistantCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (sidebarCollapsed) {
      sidebarPanelRef.current?.expand();
    } else {
      sidebarPanelRef.current?.collapse();
    }
  };

  const handleToggleAssistant = () => {
    if (assistantCollapsed) {
      assistantPanelRef.current?.expand();
    } else {
      assistantPanelRef.current?.collapse();
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <ResizablePanelGroup direction="horizontal" autoSaveId="main-layout-v4">
        {/* Left Sidebar */}
        <ResizablePanel
          ref={sidebarPanelRef}
          defaultSize={14}
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

        {/* Main Content */}
        <ResizablePanel defaultSize={66} minSize={30}>
          <main className="h-full overflow-y-auto">
            {children}
          </main>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Assistant Panel */}
        <ResizablePanel
          ref={assistantPanelRef}
          defaultSize={20}
          minSize={15}
          maxSize={35}
          collapsible
          collapsedSize={3.5}
          onCollapse={() => setAssistantCollapsed(true)}
          onExpand={() => setAssistantCollapsed(false)}
        >
          <AssistantPanel
            collapsed={assistantCollapsed}
            onToggleCollapse={handleToggleAssistant}
          />
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
