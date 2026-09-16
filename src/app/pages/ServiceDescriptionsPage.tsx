import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

interface Plan {
  name: string;
  description: string;
  effective: string;
  features: string[];
  legacy?: boolean;
}

const PLANS: Plan[] = [
  {
    name: 'Procept Pro',
    description: 'Single-seat professional license: trade-area and demographic analysis, market visualization, and the Procept Agent.',
    effective: 'Effective August 26, 2026',
    features: [
      'Trade-area and demographic analysis',
      'Market visualization',
      'The Procept Agent',
    ],
  },
  {
    name: 'Procept Enterprise',
    description: 'Organization-wide license with unlimited usage and seats set on the Order: AI site scoring, trade-area and demographic analysis, market visualization, the Procept Agent, MCP integration, and dedicated customer success.',
    effective: 'Effective August 13, 2026',
    features: [
      'AI site scoring',
      'Trade-area and demographic analysis',
      'Market visualization',
      'The Procept Agent',
      'MCP integration',
      'Dedicated customer success',
    ],
  },
  {
    name: 'Procept Starter',
    description: 'Single-seat license for retailers with fewer than 10 locations: AI site scoring, trade-area and demographic analysis, market visualization, the Procept Agent, and MCP integration.',
    effective: 'Effective June 26, 2026 · No longer offered to new customers',
    features: [
      'AI site scoring',
      'Trade-area and demographic analysis',
      'Market visualization',
      'The Procept Agent',
      'MCP integration',
    ],
    legacy: true,
  },
];

export function ServiceDescriptionsPage() {
  const currentPlans = PLANS.filter(p => !p.legacy);
  const legacyPlans = PLANS.filter(p => p.legacy);

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-black text-white" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 bg-black/80 backdrop-blur-xl z-50">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-3">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-6 h-6 rounded-md opacity-70" />
            <span className="text-white/40 text-xs tracking-[0.2em] uppercase">Procept Technologies Corp.</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Service Descriptions</h1>
          <p className="text-white/30 text-sm max-w-2xl leading-relaxed">Plans</p>
        </div>

        {/* Intro */}
        <p className="text-sm text-white/50 leading-relaxed max-w-2xl mb-12">
          Each Service Description below defines exactly what its subscription includes. These documents form part of the Procept Technologies Corp. Terms of Service and are incorporated by reference.
        </p>

        {/* Current plans */}
        <div className="space-y-6 mb-16">
          {currentPlans.map((plan, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 group hover:bg-white/[0.05] transition-all">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-medium text-white mb-2">Service Description — {plan.name}</h2>
                  <p className="text-sm text-white/50 leading-relaxed max-w-xl">{plan.description}</p>
                </div>
                <span className="text-xs text-white/30 shrink-0 md:pt-1">{plan.effective}</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-white/50">
                    <span className="w-1 h-1 rounded-full bg-white/30 mt-2 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legacy plans */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-6">No longer offered</p>
          <p className="text-sm text-white/40 mb-8">These plans are closed to new customers. Their Service Descriptions remain in effect for existing subscriptions.</p>

          <div className="space-y-6">
            {legacyPlans.map((plan, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-8 opacity-70">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-medium text-white mb-2">Service Description — {plan.name}</h2>
                    <p className="text-sm text-white/50 leading-relaxed max-w-xl">{plan.description}</p>
                  </div>
                  <span className="text-xs text-white/30 shrink-0 md:pt-1">{plan.effective}</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-white/40">
                      <span className="w-1 h-1 rounded-full bg-white/20 mt-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Link to terms */}
        <div className="text-center">
          <Link to="/privacy" className="text-sm text-white/40 hover:text-white/70 transition-colors">
            View the Privacy Policy →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-white/20">Copyright Procept Technologies Corp. 2026. All rights reserved.</span>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <span className="text-white/10">·</span>
            <Link to="/data-processing-addendum" className="hover:text-white/60 transition-colors">Data Processing Addendum</Link>
            <span className="text-white/10">·</span>
            <Link to="/terms-of-service" className="hover:text-white/60 transition-colors">Terms & Conditions</Link>
            <span className="text-white/10">·</span>
            <span className="hover:text-white/60 transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
