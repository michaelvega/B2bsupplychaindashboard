import { useNavigate } from 'react-router';
import { ArrowRight, ArrowDown, Check, BarChart3, Brain, ShieldCheck, TrendingUp, Zap, Factory, Globe, Users } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-lg tracking-tight text-white">Procept</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/daily-brief')} className="text-white/60 hover:text-white text-sm font-medium transition-colors">
              Demo
            </button>
            <a
              href="https://calendly.com/sscarozzi/30min"
              target="_blank"
              rel="noreferrer"
              className="bg-white text-black font-semibold px-5 py-2.5 rounded-lg transition-all text-sm hover:bg-gray-200"
            >
              Book a Call
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col pt-16">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/factoryimage.png"
        >
          <source src="/hero-factory.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex-1 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] mb-8">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-white/70 tracking-wide">AI-Powered Supply Chain Intelligence</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
                  AI for your<br />supply chain.
                </h1>

                <p className="text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed mb-10">
                  Equip your procurement and operations teams with the hidden knowledge trapped inside your ERP. Autonomous agents that resolve errors, forecast demand, and orchestrate supply — before disruption hits your bottom line.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => navigate('/daily-brief')}
                    className="bg-white text-black font-semibold px-7 py-3.5 rounded-xl inline-flex items-center gap-2 transition-all text-base hover:bg-gray-200 hover:-translate-y-0.5"
                  >
                    Try Interactive Demo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="https://calendly.com/sscarozzi/30min"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/70 hover:text-white font-medium px-6 py-3.5 rounded-xl inline-flex items-center gap-2 transition-all text-base border border-white/20 hover:border-white/40"
                  >
                    Talk to Founders
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pb-8">
            <div className="inline-flex flex-col items-center gap-2 text-white/20 text-xs tracking-widest uppercase font-medium animate-bounce">
              <span>Scroll</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative z-10 -mt-1 bg-black border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">The Cost of Standing Still</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight max-w-2xl mx-auto">
              By 2027, companies that don't adopt AI in their supply chain will lose <span className="text-white">30% of competitive advantage</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { value: '60%', label: 'of procurement errors go undetected for 48+ hours in legacy ERPs' },
              { value: '$4.8M', label: 'average annual margin leakage from stale master pricing data' },
              { value: '14 Days', label: 'average time to detect and resolve a supplier fulfillment mismatch' },
              { value: '83%', label: 'of supply chain leaders say AI is critical to their 2027 roadmap' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                <p className="text-sm text-white/50 leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-black border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">The Platform</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.15]">
              Every supply chain workflow,<br />autonomous.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Procurement Error Resolution */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mb-6 group-hover:bg-white/[0.1] transition-colors">
                <ShieldCheck className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Procurement Error Resolution</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Autonomous agents detect and resolve purchase order discrepancies, fulfillment mismatches, and pricing errors within minutes — not days.
              </p>
              <ul className="space-y-2 text-sm text-white/40">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <span>Real-time PO-to-invoice reconciliation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <span>Automated vendor discrepancy alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <span>70% reduction in manual order errors</span>
                </li>
              </ul>
            </div>

            {/* Supply Planning */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mb-6 group-hover:bg-white/[0.1] transition-colors">
                <Brain className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Supply Planning & Orchestration</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                AI-driven inventory allocation across warehouses, automated reorder point calculation, and dynamic safety stock adjustment based on real-time conditions.
              </p>
              <ul className="space-y-2 text-sm text-white/40">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <span>Multi-warehouse inventory balancing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <span>Dynamic reorder point optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <span>20-30% reduction in excess inventory</span>
                </li>
              </ul>
            </div>

            {/* Demand Forecasting */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mb-6 group-hover:bg-white/[0.1] transition-colors">
                <TrendingUp className="w-6 h-6 text-white/80" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Demand Forecasting with ML</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Machine learning models that ingest weather patterns, macro indicators, and real-time sales data to predict demand surges before they happen — not after.
              </p>
              <ul className="space-y-2 text-sm text-white/40">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <span>Real-time weather-driven demand modeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <span>Long-tail parts and SKU forecasting</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                  <span>15-20% improvement in forecast accuracy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-black border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.15]">
              Your ERP has the data.<br />We surface the intelligence.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect',
                desc: 'Plug into your existing ERP, email, and file systems. No migration. No IT project. We sit on top of what you already use.',
                icon: <Globe className="w-5 h-5" />,
              },
              {
                step: '02',
                title: 'Analyze',
                desc: 'Our agents continuously scan your operational data — purchase orders, invoices, inventory levels, supplier communications — surfacing hidden risks and opportunities.',
                icon: <Brain className="w-5 h-5" />,
              },
              {
                step: '03',
                title: 'Act',
                desc: 'Autonomous workflows execute resolution actions, generate forecasts, and alert your team — all before the coffee gets cold.',
                icon: <Zap className="w-5 h-5" />,
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="text-white/10 text-7xl font-bold mb-4 tracking-tighter">{item.step}</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-white/60">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="bg-black border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">Use Cases</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.15]">
              Built for specialty wholesale distribution.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weather-Driven Demand */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 group hover:bg-white/[0.05] transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 mt-1">
                  <Globe className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Weather-Driven Demand Shocks</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Stop forecasting with last year's weather. Dynamic agent ingests real-time regional weather models to automatically adjust short-term inventory allocation across your territory. A Kentucky ice storm triggers chainsaw stock rebalancing before the first call comes in.
                  </p>
                </div>
              </div>
            </div>

            {/* Long-tail Parts */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 group hover:bg-white/[0.05] transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 mt-1">
                  <BarChart3 className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Long-Tail Parts Forecasting</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Millions in working capital trapped in obsolete replacement parts. Our digital inventory analyst recalculates the exact mix of whole-goods versus parts based on the active lifespan of equipment currently in your territory.
                  </p>
                </div>
              </div>
            </div>

            {/* Supplier Risk */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 group hover:bg-white/[0.05] transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 mt-1">
                  <ShieldCheck className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Supplier Risk Intelligence</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Continuous monitoring of supplier compliance, on-time performance, and quality metrics. Automatic flagging of vendors approaching risk thresholds — before a missed delivery cascades into a production stoppage.
                  </p>
                </div>
              </div>
            </div>

            {/* Dealer Network */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 group hover:bg-white/[0.05] transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 mt-1">
                  <Factory className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Multi-Tier Dealer Network Visibility</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    See demand signals across your entire six-state dealer network. When 50 independent hardware stores start ordering the same SKU, your central warehouse knows before the stockout.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS 2 ── */}
      <section className="bg-black border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-10 md:p-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
              {[
                { value: '15-20%', label: 'improvement in regional forecast accuracy with ML-driven demand sensing' },
                { value: '>70%', label: 'reduction in manual procurement error resolution time' },
                { value: '20-30%', label: 'reduction in excess and understock inventory across warehouses' },
              ].map((stat, i) => (
                <div key={i} className={i < 2 ? 'md:border-r border-white/[0.06]' : ''}>
                  <div className="text-4xl font-bold text-white mb-3 tracking-tight">{stat.value}</div>
                  <p className="text-white/40 text-sm leading-relaxed max-w-[240px] mx-auto">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDERS ── */}
      <section className="bg-black border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">Who We Are</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.15]">
              Built by supply chain engineers,<br />for supply chain operators.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Sam */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center group hover:bg-white/[0.05] transition-all">
              <div className="w-20 h-20 rounded-full bg-white/[0.06] mx-auto mb-5 flex items-center justify-center text-2xl font-bold text-white/40">
                SC
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Sam Carozzi</h3>
              <p className="text-white/40 text-sm mb-4">Data Science</p>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                Data scientist with forecasting experience in hospitality and insurance. Bachelor's graduate and current MS Computer Science candidate at Georgia Tech, specializing in supply chain intelligence. Capstone research focused on autonomous procurement workflows and ERP data integration.
              </p>
            </div>

            {/* Michael */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 text-center group hover:bg-white/[0.05] transition-all">
              <div className="w-20 h-20 rounded-full bg-white/[0.06] mx-auto mb-5 flex items-center justify-center text-2xl font-bold text-white/40">
                MV
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Michael Vega</h3>
              <p className="text-white/40 text-sm mb-4">Machine Learning</p>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                ML specialist with applied forecasting experience at an investment research firm, building predictive models for Pinterest's market performance. Bachelor's graduate and current MS Computer Science candidate at Georgia Tech. Supply chain capstone with focus on demand sensing and inventory optimization algorithms.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-white/30 text-sm">
              Georgia Tech · Scheller College of Business · Supply Chain & Logistics Institute
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-black border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Ready to see what your supply chain<br />has been hiding from you?
              </h2>
              <p className="text-white/40 text-lg mb-8 max-w-md mx-auto">
                Unlock the intelligence trapped in your ERP. Autonomous agents, zero IT lift.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/daily-brief')}
                  className="bg-white text-black font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2.5 transition-all text-base hover:bg-gray-200 hover:-translate-y-0.5"
                >
                  Launch Interactive Demo
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://calendly.com/sscarozzi/30min"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/60 hover:text-white font-medium px-6 py-4 rounded-xl inline-flex items-center gap-2 transition-colors border border-white/15 hover:border-white/30"
                >
                  Talk to Founders
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-6 h-6 rounded-md opacity-60" />
            <span className="text-sm text-white/30">Procept © 2026</span>
          </div>
          <p className="text-xs text-white/20">
            Equipping supply chain professionals with the hidden knowledge inside their company.
          </p>
        </div>
      </footer>
    </div>
  );
}
