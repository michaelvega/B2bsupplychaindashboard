import { useNavigate } from 'react-router';
import { ArrowRight, Bot, Target, Zap, Link, ShieldCheck, LineChart } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const ProceptLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="43" cy="50" r="28" />
    <path d="M 4 50 L 96 50 M 78 36 L 96 50 L 78 64" />
  </svg>
);

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
            <span className="text-2xl font-bold tracking-tight text-white">Procept AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight max-w-4xl text-white drop-shadow-md">
            {t('landing.title')}
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mb-10 drop-shadow">
            {t('landing.subtitle')}
          </p>
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
          <h2 className="text-3xl font-light mb-6 text-gray-800 tracking-tight">
            {t('landing.problemTitle')}
          </h2>
          <div className="text-gray-700 leading-relaxed text-lg">
            <p>
              {t('landing.problemDesc1')}
            </p>
            <p className="font-medium text-gray-900 mt-6 mb-4">{t('landing.problemDesc2')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-base">

              {/* Column 1 */}
              <div>
                <h3 className="font-semibold text-red-600 mb-3 border-b border-gray-200 pb-2 tracking-wide uppercase text-sm">{t('landing.immediateTermsTitle')}</h3>
                <ul className="space-y-3 list-disc pl-5 text-gray-700">
                  <li><strong>{t('landing.immediateIssue1Label')}</strong> {t('landing.immediateIssue1')}</li>
                  <li><strong>{t('landing.immediateIssue2Label')}</strong> {t('landing.immediateIssue2')}</li>
                  <li><strong>{t('landing.immediateIssue3Label')}</strong> {t('landing.immediateIssue3')}</li>
                  <li><strong>{t('landing.immediateIssue4Label')}</strong> {t('landing.immediateIssue4')}</li>
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <h3 className="font-semibold text-red-600 mb-3 border-b border-gray-200 pb-2 tracking-wide uppercase text-sm">{t('landing.longTermTitle')}</h3>
                <ul className="space-y-3 list-disc pl-5 text-gray-700">
                  <li><strong>{t('landing.longTermIssue1Label')}</strong> {t('landing.longTermIssue1')}</li>
                  <li><strong>{t('landing.longTermIssue2Label')}</strong> {t('landing.longTermIssue2')}</li>
                  <li><strong>{t('landing.longTermIssue3Label')}</strong> {t('landing.longTermIssue3')}</li>
                  <li><strong>{t('landing.longTermIssue4Label')}</strong> {t('landing.longTermIssue4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-gray-50 p-10 rounded-2xl border border-gray-100">
          <p className="text-center text-gray-800 mb-10 max-w-3xl mx-auto">
            {t('landing.statsIntro')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="pt-6 md:pt-0">
              <div className="text-5xl font-light text-blue-600 mb-3">60%</div>
              <p className="text-gray-700">{t('landing.stat1Desc')}</p>
            </div>
            <div className="pt-6 md:pt-0">
              <div className="text-5xl font-light text-blue-600 mb-3">$1.2B</div>
              <p className="text-gray-700">{t('landing.stat2Desc')}</p>
            </div>
            <div className="pt-6 md:pt-0">
              <div className="text-5xl font-light text-blue-600 mb-3">{t('landing.days')}</div>
              <p className="text-gray-700">{t('landing.stat3Desc')}</p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section>
          <h2 className="text-3xl font-light mb-6 text-gray-800 tracking-tight">
            {t('landing.solutionTitle')}
          </h2>
          <p className="text-gray-700 leading-relaxed mb-10 text-lg">
            <span className="text-blue-600 font-semibold">{t('landing.solutionDesc1')}</span>{t('landing.solutionDesc2')}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
            {/* Scenario 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none"></div>
              <ShieldCheck className="w-10 h-10 text-blue-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-5 relative z-10">{t('landing.scenario1Title')}</h3>
              <ul className="space-y-4 text-gray-600 relative z-10 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario1Bul1')}</strong>{t('landing.scenario1Bul1B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario1Bul2')}</strong>{t('landing.scenario1Bul2B')}<i>{t('landing.scenario1Bul2C')}</i>{t('landing.scenario1Bul2D')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario1Bul3')}</strong>{t('landing.scenario1Bul3B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario1Bul4')}</strong>{t('landing.scenario1Bul4B')}</span>
                </li>
              </ul>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none"></div>
              <LineChart className="w-10 h-10 text-indigo-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-5 relative z-10">{t('landing.scenario2Title')}</h3>
              <ul className="space-y-4 text-gray-600 relative z-10 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario2Bul1')}</strong>{t('landing.scenario2Bul1B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario2Bul2')}</strong>{t('landing.scenario2Bul2B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario2Bul3')}</strong>{t('landing.scenario2Bul3B')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <span><strong>{t('landing.scenario2Bul4')}</strong>{t('landing.scenario2Bul4B')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Ultimate Governability Banner */}
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_25px_rgba(251,191,36,0.25)] hover:shadow-[0_0_35px_rgba(251,191,36,0.35)] transition-shadow cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="bg-white p-4 rounded-full shadow-sm border border-amber-200 shrink-0 relative z-10">
              <ShieldCheck className="w-8 h-8 text-amber-500" />
            </div>
            <div className="text-center md:text-left relative z-10">
              <h3 className="text-xl font-bold text-amber-900 mb-2">{t('landing.govTitle')}</h3>
              <p className="text-amber-800 md:text-lg font-medium leading-relaxed">
                {t('landing.govDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* Can Procept Resolve This? / FAQ Section */}
        <section className="pt-8 border-t border-gray-200">
          <h2 className="text-3xl font-light mb-8 text-gray-900 flex items-center gap-3">
            <Target className="text-blue-600 w-8 h-8" />
            {t('landing.faqTitle')}
          </h2>

          <div className="space-y-6">

            {/* Flow 1 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-xl text-gray-900 flex gap-3 mb-4 leading-snug">
                <span className="text-blue-600 font-bold shrink-0">{t('landing.qA')}</span>
                <span>{t('landing.q1Title')}</span>
              </h3>
              <div className="flex gap-3 text-gray-700">
                <span className="text-indigo-600 font-bold text-xl shrink-0">{t('landing.aA')}</span>
                <div>
                  <p className="mb-3"><strong>{t('landing.q1A1')}</strong>{t('landing.q1A1B')}<i>{t('landing.q1A1C')}</i>{t('landing.q1A1D')}</p>
                  <p className="text-sm bg-gray-50 inline-block px-3 py-1.5 rounded-md border border-gray-100"><strong>{t('landing.q1Result')}</strong>{t('landing.q1ResultB')}</p>
                </div>
              </div>
            </div>

            {/* Flow 2 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-xl text-gray-900 flex gap-3 mb-4 leading-snug">
                <span className="text-blue-600 font-bold shrink-0">{t('landing.qA')}</span>
                <span>{t('landing.q2Title')}</span>
              </h3>
              <div className="flex gap-3 text-gray-700">
                <span className="text-indigo-600 font-bold text-xl shrink-0">{t('landing.aA')}</span>
                <div>
                  <p className="mb-3"><strong>{t('landing.q2A1')}</strong>{t('landing.q2A1B')}</p>
                  <p className="text-sm bg-gray-50 inline-block px-3 py-1.5 rounded-md border border-gray-100"><strong>{t('landing.q2Result')}</strong>{t('landing.q2ResultB')}</p>
                </div>
              </div>
            </div>

            {/* Flow 2.5 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-xl text-gray-900 flex gap-3 mb-4 leading-snug">
                <span className="text-blue-600 font-bold shrink-0">{t('landing.qA')}</span>
                <span>{t('landing.q3Title')}</span>
              </h3>
              <div className="flex gap-3 text-gray-700">
                <span className="text-indigo-600 font-bold text-xl shrink-0">{t('landing.aA')}</span>
                <div>
                  <p className="mb-3"><strong>{t('landing.q3A1')}</strong>{t('landing.q3A1B')}</p>
                  <p className="text-sm bg-gray-50 inline-block px-3 py-1.5 rounded-md border border-gray-100"><strong>{t('landing.q3Result')}</strong>{t('landing.q3ResultB')}</p>
                </div>
              </div>
            </div>

            {/* Grid for remaining smaller flows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2 leading-tight">{t('landing.q4Title')}</h4>
                <p className="text-sm text-gray-600"><strong>{t('landing.q4A1')}</strong>{t('landing.q4A1B')}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2 leading-tight">{t('landing.q5Title')}</h4>
                <p className="text-sm text-gray-600"><strong>{t('landing.q5A1')}</strong>{t('landing.q5A1B')}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2 leading-tight">{t('landing.q6Title')}</h4>
                <p className="text-sm text-gray-600"><strong>{t('landing.q6A1')}</strong>{t('landing.q6A1B')}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2 leading-tight">{t('landing.q7Title')}</h4>
                <p className="text-sm text-gray-600"><strong>{t('landing.q7A1')}</strong>{t('landing.q7A1B')}</p>
              </div>
            </div>

          </div>
        </section>

        <div className="text-center pt-8 pb-16">
          <button
            onClick={() => navigate('/demo')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-10 rounded-lg inline-flex items-center gap-2 transition-colors text-lg shadow-lg hover:shadow-xl"
          >
            {t('landing.launchDashboard')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>
    </div>
  );
}
