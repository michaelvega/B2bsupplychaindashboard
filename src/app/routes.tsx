import { createHashRouter } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { Actions } from './pages/Actions';
import { AgentSuite } from './pages/AgentSuite';
import { AgentFiles } from './pages/AgentFiles';
import { Dashboard } from './pages/Dashboard';
import { OrderErrors } from './pages/OrderErrors';
import { Forecasting } from './pages/Forecasting';
import { VendorOnboarding } from './pages/VendorOnboarding';
import { History } from './pages/History';
import { Rules } from './pages/Rules';
import { Settings } from './pages/Settings';
import { Sidebar } from './components/Sidebar';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
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
    path: '/rules',
    element: (
      <Layout>
        <Rules />
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
]);
