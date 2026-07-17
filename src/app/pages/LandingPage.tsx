import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, ArrowDown, ShieldCheck, TrendingUp, BarChart3, Factory, Globe, Brain, Cpu, Zap, Leaf, ExternalLink, X, Mail, User, Building2, Check } from 'lucide-react';

const IMG_WAREHOUSE = 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1800&auto=format&fit=crop&q=85';
const IMG_FACTORY = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=85';
const IMG_TECH = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=85';
const IMG_LOGISTICS = 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&auto=format&fit=crop&q=85';

const HERO_VIDEOS = [
  '/city%20video.mov',
  '/cargoships.mov',
  '/night%20cargo.mov',
  '/truck%20video.mov',
  '/hero-factory.mp4',
];

function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) { setName(''); setEmail(''); setBusiness(''); setSubmitted(false); }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSending(true);

    // Store lead via Azure API
    try {
      const res = await fetch('/api/azure/demo-leads.json');
      const existing = res.ok ? await res.json().catch(() => []) : [];
      existing.push({ name: name.trim(), email: email.trim(), business: business.trim(), timestamp: new Date().toISOString() });
      await fetch('/api/azure/demo-leads.json', { method: 'PUT', body: JSON.stringify(existing, null, 2) });
    } catch (_) { /* silently continue */ }

    // Open email client as reliable delivery
    const subject = encodeURIComponent('Procept Demo Request');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBusiness: ${business || 'N/A'}\n\nRequested demo access.`);
    window.open(`mailto:sscarozzi@gmail.com?subject=${subject}&body=${body}`, '_blank');

    setSending(false);
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-[#141414] border border-white/[0.08] rounded-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">Request Demo Access</h3>
            <p className="text-xs text-white/30 mt-0.5">We'll get back to you within 24 hours.</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/30 hover:text-white/60 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-5">
              <Check className="w-6 h-6 text-white/60" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Thank you.</h3>
            <p className="text-sm text-white/30 leading-relaxed">Your demo request has been sent. Check your email for a confirmation. We'll be in touch shortly.</p>
            <button onClick={onClose} className="mt-6 text-sm text-white/40 hover:text-white/70 transition-colors">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5 font-medium">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5 font-medium">Business</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" value={business} onChange={e => setBusiness(e.target.value)} placeholder="Your company" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors" />
              </div>
            </div>
            <button type="submit" disabled={sending || !name.trim() || !email.trim()} className="w-full bg-white text-black font-medium py-3 rounded-lg text-sm hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {sending ? 'Sending...' : 'Send Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [fadeVideo, setFadeVideo] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { setLoaded(true); }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const advance = () => {
      setFadeVideo(true);
      setTimeout(() => {
        setVideoIndex(prev => (prev + 1) % HERO_VIDEOS.length);
        setFadeVideo(false);
      }, 700);
    };
    video.addEventListener('ended', advance);
    const timer = setTimeout(advance, 15000);
    return () => {
      video.removeEventListener('ended', advance);
      clearTimeout(timer);
    };
  }, [videoIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || fadeVideo) return;
    video.load();
    video.play().catch(() => {});
  }, [videoIndex, fadeVideo]);

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-black" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative h-screen w-full overflow-hidden">
        <video ref={videoRef} key={HERO_VIDEOS[videoIndex]} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" style={{ opacity: fadeVideo ? 0 : 1, backgroundColor: 'black' }}>
          <source src={HERO_VIDEOS[videoIndex]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        <div className="absolute inset-0 flex flex-col justify-between p-10 md:p-16">
          <div className={cn('transition-all duration-1000', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
            <div className="flex items-center gap-3">
              <img src="/procept-logo-light.jpg" alt="Procept" className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/20" />
              <span className="text-white/70 text-xs tracking-[0.25em] uppercase font-medium">Procept</span>
            </div>
          </div>

          <div className="flex-1 flex items-center">
            <div className="max-w-3xl">
              <h1 className={cn('text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.1] mb-6 transition-all duration-1000 delay-200', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
                Autonomous AI that never sleeps,<br />
                <span className="font-normal text-white/90">for a supply chain that never stops moving.</span>
              </h1>
              <p className={cn('text-white/60 text-base sm:text-lg leading-relaxed mb-8 transition-all duration-1000 delay-400 max-w-xl', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')} style={{ fontWeight: 500 }}>
                Automatically predict demand, catch discrepancies, and secure inventory before disruptions hit.
              </p>
              <div className={cn('flex items-center gap-4 transition-all duration-1000 delay-600', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
                <button onClick={() => setDemoOpen(true)} className="group flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-medium hover:bg-white/90 transition-all">
                  Request Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="https://calendly.com/sscarozzi/30min" target="_blank" rel="noreferrer" className="text-white/40 text-sm font-light hover:text-white/70 transition-colors">
                  Talk to founders →
                </a>
              </div>
            </div>
          </div>

          <div className={cn('flex justify-center transition-all duration-1000 delay-800', loaded ? 'opacity-100' : 'opacity-0')}>
            <div className="flex flex-col items-center gap-2 text-white/20">
              <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="relative bg-black py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">The Cost of Standing Still</p>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight max-w-2xl">
              By 2027, <span className="font-normal">25% of supply chain decisions</span> will be made by intelligent edge ecosystems, leaving legacy operators behind.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { value: '25%', label: 'of supply chain decisions will be made by intelligent edge ecosystems by 2027, per Gartner.' },
              { value: '48+ Hours', label: 'Delivery disruptions and quality failures routinely sit for over 48 hours before triggering supplier escalations in legacy systems.' },
              { value: '11%', label: 'Average loss of contract value due to margin leakage and poor price realization across the lifecycle.' },
              { value: '56%', label: 'of Chief Supply Chain Officers cite integrating AI with legacy systems as their major operational roadblock.' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-6">
                <div className="text-3xl font-normal text-white mb-2 tracking-tight">{stat.value}</div>
                <p className="text-sm text-white/30 leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="relative bg-[#fafaf8] py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-4">The Platform</p>
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 tracking-tight leading-tight max-w-2xl">
              Every supply chain workflow,<br />
              <span className="font-normal">autonomous.</span>
            </h2>
          </div>

          {/* Procurement Errors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
            <div className="relative overflow-hidden aspect-[4/3] bg-stone-100 order-2 lg:order-1">
              <img src={IMG_WAREHOUSE} alt="Warehouse" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center order-1 lg:order-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-6 text-stone-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-medium text-stone-900 mb-4">Procurement Error Resolution</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-6 max-w-md">
                Autonomous agents ingest unstructured supplier documents, cross-reference them against budgets, and flag procurement errors before purchase orders are issued. Your team stops firefighting data entry and starts managing suppliers.
              </p>
              <div className="space-y-3 text-sm text-stone-400">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Disruption resolution in minutes, not days</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Automated PO-to-invoice reconciliation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Proactive detection of unstructured data errors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Supply Planning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
            <div className="flex flex-col justify-center">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-6 text-stone-500">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-medium text-stone-900 mb-4">Supply Planning & Orchestration</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-6 max-w-md">
                AI-driven inventory allocation across your network. Dynamic reorder points. Safety stock that adjusts to real-time conditions, not last quarter's averages.
              </p>
              <div className="space-y-3 text-sm text-stone-400">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Multi-warehouse inventory balancing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>30–40% fewer stockouts and inventory imbalances</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>15–20% reduction in total logistics costs</span>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden aspect-[4/3] bg-stone-100">
              <img src={IMG_FACTORY} alt="Factory" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* ML Forecasting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative overflow-hidden aspect-[4/3] bg-stone-100 order-2 lg:order-1">
              <img src={IMG_TECH} alt="Technology" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center order-1 lg:order-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mb-6 text-stone-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-medium text-stone-900 mb-4">Demand Forecasting with ML</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-6 max-w-md">
                Machine learning models trained on weather patterns, macro indicators, and real-time sales data. Predict demand surges before they happen. Stop forecasting with last year's weather.
              </p>
              <div className="space-y-3 text-sm text-stone-400">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Real-time weather-driven demand modeling</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Long-tail SKU forecasting</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Dynamic, constraint-based margin optimization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="relative bg-[#0f0f0f] py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="overflow-hidden">
              <img src={IMG_LOGISTICS} alt="Logistics" className="w-full aspect-[4/3] object-cover opacity-80 hover:opacity-100 transition-all duration-700" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight mb-8">
                Your ERP has the data.<br />
                <span className="font-normal">We surface the intelligence.</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <Cpu className="w-4 h-4 text-white/50" />,
                    title: 'Multi-Spoke Architecture',
                    desc: 'Weather models, freight indices, raw material futures, supplier performance. Each gets its own lane. They all feed into a unified forecast that tells you what\'s actually going to happen. And unlike black-box tools, you can see exactly why it made the call.',
                  },
                  {
                    icon: <Zap className="w-4 h-4 text-white/50" />,
                    title: 'Autonomous Agents, Always Running',
                    desc: 'Agents continuously scan your purchase orders, unstructured supplier PDFs, invoices, and inventory levels. They surface risks and extract critical specs without anyone clicking a button. Resolution happens while your team sleeps.',
                  },
                  {
                    icon: <Leaf className="w-4 h-4 text-white/50" />,
                    title: 'Built to Eliminate Waste',
                    desc: 'Supply chains over-order as a buffer against uncertainty. That\'s not a logistics problem ,  it\'s a forecasting and data extraction problem. Better predictions and cleaner procurement data mean less dead stock, fewer emergency shipments, and less working capital trapped in warehouses.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="text-sm font-medium text-white/80 mb-1">{item.title}</h3>
                      <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ INDUSTRIES ═══════════════ */}
      <section className="relative bg-black py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">Industries</p>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight max-w-2xl">
              Purpose-built for<br />
              <span className="font-normal">the industrial economy.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
            {[
              { num: '01', label: 'Food & Beverage', desc: 'Perishable inventory, cold chain logistics, and volatile commodity pricing demand real-time forecasting and supplier orchestration.' },
              { num: '02', label: 'Distribution', desc: 'Multi-warehouse networks, dealer fulfillment, and long-tail SKU management across thousands of independent retail endpoints.' },
              { num: '03', label: 'Chemicals', desc: 'Hazmat compliance, batch traceability, and complex supplier qualification workflows that legacy ERPs can\'t automate.' },
              { num: '04', label: 'Robotics', desc: 'Precision component sourcing, engineer-to-order workflows, and bill-of-materials validation at scale.' },
              { num: '05', label: 'Industrials', desc: 'Heavy equipment distribution, service parts logistics, and weather-driven demand across multi-state territories.' },
            ].map((industry, i) => (
              <div key={i} className="group py-6 border-b border-white/[0.04] last:border-b-0 flex items-start gap-6">
                <span className="text-xs text-white/15 font-mono mt-1 tabular-nums">{industry.num}</span>
                <div>
                  <h3 className="text-base font-medium text-white mb-1.5 group-hover:text-white/80 transition-colors">{industry.label}</h3>
                  <p className="text-sm text-white/25 leading-relaxed max-w-md">{industry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section className="relative bg-black py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4 text-center">Who We Are</p>
          <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight mb-4 text-center">
            Built by supply chain engineers,<br />
            <span className="font-normal">for supply chain operators.</span>
          </h2>
          <p className="text-sm text-white/30 leading-relaxed text-center max-w-xl mx-auto mb-16">
            We built Procept because the gap between having data and making decisions shouldn't require a PhD or three weeks in Excel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/[0.03] border border-white/[0.06] p-8">
              <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-lg font-light text-white/30 mb-5">SC</div>
              <h3 className="text-lg font-medium text-white mb-1">Sam Carozzi</h3>
              <p className="text-xs text-white/40 mb-1">Co-Founder</p>
              <p className="text-xs text-white/30 mb-4">Data Science · Jefferies IB</p>
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                Data scientist at Jefferies Investment Banking. MS Computer Science candidate at Georgia Tech. Supply chain capstone research focused on autonomous procurement workflows and ERP data integration. Believes AI should make operations people more powerful, not replace them.
              </p>
              <a href="https://www.linkedin.com/in/samantha-carozzi-904976245/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] p-8">
              <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-lg font-light text-white/30 mb-5">MV</div>
              <h3 className="text-lg font-medium text-white mb-1">Michael Vega</h3>
              <p className="text-xs text-white/40 mb-1">Co-Founder</p>
              <p className="text-xs text-white/30 mb-4">Data Science / ML · Pinterest</p>
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                ML infrastructure and data science at Pinterest. MS Computer Science candidate at Georgia Tech. Supply chain capstone with focus on demand sensing and inventory optimization. The jump from "what someone wants to see next" to "what someone needs to ship next" is shorter than you'd think.
              </p>
              <a href="https://www.linkedin.com/in/vegamichael1/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="text-center max-w-xl mx-auto">
            <p className="text-sm text-white/30 leading-relaxed">
              Procept exists because good forecasting shouldn't cost six figures or require a data engineering team. Better predictions. Less waste. Tools that let operations people actually operate, instead of fighting their ERP for three weeks every quarter.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-black border-t border-white/[0.06] py-8 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-6 h-6 rounded-md opacity-50" />
            <span className="text-xs text-white/20">Procept © 2026</span>
          </div>
          <p className="text-xs text-white/15">
            Automating supply chains that predict the future instead of reacting to the past.
          </p>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
