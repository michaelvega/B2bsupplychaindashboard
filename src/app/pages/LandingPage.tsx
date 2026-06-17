import { useNavigate } from 'react-router';
import { ArrowRight, ArrowDown, Bot, Target, Zap, Link, ShieldCheck, LineChart, Factory, Store, Settings, Brain, Check } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const ProceptLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="43" cy="50" r="28" />
    <path d="M 4 50 L 96 50 M 78 36 L 96 50 L 78 64" />
  </svg>
);

const DataFlowDiagram = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-12 overflow-x-auto pb-4">
      <div className="w-full min-w-[900px] h-[460px] bg-white border border-pro-200 rounded-2xl shadow-sm overflow-hidden flex items-center justify-center">
        <div className="w-[900px] h-full relative mx-auto shrink-0">
      <style>
        {`
          @keyframes flow-forward {
            from { stroke-dashoffset: 40; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes flow-reverse {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: 40; }
          }
          @keyframes hub-pulse {
            0% { transform: scale(1); box-shadow: 0 4px 20px rgba(37,99,235,0.08); }
            50% { transform: scale(1.03); box-shadow: 0 10px 30px rgba(37,99,235,0.2); }
            100% { transform: scale(1); box-shadow: 0 4px 20px rgba(37,99,235,0.08); }
          }
          .animate-flow-forward { animation: flow-forward 3s linear infinite; }
          .animate-flow-forward-fast { animation: flow-forward 1.5s linear infinite; }
          .animate-flow-reverse { animation: flow-reverse 1s linear infinite; }
          .animate-hub-pulse { animation: hub-pulse 2.5s infinite; }
        `}
      </style>

      {/* Nodes */}
      <div className="absolute p-5 py-4 rounded-xl flex flex-col items-center justify-center z-10 font-semibold shadow-sm bg-white border border-pro-200 text-pro-800 text-center" style={{ top: '280px', left: '65px', width: '150px' }}>
        <Factory className="w-6 h-6 mb-1 text-pro-200" />
        {t('landing.diagram.suppliers')}
        <span className="block text-sm font-normal mt-0.5 text-pro-400 leading-tight">{t('landing.diagram.rawMaterials')}</span>
      </div>

      <div className="absolute p-5 py-4 rounded-xl flex flex-col items-center justify-center z-10 font-semibold shadow-sm bg-white border border-pro-200 text-pro-800 text-center" style={{ top: '280px', left: '375px', width: '150px' }}>
        <Settings className="w-6 h-6 mb-1 text-accent-500" />
        {t('landing.diagram.manufacturer')}
        <span className="block text-sm font-normal mt-0.5 text-pro-400 leading-tight">{t('landing.diagram.erp')}</span>
      </div>

      <div className="absolute p-5 py-4 rounded-xl flex flex-col items-center justify-center z-10 font-semibold shadow-sm bg-white border border-pro-200 text-pro-800 text-center" style={{ top: '280px', left: '685px', width: '150px' }}>
        <Store className="w-6 h-6 mb-1 text-pro-200" />
        {t('landing.diagram.retailers')}
        <span className="block text-sm font-normal mt-0.5 text-pro-400 leading-tight">{t('landing.diagram.wholesale')}</span>
      </div>

      <div className="absolute p-5 py-4 rounded-xl flex flex-col items-center justify-center z-10 font-semibold shadow-md bg-pro-900 border border-pro-800 text-white animate-hub-pulse text-center" style={{ top: '40px', left: '335px', width: '230px' }}>
        <Brain className="w-7 h-7 mb-1 text-accent-400" />
        {t('landing.diagram.procept')}
        <span className="block text-sm font-normal mt-0.5 text-slate-400 leading-tight">{t('landing.diagram.validation')}</span>
      </div>

      {/* Labels */}
      <div className="absolute text-sm font-medium text-pro-400 z-[5]" style={{ top: '325px', left: '240px' }}>{t('landing.diagram.labelMaterials')}</div>
      <div className="absolute text-sm font-medium text-pro-400 z-[5]" style={{ top: '325px', left: '580px' }}>{t('landing.diagram.labelShipments')}</div>
      <div className="absolute text-sm font-medium text-pro-400 z-[5]" style={{ top: '180px', left: '230px' }}>{t('landing.diagram.labelSupplierReports')}</div>
      <div className="absolute text-sm font-medium text-accent-600 z-[5]" style={{ top: '160px', left: '460px' }}>{t('landing.diagram.labelCleanData')}</div>
      <div className="absolute text-sm font-medium text-red-500 z-[5]" style={{ top: '160px', left: '630px' }}>{t('landing.diagram.labelRawEDI')}</div>

      {/* Curved Lines */}
      <svg className="absolute top-0 left-0 w-full h-full z-[1]">
        <path d="M 170 320 L 380 320" className="fill-none stroke-pro-200 stroke-[4px] [stroke-dasharray:15,15] animate-flow-forward" strokeLinecap="round" />
        <path d="M 520 320 L 700 320" className="fill-none stroke-pro-200 stroke-[4px] [stroke-dasharray:15,15] animate-flow-forward" strokeLinecap="round" />

        <path d="M 140 280 C 140 140, 300 90, 335 90" className="fill-none stroke-accent-400 stroke-[3px] [stroke-dasharray:8,8] animate-flow-forward-fast opacity-80" strokeLinecap="round" />

        <path d="M 760 280 C 760 140, 600 90, 565 90" className="fill-none stroke-red-400 stroke-[3px] [stroke-dasharray:8,8] animate-flow-reverse opacity-80" strokeLinecap="round" />

        <path d="M 450 120 L 450 280" className="fill-none stroke-accent-400 stroke-[4px] [stroke-dasharray:8,8] animate-flow-forward-fast opacity-80" strokeLinecap="round" />
      </svg>
        </div>
    </div>
  </div>
  );
};

export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen text-pro-900" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* ──────────────────────────────────── */}
      {/* NAV — Clean, light bg */}
      {/* ──────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="/procept-logo-light.jpg"
              alt="Procept"
              className="w-9 h-9 rounded-lg"
            />
            <span className="font-bold text-lg tracking-tight text-pro-900">
              Procept
            </span>
          </div>
          <a
            href="https://calendly.com/sscarozzi/30min"
            target="_blank"
            rel="noreferrer"
            className="bg-accent-600 hover:bg-accent-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm shadow-lg shadow-accent-600/15 hover:shadow-accent-500/25"
          >
            Book a Call
          </a>
        </div>
      </nav>

      {/* ──────────────────────────────────── */}
      {/* HERO — White + dot grid + Spline */}
      {/* ──────────────────────────────────── */}
      <section className="relative min-h-screen bg-white overflow-hidden flex flex-col pt-16">
        {/* Dot-grid pattern — YC/Firecrawl style */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #d4d4d8 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Ambient glow — cyan/teal to complement Spline's blue factory glow */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-cyan-400/[0.06] rounded-full blur-[150px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/[0.04] rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex-1 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-12 lg:py-20">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

                {/* LEFT — Copy */}
                <div className="space-y-5 lg:space-y-7 lg:pr-8">
                  {/* Tagline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-pro-900 leading-[1.08]">
                    Procept: Your Always On Call{' '}
                    <span className="text-accent-600">Procurement&nbsp;Officer</span>
                  </h1>

                  {/* Eyebrow / Subline */}
                  <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-gray-400">
                    vertical procurement operations agent automation
                  </p>

                  {/* ERP Hook */}
                  <p className="text-base sm:text-lg text-gray-500 max-w-lg leading-relaxed">
                    Unsilo your data to unlock agent automation with your preexisting&nbsp;ERP
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <a
                      href="https://calendly.com/sscarozzi/30min"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-accent-600 hover:bg-accent-500 text-white font-semibold px-7 py-3.5 rounded-xl inline-flex items-center gap-2.5 transition-all text-sm shadow-lg shadow-accent-600/20 hover:shadow-accent-500/25 hover:-translate-y-0.5"
                    >
                      Book a Call
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => navigate('/daily-brief')}
                      className="text-gray-500 hover:text-pro-900 font-medium px-6 py-3.5 rounded-xl inline-flex items-center gap-2 transition-all text-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    >
                      Try Interactive Demo
                    </button>
                  </div>
                </div>

                {/* RIGHT — Factory Image */}
                <div className="relative lg:self-stretch flex items-center">
                  <div className="absolute inset-0 bg-cyan-400/[0.04] rounded-[2.5rem] blur-3xl -z-10 pointer-events-none scale-90" />
                  <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200/80 shadow-xl shadow-gray-200/50 bg-[#0A0D12] aspect-[5/4] lg:aspect-[16/9]">
                    <img
                      src="/factoryimage.png"
                      alt="Smart Factory"
                      className="block w-full h-full object-cover"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="text-center pb-8">
            <div className="inline-flex flex-col items-center gap-2 text-gray-300 text-xs tracking-widest uppercase font-medium">
              <span>Scroll</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────── */}
      {/* MAIN — Light Content */}
      {/* ──────────────────────────────────── */}
      <main className="relative max-w-5xl mx-auto px-6 lg:px-8 py-16 space-y-24 lg:space-y-32">

        {/* ── STATS STRIP ── */}
        <section>
          <p className="text-center text-pro-800 mb-12 max-w-3xl mx-auto text-lg font-medium leading-relaxed">
            {t('landing.statsIntro')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-0 bg-pro-100 rounded-2xl overflow-hidden">
            <div className="bg-pro-100 p-8 md:p-10 flex flex-col items-center text-center md:border-r border-pro-200">
              <div className="text-6xl font-bold text-accent-600 mb-3 tracking-tight">60%</div>
              <p className="text-pro-800 text-sm leading-relaxed max-w-[220px]">{t('landing.stat1Desc')}</p>
            </div>
            <div className="bg-pro-100 p-8 md:p-10 flex flex-col items-center text-center md:border-r border-pro-200">
              <div className="text-6xl font-bold text-accent-600 mb-3 tracking-tight">$1.2B</div>
              <p className="text-pro-800 text-sm leading-relaxed max-w-[220px]">{t('landing.stat2Desc')}</p>
            </div>
            <div className="bg-pro-100 p-8 md:p-10 flex flex-col items-center text-center">
              <div className="text-6xl font-bold text-accent-600 mb-3 tracking-tight">{t('landing.days')}</div>
              <p className="text-pro-800 text-sm leading-relaxed max-w-[220px]">{t('landing.stat3Desc')}</p>
            </div>
          </div>
        </section>

        {/* ── PROBLEM SECTION ── */}
        <section>
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-600 mb-4">
              The Problem
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-pro-900 leading-[1.15]">
              {t('landing.problemTitle')}
            </h2>
          </div>
          <div className="text-pro-800 leading-relaxed text-lg mb-12 max-w-3xl">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent-500 mt-1.5 shrink-0">—</span>
                <span>{t('landing.problemDesc1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-500 mt-1.5 shrink-0">—</span>
                <span>{t('landing.problemDesc2')}</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 — Immediate */}
            <div className="bg-white border border-pro-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-pro-100">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-pro-900 tracking-wide uppercase text-xs group-hover:text-accent-600 transition-colors">
                  {t('landing.immediateTermsTitle')}
                </h3>
              </div>
              <ul className="space-y-5 text-pro-800 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span><strong className="text-pro-900 font-semibold">{t('landing.immediateIssue1Label')}</strong> {t('landing.immediateIssue1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span><strong className="text-pro-900 font-semibold">{t('landing.immediateIssue2Label')}</strong> {t('landing.immediateIssue2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span><strong className="text-pro-900 font-semibold">{t('landing.immediateIssue3Label')}</strong> {t('landing.immediateIssue3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <span><strong className="text-pro-900 font-semibold">{t('landing.immediateIssue4Label')}</strong> {t('landing.immediateIssue4')}</span>
                </li>
              </ul>
            </div>

            {/* Column 2 — Long-Term */}
            <div className="bg-white border border-pro-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-pro-100">
                <div className="p-2.5 bg-accent-50 rounded-xl text-accent-600 shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-pro-900 tracking-wide uppercase text-xs group-hover:text-accent-600 transition-colors">
                  {t('landing.longTermTitle')}
                </h3>
              </div>
              <ul className="space-y-5 text-pro-800 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong className="text-pro-900 font-semibold">{t('landing.longTermIssue1Label')}</strong> {t('landing.longTermIssue1')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong className="text-pro-900 font-semibold">{t('landing.longTermIssue2Label')}</strong> {t('landing.longTermIssue2')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong className="text-pro-900 font-semibold">{t('landing.longTermIssue3Label')}</strong> {t('landing.longTermIssue3')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong className="text-pro-900 font-semibold">{t('landing.longTermIssue4Label')}</strong> {t('landing.longTermIssue4')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── SOLUTION SECTION ── */}
        <section>
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-600 mb-4">
              The Solution
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-pro-900 leading-[1.15]">
              {t('landing.solutionTitle')}
            </h2>
          </div>
          <div className="text-pro-800 leading-relaxed text-lg max-w-3xl">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent-500 mt-1.5 shrink-0">—</span>
                <span>{t('landing.solutionDesc1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-500 mt-1.5 shrink-0">—</span>
                <span>{t('landing.solutionDesc2')}</span>
              </li>
            </ul>
          </div>

          <DataFlowDiagram />

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Scenario 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-pro-200 p-8 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-pro-100 rounded-bl-full -mr-20 -mt-20 z-0 pointer-events-none group-hover:bg-accent-50/50 transition-colors" />
              <ShieldCheck className="w-10 h-10 text-accent-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-bold text-pro-900 mb-5 relative z-10">{t('landing.scenario1Title')}</h3>
              <ul className="space-y-4 text-pro-700 relative z-10 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong>{t('landing.scenario1Bul1')}</strong>{t('landing.scenario1Bul1B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong>{t('landing.scenario1Bul2')}</strong>{t('landing.scenario1Bul2B')}<i>{t('landing.scenario1Bul2C')}</i>{t('landing.scenario1Bul2D')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong>{t('landing.scenario1Bul3')}</strong>{t('landing.scenario1Bul3B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong>{t('landing.scenario1Bul4')}</strong>{t('landing.scenario1Bul4B')}</span>
                </li>
              </ul>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-pro-200 p-8 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-pro-100 rounded-bl-full -mr-20 -mt-20 z-0 pointer-events-none group-hover:bg-accent-50/50 transition-colors" />
              <LineChart className="w-10 h-10 text-accent-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-bold text-pro-900 mb-5 relative z-10">{t('landing.scenario2Title')}</h3>
              <ul className="space-y-4 text-pro-700 relative z-10 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong>{t('landing.scenario2Bul1')}</strong>{t('landing.scenario2Bul1B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong>{t('landing.scenario2Bul2')}</strong>{t('landing.scenario2Bul2B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong>{t('landing.scenario2Bul3')}</strong>{t('landing.scenario2Bul3B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                  <span><strong>{t('landing.scenario2Bul4')}</strong>{t('landing.scenario2Bul4B')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Governability Banner */}
          <div className="mt-8 bg-white border border-pro-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="bg-accent-50 p-4 rounded-full shadow-sm border border-accent-100 shrink-0 relative z-10">
              <ShieldCheck className="w-8 h-8 text-accent-600" />
            </div>
            <div className="text-center md:text-left relative z-10">
              <h3 className="text-xl font-bold text-pro-900 mb-2">{t('landing.govTitle')}</h3>
              <p className="text-pro-700 md:text-lg font-medium leading-relaxed">
                {t('landing.govDesc')}
              </p>
              <div className="mt-5 inline-flex items-start gap-3 bg-pro-50 p-4 rounded-xl border border-pro-200 w-fit max-w-lg">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-pro-800 leading-snug text-left">
                  We can install on your own VPC completely on your infrastructure. Zero data exfiltration—your data never touches a Procept server, and we never train models on your data.
                </p>
              </div>
            </div>
          </div>

          {/* Claude Code Integration */}
          <div className="mt-8 bg-white border border-pro-200 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-50 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none opacity-60" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-50/50 rounded-full blur-[60px] -ml-20 -mb-20 pointer-events-none opacity-40" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 pb-6 border-b border-pro-100">
                <div className="p-3 bg-accent-50 border border-accent-100 rounded-xl shrink-0 shadow-sm">
                  <Bot className="w-8 h-8 text-accent-600" />
                </div>
                <h2 className="text-3xl font-bold text-pro-900 tracking-tight">
                  How Does Procept Integrate with Claude Code?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    title: 'Direct ERP Integration',
                    desc: 'Procept includes an out-of-the-box SAP skill that integrates directly with your ERP, perfectly complementing Claude Code\'s capabilities.',
                  },
                  {
                    title: 'Zero IT Distractions',
                    desc: 'Maintain focus on core competencies. Procept provides the necessary infrastructure immediately, saving your IT team months of custom internal tool development.',
                  },
                  {
                    title: 'Built for Operations',
                    desc: 'Designed specifically for supply chain professionals. We deliver a tailored, autonomous user interface that does not require a bit of code or engineering to automate high impact workflows.',
                  },
                  {
                    title: 'Breaking Down Silos',
                    desc: 'Data silos limit AI effectiveness. Our Enterprise Search unifies your data in one accessible location, significantly uplifting our AI coworker and others like Claude Code.',
                  },
                ].map((card) => (
                  <div key={card.title} className="bg-pro-50 border border-pro-200/60 rounded-2xl p-6 hover:shadow-sm hover:border-pro-200 transition-all group/card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-accent-500 shrink-0 group-hover/card:scale-125 transition-transform" />
                      <h3 className="text-lg font-semibold text-pro-900">{card.title}</h3>
                    </div>
                    <p className="text-pro-700 leading-relaxed text-sm">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ SECTION ── */}
        <section>
          <div className="mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-600 mb-4">
              Common Questions
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-pro-900 tracking-tight flex items-center gap-3">
              <Target className="text-accent-600 w-8 h-8" />
              {t('landing.faqTitle')}
            </h2>
          </div>

          <div className="space-y-5">
            {/* Flow 1 */}
            <div className="bg-white rounded-2xl border border-pro-200 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow group">
              <h3 className="font-bold text-lg text-pro-900 flex gap-3 mb-4 leading-snug group-hover:text-accent-600 transition-colors">
                <span className="text-accent-600 shrink-0">{t('landing.qA')}</span>
                <span>{t('landing.q1Title')}</span>
              </h3>
              <div className="flex gap-3 text-pro-700 text-sm leading-relaxed">
                <span className="text-accent-600 font-bold text-lg shrink-0">{t('landing.aA')}</span>
                <div>
                  <p className="mb-3"><strong>{t('landing.q1A1')}</strong>{t('landing.q1A1B')}<i>{t('landing.q1A1C')}</i>{t('landing.q1A1D')}</p>
                  <p className="text-sm bg-pro-50 inline-block px-3 py-1.5 rounded-lg border border-pro-200"><strong>{t('landing.q1Result')}</strong>{t('landing.q1ResultB')}</p>
                </div>
              </div>
            </div>

            {/* Flow 2 */}
            <div className="bg-white rounded-2xl border border-pro-200 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow group">
              <h3 className="font-bold text-lg text-pro-900 flex gap-3 mb-4 leading-snug group-hover:text-accent-600 transition-colors">
                <span className="text-accent-600 shrink-0">{t('landing.qA')}</span>
                <span>{t('landing.q2Title')}</span>
              </h3>
              <div className="flex gap-3 text-pro-700 text-sm leading-relaxed">
                <span className="text-accent-600 font-bold text-lg shrink-0">{t('landing.aA')}</span>
                <div>
                  <p className="mb-3"><strong>{t('landing.q2A1')}</strong>{t('landing.q2A1B')}</p>
                  <p className="text-sm bg-pro-50 inline-block px-3 py-1.5 rounded-lg border border-pro-200"><strong>{t('landing.q2Result')}</strong>{t('landing.q2ResultB')}</p>
                </div>
              </div>
            </div>

            {/* Flow 3 */}
            <div className="bg-white rounded-2xl border border-pro-200 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow group">
              <h3 className="font-bold text-lg text-pro-900 flex gap-3 mb-4 leading-snug group-hover:text-accent-600 transition-colors">
                <span className="text-accent-600 shrink-0">{t('landing.qA')}</span>
                <span>{t('landing.q3Title')}</span>
              </h3>
              <div className="flex gap-3 text-pro-700 text-sm leading-relaxed">
                <span className="text-accent-600 font-bold text-lg shrink-0">{t('landing.aA')}</span>
                <div>
                  <p className="mb-3"><strong>{t('landing.q3A1')}</strong>{t('landing.q3A1B')}</p>
                  <p className="text-sm bg-pro-50 inline-block px-3 py-1.5 rounded-lg border border-pro-200"><strong>{t('landing.q3Result')}</strong>{t('landing.q3ResultB')}</p>
                </div>
              </div>
            </div>

            {/* Smaller FAQ grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[
                [t('landing.q4Title'), t('landing.q4A1'), t('landing.q4A1B')],
                [t('landing.q5Title'), t('landing.q5A1'), t('landing.q5A1B')],
                [t('landing.q6Title'), t('landing.q6A1'), t('landing.q6A1B')],
                [t('landing.q7Title'), t('landing.q7A1'), t('landing.q7A1B')],
              ].map(([title, strong, rest], i) => (
                <div key={i} className="bg-white rounded-2xl border border-pro-200 shadow-sm p-5 hover:border-pro-300 hover:shadow-sm transition-all group">
                  <h4 className="font-semibold text-pro-900 mb-2 leading-snug group-hover:text-accent-600 transition-colors">{title}</h4>
                  <p className="text-sm text-pro-700 leading-relaxed"><strong>{strong}</strong>{rest}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FOOTER ── */}
        <div className="text-center pb-16">
          <div className="bg-white border border-pro-200 rounded-3xl p-10 md:p-16 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-50/60 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-pro-900 mb-4 tracking-tight">
                Ready to put procurement on autopilot?
              </h2>
              <p className="text-pro-700 text-lg mb-8 max-w-md mx-auto">
                See how Procept catches supply chain issues before they cost you money.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/daily-brief')}
                  className="bg-accent-600 hover:bg-accent-500 text-white font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2.5 transition-all text-base shadow-xl shadow-accent-600/25 hover:shadow-accent-500/30 hover:-translate-y-0.5"
                >
                  {t('landing.launchDashboard')}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://calendly.com/sscarozzi/30min"
                  target="_blank"
                  rel="noreferrer"
                  className="text-pro-700 hover:text-pro-900 font-medium px-6 py-4 rounded-xl inline-flex items-center gap-2 transition-colors border border-pro-200 hover:border-pro-300"
                >
                  Book a Call
                </a>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
