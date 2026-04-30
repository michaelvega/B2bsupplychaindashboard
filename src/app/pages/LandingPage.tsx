import { useNavigate } from 'react-router';
import { ArrowRight, Bot, Target, Zap, Link, ShieldCheck, LineChart, Factory, Store, Settings, Brain } from 'lucide-react';
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
      <div className="min-w-[900px] mx-auto w-[900px] h-[600px] relative bg-white border border-slate-200 rounded-2xl shadow-sm font-sans flex items-center justify-center">
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
            0% { transform: scale(1); box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1); }
            50% { transform: scale(1.03); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3); }
            100% { transform: scale(1); box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1); }
          }
          .animate-flow-forward { animation: flow-forward 3s linear infinite; }
          .animate-flow-forward-fast { animation: flow-forward 1.5s linear infinite; }
          .animate-flow-reverse { animation: flow-reverse 1s linear infinite; }
          .animate-hub-pulse { animation: hub-pulse 2.5s infinite; }
        `}
      </style>

      {/* Nodes */}
      <div className="absolute p-5 py-4 rounded-xl flex flex-col items-center justify-center z-10 font-semibold shadow-sm bg-white border border-slate-200 text-slate-700 text-center" style={{ top: '340px', left: '65px', width: '150px' }}>
        <Factory className="w-6 h-6 mb-1 text-slate-400" />
        {t('landing.diagram.suppliers')}
        <span className="block text-sm font-normal mt-0.5 text-slate-500 leading-tight">{t('landing.diagram.rawMaterials')}</span>
      </div>

      <div className="absolute p-5 py-4 rounded-xl flex flex-col items-center justify-center z-10 font-semibold shadow-sm bg-white border border-slate-200 text-slate-800 text-center" style={{ top: '340px', left: '375px', width: '150px' }}>
        <Settings className="w-6 h-6 mb-1 text-indigo-500" />
        {t('landing.diagram.manufacturer')}
        <span className="block text-sm font-normal mt-0.5 text-slate-500 leading-tight">{t('landing.diagram.erp')}</span>
      </div>

      <div className="absolute p-5 py-4 rounded-xl flex flex-col items-center justify-center z-10 font-semibold shadow-sm bg-white border border-slate-200 text-slate-700 text-center" style={{ top: '340px', left: '685px', width: '150px' }}>
        <Store className="w-6 h-6 mb-1 text-slate-400" />
        {t('landing.diagram.retailers')}
        <span className="block text-sm font-normal mt-0.5 text-slate-500 leading-tight">{t('landing.diagram.wholesale')}</span>
      </div>

      <div className="absolute p-5 py-4 rounded-xl flex flex-col items-center justify-center z-10 font-semibold shadow-md bg-slate-900 border border-slate-700 text-white animate-hub-pulse text-center" style={{ top: '80px', left: '335px', width: '230px' }}>
        <Brain className="w-7 h-7 mb-1 text-blue-400" />
        {t('landing.diagram.procept')}
        <span className="block text-sm font-normal mt-0.5 text-slate-400 leading-tight">{t('landing.diagram.validation')}</span>
      </div>

      {/* Labels */}
      <div className="absolute text-sm font-medium text-slate-500 z-[5]" style={{ top: '385px', left: '240px' }}>{t('landing.diagram.labelMaterials')}</div>
      <div className="absolute text-sm font-medium text-slate-500 z-[5]" style={{ top: '385px', left: '580px' }}>{t('landing.diagram.labelShipments')}</div>
      <div className="absolute text-sm font-medium text-slate-500 z-[5]" style={{ top: '240px', left: '230px' }}>{t('landing.diagram.labelSupplierReports')}</div>
      <div className="absolute text-sm font-medium text-indigo-600 z-[5]" style={{ top: '220px', left: '460px' }}>{t('landing.diagram.labelCleanData')}</div>
      <div className="absolute text-sm font-medium text-red-500 z-[5]" style={{ top: '220px', left: '630px' }}>{t('landing.diagram.labelRawEDI')}</div>

      {/* Curved Lines */}
      <svg className="absolute top-0 left-0 w-full h-full z-[1]">
        <path d="M 170 380 L 380 380" className="fill-none stroke-slate-300 stroke-[4px] [stroke-dasharray:15,15] animate-flow-forward" strokeLinecap="round" />
        <path d="M 520 380 L 700 380" className="fill-none stroke-slate-300 stroke-[4px] [stroke-dasharray:15,15] animate-flow-forward" strokeLinecap="round" />

        <path d="M 140 340 C 140 200, 300 130, 335 130" className="fill-none stroke-cyan-500 stroke-[3px] [stroke-dasharray:8,8] animate-flow-forward-fast opacity-80" strokeLinecap="round" />
        
        <path d="M 760 340 C 760 200, 600 130, 565 130" className="fill-none stroke-red-500 stroke-[3px] [stroke-dasharray:8,8] animate-flow-reverse opacity-80" strokeLinecap="round" />
        
        <path d="M 450 160 L 450 340" className="fill-none stroke-indigo-400 stroke-[4px] [stroke-dasharray:8,8] animate-flow-forward-fast opacity-80" strokeLinecap="round" />
      </svg>
    </div>
  </div>
  );
};

export function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="relative text-white pt-32 pb-28 px-8 overflow-hidden">
        {/* Background Warehouse Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2940&auto=format&fit=crop")' }}
        ></div>
        {/* Darkening Overlays for text readability */}
        <div className="absolute inset-0 z-0 bg-slate-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/20 to-slate-900/70"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <ProceptLogo className="w-9 h-9 text-white" />
            <span className="text-2xl font-bold tracking-tight text-white">Procept Technologies</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight max-w-4xl text-white drop-shadow-md">
            {t('landing.title')}
          </h1>
          <button
            onClick={() => navigate('/demo')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-lg flex items-center gap-2 transition-colors text-lg shadow-xl shadow-blue-900/20"
          >
            {t('landing.enterDemo')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-8 py-16 space-y-16">

        {/* Problem Section */}
        <section>
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-slate-800 tracking-tight">
            {t('landing.problemTitle')}
          </h2>
          <div className="text-slate-700 leading-relaxed text-lg">
            <p>
              {t('landing.problemDesc1')}
            </p>
            <p className="font-medium text-slate-900 mt-6 mb-4">{t('landing.problemDesc2')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base">

              {/* Column 1 */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200/60 pb-4">
                  <div className="p-2.5 bg-orange-100 rounded-lg text-orange-600 shadow-sm">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">{t('landing.immediateTermsTitle')}</h3>
                </div>
                <ul className="space-y-5 text-slate-700">
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 shadow-sm"></div>
                    <div className="leading-snug"><strong className="text-slate-900 font-semibold">{t('landing.immediateIssue1Label')}</strong> {t('landing.immediateIssue1')}</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 shadow-sm"></div>
                    <div className="leading-snug"><strong className="text-slate-900 font-semibold">{t('landing.immediateIssue2Label')}</strong> {t('landing.immediateIssue2')}</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 shadow-sm"></div>
                    <div className="leading-snug"><strong className="text-slate-900 font-semibold">{t('landing.immediateIssue3Label')}</strong> {t('landing.immediateIssue3')}</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0 shadow-sm"></div>
                    <div className="leading-snug"><strong className="text-slate-900 font-semibold">{t('landing.immediateIssue4Label')}</strong> {t('landing.immediateIssue4')}</div>
                  </li>
                </ul>
              </div>

              {/* Column 2 */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200/60 pb-4">
                  <div className="p-2.5 bg-indigo-100 rounded-lg text-indigo-600 shadow-sm">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">{t('landing.longTermTitle')}</h3>
                </div>
                <ul className="space-y-5 text-slate-700">
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-sm"></div>
                    <div className="leading-snug"><strong className="text-slate-900 font-semibold">{t('landing.longTermIssue1Label')}</strong> {t('landing.longTermIssue1')}</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-sm"></div>
                    <div className="leading-snug"><strong className="text-slate-900 font-semibold">{t('landing.longTermIssue2Label')}</strong> {t('landing.longTermIssue2')}</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-sm"></div>
                    <div className="leading-snug"><strong className="text-slate-900 font-semibold">{t('landing.longTermIssue3Label')}</strong> {t('landing.longTermIssue3')}</div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-sm"></div>
                    <div className="leading-snug"><strong className="text-slate-900 font-semibold">{t('landing.longTermIssue4Label')}</strong> {t('landing.longTermIssue4')}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-slate-50 p-10 rounded-2xl border border-slate-100">
          <p className="text-center text-slate-800 mb-10 max-w-3xl mx-auto font-medium">
            {t('landing.statsIntro')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="pt-6 md:pt-0 flex flex-col items-center py-2 md:px-4">
              <div className="text-5xl font-light text-blue-700 mb-3">60%</div>
              <p className="text-slate-700 text-center max-w-[250px] mx-auto">{t('landing.stat1Desc')}</p>
            </div>
            <div className="pt-6 md:pt-0 flex flex-col items-center py-2 md:px-4">
              <div className="text-5xl font-light text-blue-700 mb-3">$1.2B</div>
              <p className="text-slate-700 text-center max-w-[250px] mx-auto">{t('landing.stat2Desc')}</p>
            </div>
            <div className="pt-6 md:pt-0 flex flex-col items-center py-2 md:px-4">
              <div className="text-5xl font-light text-blue-700 mb-3">{t('landing.days')}</div>
              <p className="text-slate-700 text-center max-w-[250px] mx-auto">{t('landing.stat3Desc')}</p>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="relative bg-slate-50 border border-slate-200 rounded-3xl p-10 md:p-16 overflow-hidden my-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -ml-20 -mb-20"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="text-7xl text-slate-300 mb-2 font-serif leading-none opacity-70">"</div>
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8 leading-snug">
              {t('landing.quoteMainPoint')}
            </h3>
            <blockquote className="text-slate-600 text-lg md:text-xl font-light leading-relaxed mb-10 italic">
              {t('landing.quoteText')}
            </blockquote>
            <div className="flex items-center justify-center gap-4 text-slate-500 text-sm font-semibold uppercase tracking-widest">
              <span className="w-12 h-px bg-slate-300"></span>
              <a href="https://www.traxtech.com/ai-in-supply-chain/why-ai-alone-cant-fix-supply-chain-problems" target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors duration-200">
                {t('landing.quoteSource')}
              </a>
              <span className="w-12 h-px bg-slate-300"></span>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section>
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-slate-800 tracking-tight">
            {t('landing.solutionTitle')}
          </h2>
          <p className="text-slate-700 leading-relaxed mb-10 text-lg">
            <span className="text-blue-700 font-semibold">{t('landing.solutionDesc1')}</span>{t('landing.solutionDesc2')}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
            {/* Scenario 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none"></div>
              <ShieldCheck className="w-10 h-10 text-blue-700 mb-6 relative z-10" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-5 relative z-10">{t('landing.scenario1Title')}</h3>
              <ul className="space-y-4 text-slate-600 relative z-10 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario1Bul1')}</strong>{t('landing.scenario1Bul1B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario1Bul2')}</strong>{t('landing.scenario1Bul2B')}<i>{t('landing.scenario1Bul2C')}</i>{t('landing.scenario1Bul2D')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario1Bul3')}</strong>{t('landing.scenario1Bul3B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario1Bul4')}</strong>{t('landing.scenario1Bul4B')}</span>
                </li>
              </ul>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none"></div>
              <LineChart className="w-10 h-10 text-blue-700 mb-6 relative z-10" />
              <h3 className="text-2xl font-semibold text-slate-900 mb-5 relative z-10">{t('landing.scenario2Title')}</h3>
              <ul className="space-y-4 text-slate-600 relative z-10 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario2Bul1')}</strong>{t('landing.scenario2Bul1B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario2Bul2')}</strong>{t('landing.scenario2Bul2B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario2Bul3')}</strong>{t('landing.scenario2Bul3B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario2Bul4')}</strong>{t('landing.scenario2Bul4B')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Ultimate Governability Banner */}
          <div className="mt-8 bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-md hover:shadow-lg transition-shadow cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="bg-white p-4 rounded-full shadow-sm border border-slate-200 shrink-0 relative z-10">
              <ShieldCheck className="w-8 h-8 text-blue-700" />
            </div>
            <div className="text-center md:text-left relative z-10">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('landing.govTitle')}</h3>
              <p className="text-slate-700 md:text-lg font-medium leading-relaxed">
                {t('landing.govDesc')}
              </p>
            </div>
          </div>

          <DataFlowDiagram />
        </section>

        {/* Can Procept Resolve This? / FAQ Section */}
        <section className="pt-8 border-t border-slate-200">
          <h2 className="text-3xl font-light mb-8 text-slate-900 flex items-center gap-3">
            <Target className="text-blue-700 w-8 h-8" />
            {t('landing.faqTitle')}
          </h2>

          <div className="space-y-6">

            {/* Flow 1 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-xl text-slate-900 flex gap-3 mb-4 leading-snug">
                <span className="text-blue-700 font-bold shrink-0">{t('landing.qA')}</span>
                <span>{t('landing.q1Title')}</span>
              </h3>
              <div className="flex gap-3 text-slate-700">
                <span className="text-blue-700 font-bold text-xl shrink-0">{t('landing.aA')}</span>
                <div>
                  <p className="mb-3"><strong>{t('landing.q1A1')}</strong>{t('landing.q1A1B')}<i>{t('landing.q1A1C')}</i>{t('landing.q1A1D')}</p>
                  <p className="text-sm bg-slate-50 inline-block px-3 py-1.5 rounded-md border border-slate-200"><strong>{t('landing.q1Result')}</strong>{t('landing.q1ResultB')}</p>
                </div>
              </div>
            </div>

            {/* Flow 2 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-xl text-slate-900 flex gap-3 mb-4 leading-snug">
                <span className="text-blue-700 font-bold shrink-0">{t('landing.qA')}</span>
                <span>{t('landing.q2Title')}</span>
              </h3>
              <div className="flex gap-3 text-slate-700">
                <span className="text-blue-700 font-bold text-xl shrink-0">{t('landing.aA')}</span>
                <div>
                  <p className="mb-3"><strong>{t('landing.q2A1')}</strong>{t('landing.q2A1B')}</p>
                  <p className="text-sm bg-slate-50 inline-block px-3 py-1.5 rounded-md border border-slate-200"><strong>{t('landing.q2Result')}</strong>{t('landing.q2ResultB')}</p>
                </div>
              </div>
            </div>

            {/* Flow 2.5 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-xl text-slate-900 flex gap-3 mb-4 leading-snug">
                <span className="text-blue-700 font-bold shrink-0">{t('landing.qA')}</span>
                <span>{t('landing.q3Title')}</span>
              </h3>
              <div className="flex gap-3 text-slate-700">
                <span className="text-blue-700 font-bold text-xl shrink-0">{t('landing.aA')}</span>
                <div>
                  <p className="mb-3"><strong>{t('landing.q3A1')}</strong>{t('landing.q3A1B')}</p>
                  <p className="text-sm bg-slate-50 inline-block px-3 py-1.5 rounded-md border border-slate-200"><strong>{t('landing.q3Result')}</strong>{t('landing.q3ResultB')}</p>
                </div>
              </div>
            </div>

            {/* Grid for remaining smaller flows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-colors">
                <h4 className="font-medium text-slate-900 mb-2 leading-tight">{t('landing.q4Title')}</h4>
                <p className="text-sm text-slate-600"><strong>{t('landing.q4A1')}</strong>{t('landing.q4A1B')}</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-colors">
                <h4 className="font-medium text-slate-900 mb-2 leading-tight">{t('landing.q5Title')}</h4>
                <p className="text-sm text-slate-600"><strong>{t('landing.q5A1')}</strong>{t('landing.q5A1B')}</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-colors">
                <h4 className="font-medium text-slate-900 mb-2 leading-tight">{t('landing.q6Title')}</h4>
                <p className="text-sm text-slate-600"><strong>{t('landing.q6A1')}</strong>{t('landing.q6A1B')}</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-colors">
                <h4 className="font-medium text-slate-900 mb-2 leading-tight">{t('landing.q7Title')}</h4>
                <p className="text-sm text-slate-600"><strong>{t('landing.q7A1')}</strong>{t('landing.q7A1B')}</p>
              </div>
            </div>

          </div>
        </section>

        <div className="text-center pt-8 pb-16">
          <button
            onClick={() => navigate('/demo')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-10 rounded-lg inline-flex items-center gap-2 transition-colors text-lg shadow-lg"
          >
            {t('landing.launchDashboard')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>
    </div>
  );
}
