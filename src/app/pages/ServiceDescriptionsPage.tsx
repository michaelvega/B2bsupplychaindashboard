import { Link } from 'react-router';
import { LegalPageLayout } from '../components/marketing/LegalPageLayout';

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
    <LegalPageLayout
      docId="SERVICE-DESCRIPTIONS"
      title="Service Descriptions"
      subtitle="PLANS — INCORPORATED INTO THE TERMS OF SERVICE"
      wide
      meta={[
        { label: 'Document Type', value: 'Service Descriptions' },
        { label: 'Incorporated By', value: 'Terms of Service' },
        { label: 'Governing Law', value: 'State of Delaware' },
        { label: 'Parties', value: 'Procept Technologies Corp. & Customer' },
      ]}
    >
      {/* Intro */}
      <p className="text-sm text-white/50 leading-relaxed max-w-2xl mb-12">
        Each Service Description below defines exactly what its subscription includes. These documents form part of the Procept Technologies Corp. Terms of Service and are incorporated by reference.
      </p>

      {/* Current plans */}
      <div className="space-y-6 mb-16">
        {currentPlans.map((plan, i) => (
          <div key={i} className="border border-white/[0.08] bg-ink-800 p-8 hover:border-term-400/40 transition-colors">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-400 mb-4">PLAN // {plan.name}</p>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">Service Description — {plan.name}</h2>
                <p className="text-sm text-white/50 leading-relaxed max-w-xl">{plan.description}</p>
              </div>
              <span className="font-mono text-[11px] text-term-400 shrink-0 md:pt-1">{plan.effective}</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-white/50">
                  <span className="w-1.5 h-1.5 bg-term-400/70 mt-2 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Legacy plans */}
      <div className="mb-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 mb-6">No longer offered</p>
        <p className="text-sm text-white/40 mb-8">These plans are closed to new customers. Their Service Descriptions remain in effect for existing subscriptions.</p>

        <div className="space-y-6">
          {legacyPlans.map((plan, i) => (
            <div key={i} className="border border-white/[0.04] bg-ink-800/40 p-8 opacity-70">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">PLAN // {plan.name}</p>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-medium text-white mb-2">Service Description — {plan.name}</h2>
                  <p className="text-sm text-white/50 leading-relaxed max-w-xl">{plan.description}</p>
                </div>
                <span className="font-mono text-[11px] text-white/30 shrink-0 md:pt-1">{plan.effective}</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-white/40">
                    <span className="w-1.5 h-1.5 bg-white/20 mt-2 shrink-0" />
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
        <Link to="/privacy" className="font-mono text-xs tracking-[0.2em] uppercase text-white/40 hover:text-term-300 transition-colors">
          View the Privacy Policy →
        </Link>
      </div>
    </LegalPageLayout>
  );
}
