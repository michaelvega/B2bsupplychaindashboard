import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, ArrowDown, Bot, Target, Zap, Link, ShieldCheck, LineChart, Factory, Store, Settings, Brain, Check } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const ProceptLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="43" cy="50" r="28" />
    <path d="M 4 50 L 96 50 M 78 36 L 96 50 L 78 64" />
  </svg>
);

const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [floatY, setFloatY] = useState(0);
  const [floatShadow, setFloatShadow] = useState('0 8px 30px rgba(0,0,0,0.08)');
  const animRef = useRef(0);

  const animate = useCallback(() => {
    const t = performance.now() / 1000;
    const y = Math.sin(t * 1.2) * 10; // ±10px oscillation
    const shadowAlpha = 0.08 + ((Math.sin(t * 1.2) + 1) / 2) * 0.08; // 0.08 → 0.16
    const shadowY = 8 + ((Math.sin(t * 1.2) + 1) / 2) * 16; // 8px → 24px
    const shadowBlur = 30 + ((Math.sin(t * 1.2) + 1) / 2) * 25; // 30px → 55px
    setFloatY(y);
    setFloatShadow(`0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha.toFixed(3)})`);
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!hovering) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animRef.current);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [hovering, animate]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  };

  // Always use inline transform so CSS transition can interpolate seamlessly
  const transform = hovering
    ? `perspective(1200px) rotateY(${tilt.x * 12}deg) rotateX(${-tilt.y * 8}deg) translateZ(20px)`
    : `perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(${floatY}px)`;

  const boxShadow = hovering
    ? `${-tilt.x * 30}px ${-tilt.y * 30}px 60px rgba(0,0,0,0.15)`
    : floatShadow;

  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div
        ref={ref}
        className={className}
        style={{
          transform,
          boxShadow,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { setHovering(false); setTilt({ x: 0, y: 0 }); }}
      >
        {/* Shine gleam overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: hovering ? 'none' : 'shimmer 3.5s ease-in-out infinite',
          }}
        />
        {children}
      </div>
    </>
  );
};

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
      {/* NAV — Transparent glass over video */}
      {/* ──────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-pro-950/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="/procept-logo-light.jpg"
              alt="Procept"
              className="w-9 h-9 rounded-lg"
            />
            <span className="font-bold text-lg tracking-tight text-white">
              Procept
            </span>
          </div>
          <a
            href="https://calendly.com/sscarozzi/30min"
            target="_blank"
            rel="noreferrer"
            className="bg-accent-600 hover:bg-accent-500 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm shadow-lg shadow-accent-600/20 hover:shadow-accent-500/30"
          >
            Book a Call
          </a>
        </div>
      </nav>

      {/* ──────────────────────────────────── */}
      {/* HERO — Full-bleed factory video background */}
      {/* ──────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden flex flex-col pt-16 bg-pro-950">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/factoryimage.png"
        >
          <source src="/hero-factory.mp4" type="video/mp4" />
        </video>

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-pro-950/90 via-pro-950/70 to-pro-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-pro-950/60 via-transparent to-pro-950/30" />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex-1 flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-12 lg:py-20">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

                {/* LEFT — Copy */}
                <div className="space-y-5 lg:space-y-7 lg:pr-8">
                  {/* Eyebrow / Subline */}
                  <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-accent-400">
                    Agentic AI Operations Layer for Smart Procurement and Manufacturing
                  </p>

                  {/* Tagline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                    Your Always On Call{' '}
                    <span className="text-accent-400">Procurement&nbsp;Officer</span>
                  </h1>

                  {/* ERP Hook */}
                  <p className="text-base sm:text-lg text-slate-300 max-w-lg leading-relaxed">
                    Unsilo your data to unlock agent automation with your preexisting&nbsp;ERP
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <a
                      href="https://calendly.com/sscarozzi/30min"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-accent-600 hover:bg-accent-500 text-white font-semibold px-7 py-3.5 rounded-xl inline-flex items-center gap-2.5 transition-all text-sm shadow-lg shadow-accent-600/30 hover:shadow-accent-500/35 hover:-translate-y-0.5"
                    >
                      Book a Call
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => navigate('/daily-brief')}
                      className="text-slate-300 hover:text-white font-medium px-6 py-3.5 rounded-xl inline-flex items-center gap-2 transition-all text-sm border border-slate-600 hover:border-slate-400 hover:bg-white/10"
                    >
                      Try Interactive Demo
                    </button>
                  </div>
                </div>

                {/* RIGHT — empty, video fills the space */}
                <div />

              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="text-center pb-8">
            <div className="inline-flex flex-col items-center gap-2 text-slate-500 text-xs tracking-widest uppercase font-medium">
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-0 bg-pro-100 rounded-2xl overflow-hidden mb-12">
            <div className="bg-pro-100 p-8 md:p-10 flex flex-col items-center text-center md:border-r border-pro-200">
              <div className="text-6xl font-bold text-accent-600 mb-3 tracking-tight">60%</div>
              <p className="text-pro-800 text-sm leading-relaxed max-w-[220px]">{t('landing.stat1Desc')}</p>
            </div>
            <div className="bg-pro-100 p-8 md:p-10 flex flex-col items-center text-center md:border-r border-pro-200">
              <div className="text-6xl font-bold text-accent-600 mb-3 tracking-tight">$4.8M</div>
              <p className="text-pro-800 text-sm leading-relaxed max-w-[220px]">average PPV margin leakage per manufacturer from stale master pricing data</p>
            </div>
            <div className="bg-pro-100 p-8 md:p-10 flex flex-col items-center text-center">
              <div className="text-6xl font-bold text-accent-600 mb-3 tracking-tight">{t('landing.days')}</div>
              <p className="text-pro-800 text-sm leading-relaxed max-w-[220px]">{t('landing.stat3Desc')}</p>
            </div>
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
            <h3 className="text-2xl md:text-3xl font-bold text-pro-900 mb-4">The How</h3>
            <ul className="space-y-3 mb-10">
              <li className="flex items-start gap-3">
                <span className="text-accent-500 mt-1.5 shrink-0">—</span>
                <span>Procept sits on top of your ERP, Outlook, and OneDrive so that your procurement/operations teams can create complex workflows from natural usage, completely automatically.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-500 mt-1.5 shrink-0">—</span>
                <span>We deploy autonomous AI Coworkers that proactively monitor your ERP, Outlook, and OneDrive to perform life-saving actions before catastrophes.</span>
              </li>
            </ul>
          </div>

          {/* Scenario Cards — full width */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
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

          {/* Data Zero Error */}
          <div className="mb-10 bg-white border border-pro-200 rounded-2xl p-6 md:p-8 flex items-center gap-5 shadow-sm">
            <div className="p-3 bg-accent-50 rounded-xl text-accent-600 shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-pro-800 text-base md:text-lg leading-relaxed">
              <strong className="text-pro-900 font-semibold">Data Zero Error:</strong> Systematically eliminates manual data entry waste and reactive administrative friction, once automated agents scrub your operational data.
            </p>
          </div>

          <div className="text-pro-800 leading-relaxed text-lg max-w-3xl">
            <h3 className="text-2xl md:text-3xl font-bold text-pro-900 mb-4">The Result</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-accent-500 mt-1.5 shrink-0">—</span>
                <span>By embedding Procept directly into Outlook, your ERP, and OneDrive, individual contributors can create bespoke automations, forecasting models, and workflows purely from natural usage and natural language.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-500 mt-1.5 shrink-0">—</span>
                <span>This unlocks AI seamlessly for procurement and operations, without touching the core competencies of your IT team.</span>
              </li>
            </ul>
          </div>

          {/* Proven Impact */}
          <div className="mt-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-600 mb-6">
              Proven Procurement Uplift
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Operations */}
              <div className="bg-white border border-pro-200 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-pro-100">
                  <div className="p-3 bg-accent-50 rounded-xl text-accent-600 shadow-sm">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-pro-900 tracking-wide uppercase text-sm group-hover:text-accent-600 transition-colors">
                    Operations
                  </h3>
                </div>
                <ul className="space-y-5 text-pro-800 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                    <span><strong className="text-pro-900 font-semibold">Resolution Speed:</strong> Shift exception resolution time from days to hours.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                    <span><strong className="text-pro-900 font-semibold">Claims Compliance:</strong> 100% of damage/shortage claims filed within the 48-hour window.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                    <span><strong className="text-pro-900 font-semibold">Execution Adherence:</strong> &gt;90% correct autonomous tool routing.</span>
                  </li>
                </ul>
              </div>

              {/* Inventory & Forecasting */}
              <div className="bg-white border border-pro-200 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-pro-100">
                  <div className="p-3 bg-accent-50 rounded-xl text-accent-600 shadow-sm">
                    <LineChart className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-pro-900 tracking-wide uppercase text-sm group-hover:text-accent-600 transition-colors">
                    Inventory &amp; Forecasting
                  </h3>
                </div>
                <ul className="space-y-5 text-pro-800 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                    <span><strong className="text-pro-900 font-semibold">Forecast Accuracy:</strong> 15–20% improvement in regional MAPE/MAE.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                    <span><strong className="text-pro-900 font-semibold">Stockout Reduction:</strong> &gt;50% lower stockout rates in LatAm centers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                    <span><strong className="text-pro-900 font-semibold">Inventory Optimization:</strong> 20–30% reduction in excess and understock.</span>
                  </li>
                </ul>
              </div>

              {/* Order Accuracy */}
              <div className="bg-white border border-pro-200 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-pro-100">
                  <div className="p-3 bg-accent-50 rounded-xl text-accent-600 shadow-sm">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-pro-900 tracking-wide uppercase text-sm group-hover:text-accent-600 transition-colors">
                    Order Accuracy
                  </h3>
                </div>
                <ul className="space-y-5 text-pro-800 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                    <span><strong className="text-pro-900 font-semibold">Exception Reduction:</strong> &gt;70% decrease in manual order errors.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                    <span><strong className="text-pro-900 font-semibold">Manual Touch Time:</strong> &lt;10 minutes spent per unresolved error.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                    <span><strong className="text-pro-900 font-semibold">Data Accuracy:</strong> &lt;2% post-agent data entry error rate.</span>
                  </li>
                </ul>
              </div>
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
