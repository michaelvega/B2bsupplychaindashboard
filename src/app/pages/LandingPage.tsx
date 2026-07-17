import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, ArrowDown, ShieldCheck, TrendingUp, BarChart3, Factory, Globe, Brain, Cpu, Zap, Leaf, ExternalLink } from 'lucide-react';

const IMG_WAREHOUSE = 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1800&auto=format&fit=crop&q=85';
const IMG_FACTORY = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=85';
const IMG_TECH = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=85';
const IMG_LOGISTICS = 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&auto=format&fit=crop&q=85';

const HERO_VIDEOS = [
  '/cargoships.mov',
  '/city%20video.mov',
  '/hero-factory.mp4',
];

export function LandingPage() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [fadeVideo, setFadeVideo] = useState(false);
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
    const timer = setTimeout(advance, 15000); // fallback: auto-advance after 15s
    return () => {
      video.removeEventListener('ended', advance);
      clearTimeout(timer);
    };
  }, [videoIndex]);

  // Play the video when index changes (after fade transition)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || fadeVideo) return;
    video.load();
    video.play().catch(() => {});
  }, [videoIndex, fadeVideo]);

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-black" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          key={HERO_VIDEOS[videoIndex]}
          autoPlay muted playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: fadeVideo ? 0 : 1, backgroundColor: 'black' }}
        >
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
            <div className="max-w-2xl">
              <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06] mb-8 transition-all duration-1000 delay-200', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-white/50 tracking-[0.15em] uppercase">Autonomous Supply Chain Intelligence</span>
              </div>
              <h1 className={cn('text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.08] mb-6 transition-all duration-1000 delay-300 max-w-3xl', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
                Automating supply chains that predict the future<br />
                <span className="font-normal text-white/90">instead of reacting to the past.</span>
              </h1>
              <p className={cn('text-white/60 text-base sm:text-lg leading-relaxed mb-8 transition-all duration-1000 delay-500 max-w-xl', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')} style={{ fontWeight: 450 }}>
                AI agents that never sleep. Automatically predict demand, catch discrepancies, and secure inventory before disruptions hit.
              </p>
              <div className={cn('flex items-center gap-4 transition-all duration-1000 delay-700', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
                <button onClick={() => navigate('/daily-brief')} className="group flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-medium hover:bg-white/90 transition-all">
                  Open Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <a href="https://calendly.com/sscarozzi/30min" target="_blank" rel="noreferrer" className="text-white/40 text-sm font-light hover:text-white/70 transition-colors">
                  Talk to founders →
                </a>
              </div>
            </div>
          </div>

          <div className={cn('flex justify-center transition-all duration-1000 delay-900', loaded ? 'opacity-100' : 'opacity-0')}>
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
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight max-w-2xl">
              By 2027, companies that<br />
              <span className="font-normal">don't adopt AI supply chain</span> will lose 30% of competitive advantage.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { value: '60%', label: 'of procurement errors go undetected for 48+ hours in legacy ERPs' },
              { value: '$4.8M', label: 'average annual margin leakage from stale master pricing data' },
              { value: '14 Days', label: 'average time to detect and resolve a supplier fulfillment mismatch' },
              { value: '83%', label: 'of supply chain leaders say AI is critical to their 2027 roadmap' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-6">
                <div className="text-3xl font-normal text-white mb-2 tracking-tight">{stat.value}</div>
                <p className="text-sm text-white/30 leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES WITH IMAGES ═══════════════ */}
      <section className="relative bg-[#fafaf8] py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <p className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-4">The Platform</p>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 tracking-tight leading-tight max-w-2xl">
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
                Autonomous agents detect and resolve purchase order discrepancies, fulfillment mismatches, and pricing errors within minutes — not days. Your team stops firefighting and starts managing.
              </p>
              <div className="space-y-3 text-sm text-stone-400">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Real-time PO-to-invoice reconciliation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Automated vendor discrepancy detection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>70% reduction in manual order errors</span>
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
                AI-driven inventory allocation across your warehouse network. Dynamic reorder points. Safety stock that adjusts to real-time conditions — not last quarter's averages.
              </p>
              <div className="space-y-3 text-sm text-stone-400">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Multi-warehouse inventory balancing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Dynamic reorder point optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>20-30% reduction in excess inventory</span>
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
                Machine learning models trained on weather patterns, macro indicators, and real-time sales data. Predict demand surges before they happen — stop forecasting with last year's weather.
              </p>
              <div className="space-y-3 text-sm text-stone-400">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Real-time weather-driven demand modeling</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>Long-tail parts and SKU forecasting</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-stone-400" />
                  <span>15-20% improvement in forecast accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS — Dark ═══════════════ */}
      <section className="relative bg-[#0f0f0f] py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="overflow-hidden">
              <img src={IMG_LOGISTICS} alt="Logistics" className="w-full aspect-[4/3] object-cover opacity-80 hover:opacity-100 transition-all duration-700" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">How It Works</p>
              <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight mb-8">
                Your ERP has the data.<br />
                <span className="font-normal">We surface the intelligence.</span>
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <Cpu className="w-4 h-4 text-white/50" />,
                    title: 'Multi-Spoke Architecture',
                    desc: 'Weather models, freight indices, raw material futures, supplier performance — each gets its own lane. They all feed into a unified forecast that tells you what\'s actually going to happen. And unlike black-box tools, you can see exactly why it made the call.',
                  },
                  {
                    icon: <Zap className="w-4 h-4 text-white/50" />,
                    title: 'Autonomous Agents, Always Running',
                    desc: 'Agents continuously scan your purchase orders, invoices, inventory levels, and supplier communications. They surface risks and opportunities without anyone clicking a button. Resolution happens while your team sleeps.',
                  },
                  {
                    icon: <Leaf className="w-4 h-4 text-white/50" />,
                    title: 'Built to Eliminate Waste',
                    desc: 'Supply chains over-order by 15-25% as buffer against uncertainty. That\'s not a logistics problem — it\'s a forecasting problem. Better predictions mean less dead stock, fewer emergency shipments, less working capital trapped in warehouses.',
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

      {/* ═══════════════ USE CASES ═══════════════ */}
      <section className="relative bg-black py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">Use Cases</p>
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-tight max-w-2xl">
              Built for specialty<br />
              <span className="font-normal">wholesale distribution.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: <Globe className="w-4 h-4 text-white/60" />,
                title: 'Weather-Driven Demand Shocks',
                desc: 'Stop forecasting with last year\'s weather. Dynamic agent ingests real-time regional weather models to automatically adjust inventory allocation. A Kentucky ice storm triggers chainsaw stock rebalancing before the first dealer call.',
              },
              {
                icon: <BarChart3 className="w-4 h-4 text-white/60" />,
                title: 'Long-Tail Parts Forecasting',
                desc: 'Millions in working capital trapped in obsolete replacement parts. Our digital inventory analyst recalculates the exact mix of whole-goods versus parts based on the active lifespan of equipment in your territory.',
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-white/60" />,
                title: 'Supplier Risk Intelligence',
                desc: 'Continuous monitoring of supplier compliance and on-time performance. Automatic flagging of vendors approaching risk thresholds — before a missed delivery cascades into a production stoppage.',
              },
              {
                icon: <Factory className="w-4 h-4 text-white/60" />,
                title: 'Dealer Network Visibility',
                desc: 'See demand signals across your entire multi-state dealer network. When 50 independent hardware stores start ordering the same SKU, your central warehouse knows before the stockout.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-8 group hover:bg-white/[0.05] transition-all">
                <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-5 group-hover:bg-white/[0.1] transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-medium text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
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
            Georgia Tech computer scientists who studied supply chain at Scheller. We built Procept because the gap between having data and making decisions shouldn't require a PhD — or three weeks in Excel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/[0.03] border border-white/[0.06] p-8">
              <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-lg font-light text-white/30 mb-5">SC</div>
              <h3 className="text-lg font-medium text-white mb-1">Sam Carozzi</h3>
              <p className="text-xs text-white/40 mb-1">Co-Founder</p>
              <p className="text-xs text-white/30 mb-4">Data Science · Georgia Tech</p>
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                Data scientist with forecasting experience in hospitality and insurance. MS Computer Science candidate at Georgia Tech. Supply chain capstone research focused on autonomous procurement workflows and ERP data integration. Believes AI should make operations people more powerful, not replace them.
              </p>
              <a href="https://www.linkedin.com/in/samantha-carozzi-904976245/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] p-8">
              <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center text-lg font-light text-white/30 mb-5">MV</div>
              <h3 className="text-lg font-medium text-white mb-1">Michael Vega</h3>
              <p className="text-xs text-white/40 mb-1">Co-Founder</p>
              <p className="text-xs text-white/30 mb-4">Machine Learning · Georgia Tech</p>
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                ML specialist with applied forecasting experience at an investment research firm, building predictive models for Pinterest. MS Computer Science candidate at Georgia Tech. Supply chain capstone with focus on demand sensing and inventory optimization. Writes philosophy on the side.
              </p>
              <a href="https://www.linkedin.com/in/vegamichael1/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="text-center max-w-xl mx-auto mb-20">
            <p className="text-sm text-white/30 leading-relaxed">
              Procept exists because good forecasting shouldn't cost six figures or require a data engineering team. Better predictions. Less waste. Tools that let operations people actually operate — instead of fighting their ERP for three weeks every quarter.
            </p>
          </div>

          <div className="text-center">
            <button onClick={() => navigate('/daily-brief')} className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-black text-sm font-medium hover:bg-white/90 transition-all">
              Launch Interactive Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
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
            Equipping supply chain professionals with the hidden knowledge inside their company.
          </p>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
