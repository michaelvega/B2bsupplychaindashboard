import { useNavigate } from 'react-router';
import { ArrowRight, Bot, Target, Zap, Link } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      {/* Hero Section (Deep Blue, inspired by the screenshot) */}
      <section className="bg-slate-900 text-white pt-24 pb-20 px-8 relative overflow-hidden">
        {/* Subtle geometric or networking lines background decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.15), transparent 25%)' }}></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <Bot className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">Membrain AI</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight max-w-3xl">
            Membrain: The First Holistic AI-Powered Supply Chain Agent
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-10">
            Fix Broken Data. Automate Procure-to-Pay. Boost Bottom-Line Margin.
          </p>
          <button 
            onClick={() => navigate('/demo')} 
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-lg flex items-center gap-2 transition-colors text-lg"
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
            Problem: The Supply Chain is Broken, but Integrations Take Too Long to Deliver
          </h2>
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              For procurement and operations teams, every discrepancy across the ERP, email, and 3PL logistics or manufacturing partners is entirely manual. Someone has to catch these errors and manually perform saving actions to keep the business moving.
            </p>
            <p className="font-medium text-gray-900 mt-6 mb-2">The most common administrative bottlenecks draining your margins:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-disc pl-5">
              <li><strong>Manual Data Entry & Document Processing:</strong> Converting PDFs/faxes/emails into ERP entries.</li>
              <li><strong>Stale Master Data:</strong> Prices or lead times in the system don't match reality.</li>
              <li><strong>EDI Unit of Measure (UOM) Mismatch:</strong> The system "kills itself" because units don't align.</li>
              <li><strong>Reactive vs. Proactive Response:</strong> Issues only caught after the "happy path" fails.</li>
              <li><strong>3PL & ERP Synchronization:</strong> Changes in the ERP aren't reflected in the warehouse system.</li>
              <li><strong>Tariff Calculation & Reconciliation:</strong> Manual matching of tariff reports to POs and SKUs.</li>
              <li><strong>"Black Hole" Communications:</strong> Critical updates lost in email/Slack threads.</li>
              <li><strong>Vendor Qualification & Onboarding:</strong> Manual "packets" and vetting process is too slow.</li>
              <li><strong>Shipping Overages/Shortages/Damages:</strong> Lack of automated reporting or photos for claims.</li>
              <li><strong>Manual Price Updates/Mass Excel Uploads:</strong> High risk of error during bulk re-pricing.</li>
              <li><strong>Integration "Nightmares":</strong> Difficulty getting clean data in/out of NetSuite, SAP, or JDE.</li>
              <li><strong>Unpredictable SKU Volatility:</strong> Lack of automated flagging for stock-outs.</li>
            </ul>
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
          <p className="text-gray-700 leading-relaxed mb-6">
            <span className="text-blue-600 font-semibold">Membrain AI</span> uses specialized agents to proactively scan your ERP, email, and files to reconcile your most financially burdening problem spots. We automate manual SAP and document processing, and connect disparate data sources so you can pull together a dashboard with natural language, create instant demand forecasts, and automatically track vendor scorecards.
          </p>
        </section>

        {/* Winning Scenarios Section */}
        <section className="pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900 flex items-center gap-2">
            <Target className="text-blue-600 w-6 h-6" />
            The Membrain Winning Scenarios
          </h2>

          <div className="space-y-12">
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-gray-200 p-5">
                <h3 className="font-semibold text-lg text-gray-900 inline-flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Flow 1: The "Phantom Lead Time" Auto-Correction
                </h3>
              </div>
              <div className="p-5 space-y-4 text-gray-700">
                <p><strong>Scenario:</strong> A buyer places POs based on SAP Master Data stating a 30-day lead time. However, the agent's background analysis of the last 10 emails and receiving receipts shows the supplier is consistently delivering in 45 days. The system flags the stale data before the next MRP run generates bad purchasing schedules.</p>
                <p><strong>Why it Wins:</strong> Directly solves "Stale Master Data." Buyers hate when SAP tells them to order too late, causing expedited freight. This proves your agent learns from reality, not just static databases.</p>
                <div className="bg-gray-50 p-4 border rounded-lg text-sm">
                  <strong>KPIs:</strong> Expedited freight costs avoided • % of Master Data lead times synchronized • Stockouts prevented.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-gray-200 p-5">
                <h3 className="font-semibold text-lg text-gray-900 inline-flex items-center gap-2">
                  <Link className="w-5 h-5 text-indigo-500" />
                  Flow 2: 3PL Mirror and Hold-Release
                </h3>
              </div>
              <div className="p-5 space-y-4 text-gray-700">
                <p><strong>Scenario:</strong> A user changes a cut, cancel, address, or ship method in the ERP. The system checks whether the change is reflected in the WMS/3PL, holds fulfillment if not, routes a structured task to the warehouse contact, and releases once acknowledged.</p>
                <p><strong>Why it Wins:</strong> Solves the "our side / your side" problem and ties software to fewer wrong shipments. The gap between systems creates avoidable operational friction.</p>
                <div className="bg-gray-50 p-4 border rounded-lg text-sm">
                  <strong>KPIs:</strong> Wrong-ship/reship costs • ERP-to-warehouse lag • Mismatch rate between ERP and warehouse actions.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-gray-200 p-5">
                <h3 className="font-semibold text-lg text-gray-900 inline-flex items-center gap-2">
                   <Zap className="w-5 h-5 text-red-500" />
                  Flow 2.5: The "Shortage Claim" Auto-Builder
                </h3>
              </div>
              <div className="p-5 space-y-4 text-gray-700">
                <p><strong>Scenario:</strong> The warehouse logs a 50-unit shortage and snaps a photo. Usually, this creates a "Black Hole" email loop. The agent immediately intercepts the flag, cross-references the original PO, and drafts a complete credit claim packet.</p>
                <p><strong>Why it Wins:</strong> Companies bleed money here simply because assembling the proof to get a vendor credit takes too much manual administrative tracking time.</p>
                <div className="bg-gray-50 p-4 border rounded-lg text-sm">
                  <strong>KPIs:</strong> Vendor credit recovery rate ($) • Time to file discrepancy claim • Elimination of AP/Procurement email loops.
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Flow 3: "Lazy Supplier" Onboarding</h4>
                <p className="text-sm text-gray-600 mb-3">Vendor emails a messy mix of phone photos and inline text instead of a robust W-9. The agent intercepts, extracts the unstructured data, and stages the vendor creation perfectly in SAP.</p>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Solves: Manual Data Entry</span>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Flow 4: Rogue Invoice Price Catch</h4>
                <p className="text-sm text-gray-600 mb-3">An invoice arrives showing $12.50 vs the PO's $10.00. Left alone, it hits an AP blockage. The agent catches it instantly from the email and stages a structured dispute to the vendor.</p>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Solves: PPV Margin Leakage</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Flow 4.5: Tariff Shock Repricing</h4>
                <p className="text-sm text-gray-600 mb-3">A new tariff arrives from a freight forwarder. The system maps the change to affected POs and customer price books, calculating margin impacts and proposing price updates instantly.</p>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Solves: Margin Protection</span>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                <h4 className="font-semibold text-gray-900 mb-2">Flow 5: Sudden Stockout Alert</h4>
                <p className="text-sm text-gray-600 mb-3">Background calculation detects a burn-rate anomaly guaranteeing a stockout in 6 days. The agent generates an expedited Air Freight PO and notification emails for top buyers instantly.</p>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Solves: Unpredictable SKU Volatility</span>
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
