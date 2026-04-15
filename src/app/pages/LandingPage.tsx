import { useNavigate } from 'react-router';
import { ArrowRight, Bot, Target, Zap, Link, ShieldCheck, LineChart } from 'lucide-react';

const ProceptLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="43" cy="50" r="28" />
    <path d="M 4 50 L 96 50 M 78 36 L 96 50 L 78 64" />
  </svg>
);

export function LandingPage() {
  const navigate = useNavigate();

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
            Procept: The Hollistic Action Center for your AI-Powered Supply Chain
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mb-10 drop-shadow">
            Fix Broken Data. Automate Procure-to-Pay. Traceable at Every Single Step.
          </p>
          <button
            onClick={() => navigate('/demo')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-lg flex items-center gap-2 transition-colors text-lg shadow-xl shadow-blue-900/20"
          >
            Enter Interactive Demo
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-8 py-16 space-y-16">

        {/* Problem Section */}
        <section>
          <h2 className="text-3xl font-light mb-6 text-gray-800 tracking-tight">
            Problem: Your Procurement and Operations Teams are Reactive not Proactive
          </h2>
          <div className="text-gray-700 leading-relaxed text-lg">
            <p>
              For procurement and operations teams, every discrepancy across the ERP, email, and 3PL logistics or manufacturing partners is entirely manual. Someone has to catch these errors and manually perform saving actions to keep the business moving.
            </p>
            <p className="font-medium text-gray-900 mt-6 mb-4">The most common administrative bottlenecks draining your margins:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-base">

              {/* Column 1 */}
              <div>
                <h3 className="font-semibold text-red-600 mb-3 border-b border-gray-200 pb-2 tracking-wide uppercase text-sm">Immediate Term Issues</h3>
                <ul className="space-y-3 list-disc pl-5 text-gray-700">
                  <li><strong>"Black Hole" Communications:</strong> Critical updates lost in email wars involving 30 people.</li>
                  <li><strong>Shipping Claims:</strong> Lack of automated reporting or photos for overages, shortages, and damages.</li>
                  <li><strong>3PL & ERP Synchronization:</strong> Changes in the ERP aren't reflected in the warehouse system.</li>
                  <li><strong>Data Synchronization Errors:</strong> Converting unstructured documents to ERP entries and executing risky mass updates manually.</li>
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <h3 className="font-semibold text-red-600 mb-3 border-b border-gray-200 pb-2 tracking-wide uppercase text-sm">Long-Term Silent Killers</h3>
                <ul className="space-y-3 list-disc pl-5 text-gray-700">
                  <li><strong>Blind Demand Forecasting:</strong> Gathering the right data is so painful that many manufacturers simply give up and rely strictly on trailing sales figures.</li>
                  <li><strong>Vendor Qualification & Onboarding:</strong> Manual "packets" and vetting process is too slow.</li>
                  <li><strong>Tariff Calculation & Reconciliation:</strong> Manual matching of tariff reports to POs and SKUs.</li>
                  <li><strong>Integration "Nightmares":</strong> Difficulty getting clean data in/out of NetSuite, SAP, or JDE.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="bg-gray-50 p-10 rounded-2xl border border-gray-100">
          <p className="text-center text-gray-800 mb-10 max-w-3xl mx-auto">
            While most organizations realize they need to integrate and automate, they struggle finding the strategy and implementation that will actually deliver. Legacy EDI and expensive implementations often result in:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="pt-6 md:pt-0">
              <div className="text-5xl font-light text-blue-600 mb-3">60%</div>
              <p className="text-gray-700">of buyer time wasted on manual purchase order and invoice reconciliation.</p>
            </div>
            <div className="pt-6 md:pt-0">
              <div className="text-5xl font-light text-blue-600 mb-3">$1.2B</div>
              <p className="text-gray-700">average industry PPV margin leakage due to delayed master data pricing updates.</p>
            </div>
            <div className="pt-6 md:pt-0">
              <div className="text-5xl font-light text-blue-600 mb-3">28 Days</div>
              <p className="text-gray-700">lag time attempting to resolve "black hole" shipping damage and shortage claims.</p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section>
          <h2 className="text-3xl font-light mb-6 text-gray-800 tracking-tight">
            Our Solution: Autonomous Agents Curing Administrative Misery
          </h2>
          <p className="text-gray-700 leading-relaxed mb-10 text-lg">
            <span className="text-blue-600 font-semibold">Procept AI</span> deploys specialized, autonomous agents that continuously monitor your ERP, WMS, and unstructured communications to proactively identify and resolve your most expensive administrative bottlenecks. By bridging disconnected data silos into a central action command, we empower your team to approve complex workflow corrections with a single click, transforming reactive manual data wrangling into a unified, zero-error supply chain operation.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
            {/* Scenario 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none"></div>
              <ShieldCheck className="w-10 h-10 text-blue-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-5 relative z-10">1. The Autonomous Procurement Co-Pilot</h3>
              <ul className="space-y-4 text-gray-600 relative z-10 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span><strong>Universal Connectivity:</strong> Attaches directly to your ERPs, 3PL platforms, and unstructured email communications.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span><strong>Proactive Anomaly Detection:</strong> Continuously scans underlying operations data to catch discrepancies <i>before</i> they reach the warehouse floor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span><strong>Autonomous Correction:</strong> Isolates errors and proactively formats structured resolution tasks for single-click human approval.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span><strong>Data Zero Error:</strong> Systematically eliminates manual data entry waste, pricing fumbles, and reactive administrative friction.</span>
                </li>
              </ul>
            </div>

            {/* Scenario 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 z-0 pointer-events-none"></div>
              <LineChart className="w-10 h-10 text-indigo-600 mb-6 relative z-10" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-5 relative z-10">2. Instant Master Data Synthesis</h3>
              <ul className="space-y-4 text-gray-600 relative z-10 text-sm md:text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <span><strong>Zero-Error Foundations:</strong> Once automated agents scrub your operational data repositories, you achieve absolute cleanliness.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <span><strong>Out-of-the-Box Intelligence:</strong> Unlocks enterprise-tier capabilities without requiring an immense in-house AI and data engineering team.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <span><strong>Live Vendor Scorecarding:</strong> Replaces manual vetting and reporting with real-time, highly accurate supplier analytics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                  <span><strong>Predictive Demand Forecasting:</strong> Exposes SKU volatility and prevents stock-outs through deep forecasting rather than blind sales reliance.</span>
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
              <h3 className="text-xl font-bold text-amber-900 mb-2">Ultimate Governability and Traceability</h3>
              <p className="text-amber-800 md:text-lg font-medium leading-relaxed">
                Every action Procept takes must be approved by a team member and is rigorously confirmed with your own rules-based ERP change logs, immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Can Procept Resolve This? / FAQ Section */}
        <section className="pt-8 border-t border-gray-200">
          <h2 className="text-3xl font-light mb-8 text-gray-900 flex items-center gap-3">
            <Target className="text-blue-600 w-8 h-8" />
            Can Procept Really Resolve That?
          </h2>

          <div className="space-y-6">

            {/* Flow 1 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-xl text-gray-900 flex gap-3 mb-4 leading-snug">
                <span className="text-blue-600 font-bold shrink-0">Q:</span>
                <span>"Can Procept catch 'Phantom Lead Times' where SAP perfectly says 30 days, but the vendor actually takes 45 days in reality?"</span>
              </h3>
              <div className="flex gap-3 text-gray-700">
                <span className="text-indigo-600 font-bold text-xl shrink-0">A:</span>
                <div>
                  <p className="mb-3"><strong>Yes, it can.</strong> Procept conducts background analysis on your last 10 email threads and receiving receipts to mathematically prove the supplier is delivering in 45 days. It intervenes and flags the stale data <i>before</i> the next MRP run generates bad purchasing schedules.</p>
                  <p className="text-sm bg-gray-50 inline-block px-3 py-1.5 rounded-md border border-gray-100"><strong>Result:</strong> Buyers order on the correct timeline, avoiding massive expedited freight costs and preventing stockouts.</p>
                </div>
              </div>
            </div>

            {/* Flow 2 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-xl text-gray-900 flex gap-3 mb-4 leading-snug">
                <span className="text-blue-600 font-bold shrink-0">Q:</span>
                <span>"What if a user changes a shipping address or ship method in the ERP, but it never makes it to the 3PL's warehouse system?"</span>
              </h3>
              <div className="flex gap-3 text-gray-700">
                <span className="text-indigo-600 font-bold text-xl shrink-0">A:</span>
                <div>
                  <p className="mb-3"><strong>Yes, Procept catches it.</strong> It constantly cross-checks the ERP with your 3PL. If there's a mismatch on cuts, cancels, or addresses, it holds fulfillment immediately, routes a structured update task to the warehouse contact, and releases the hold only when they explicitly acknowledge the change.</p>
                  <p className="text-sm bg-gray-50 inline-block px-3 py-1.5 rounded-md border border-gray-100"><strong>Result:</strong> Zero wrong-ship/reship costs caused by the standard 'our side vs your side' data gap.</p>
                </div>
              </div>
            </div>

            {/* Flow 2.5 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <h3 className="font-medium text-xl text-gray-900 flex gap-3 mb-4 leading-snug">
                <span className="text-blue-600 font-bold shrink-0">Q:</span>
                <span>"Can it actually manage the chaos of Shortage Claims when the warehouse receives fewer units than ordered?"</span>
              </h3>
              <div className="flex gap-3 text-gray-700">
                <span className="text-indigo-600 font-bold text-xl shrink-0">A:</span>
                <div>
                  <p className="mb-3"><strong>Absolutely.</strong> Normally this triggers a 'black hole' email loop. Instead, the agent intercepts the warehouse's shortage log and photo, cross-references the original PO, and autonomously drafts a complete credit claim packet for AP—automatically blocking the vendor invoice.</p>
                  <p className="text-sm bg-gray-50 inline-block px-3 py-1.5 rounded-md border border-gray-100"><strong>Result:</strong> Drastically higher vendor credit recovery without bleeding AP/Procurement tracking time.</p>
                </div>
              </div>
            </div>

            {/* Grid for remaining smaller flows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2 leading-tight">Q: Can it handle "Lazy" Vendor Onboarding?</h4>
                <p className="text-sm text-gray-600"><strong>A: Yes.</strong> If a vendor emails a messy mix of phone photos and inline text, the agent extracts the unstructured data and stages the W-9 and banking details perfectly into your ERP master record.</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2 leading-tight">Q: Does it catch Rogue Invoice Pricing?</h4>
                <p className="text-sm text-gray-600"><strong>A: Yes.</strong> If an invoice arrives at $12.50 vs the PO's $10.00, Procept catches it from the email, blocks AP processing, and drafts a structured dispute to the vendor before you ever pay it.</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2 leading-tight">Q: What about Tariff Shock Repricing?</h4>
                <p className="text-sm text-gray-600"><strong>A: Yes.</strong> When new freight tariffs drop, the system maps the hike to affected POs and customer price books, calculating your margin impact and automatically proposing updates.</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2 leading-tight">Q: Can it predict Sudden SKU Stockouts?</h4>
                <p className="text-sm text-gray-600"><strong>A: Yes.</strong> Procept's background telemetry detects burn-rate anomalies, predicting a stockout ahead of time, and instantly generates an expedited Air Freight PO request.</p>
              </div>
            </div>

          </div>
        </section>

        <div className="text-center pt-8 pb-16">
          <button
            onClick={() => navigate('/demo')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-10 rounded-lg inline-flex items-center gap-2 transition-colors text-lg shadow-lg hover:shadow-xl"
          >
            Launch The Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>
    </div>
  );
}
