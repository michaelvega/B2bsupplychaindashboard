import { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, Check, X, Mail, User, Building2, Gauge } from 'lucide-react';

const HERO_VIDEO = '/city%20video.mp4';

const IMG_TRAIN = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&auto=format&fit=crop&q=85';
const IMG_ROI = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=85';

const STATS = [
  { value: '96%', label: 'cheaper than public API providers.' },
  { value: '95%', label: 'our ARC-AGI 3 score. We are 65% better than Claude, which scored 30%.' },
  { value: '10x', label: 'smaller and still more intelligent.' },
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
    const subject = encodeURIComponent('Aegis Demo Request');
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

const DEFAULT_ASSISTANT = `Here's how Aegis could be used in your business:

• We broker dedicated GPUs and self-host Aegis in your stack, so your agents loop, debate, and verify without an uncapped token meter.
• We train a hyper-capable, 10x smaller model on your workflows, so it learns how your business actually works.
• We measure evaluations, business outcomes, and ROI against your current providers.

Tell me what your business does and I'll get specific.`;

function chatbotReply(userText: string) {
  const t = userText.trim();
  return `Got it. ${t}

Here's what that looks like with Aegis:

• Own the compute: we broker GPUs behind the scenes and self-host, so you scale users, not API bills.
• A model that learns you: it self-improves on your actual workflows, not a generic benchmark.
• Measured in ROI: we track evaluations, business outcomes, and customer impact, and report savings against your current providers.

Want me to dig into any of these?`;
}

function ChatbotHero() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: DEFAULT_ASSISTANT },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;
    setMessages(m => [...m, { role: 'user', content: text }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', content: chatbotReply(text) }]);
      setThinking(false);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto text-left">
      <div className="bg-[#141414] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-white/60 font-medium">Aegis</span>
          <span className="text-[10px] text-white/25">online</span>
        </div>

        <div className="max-h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-white text-black rounded-br-sm' : 'bg-white/[0.06] text-white/80 rounded-bl-sm'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={send} className="p-4 border-t border-white/[0.06] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Aegis about your business…"
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors"
          />
          <button type="submit" disabled={!input.trim() || thinking} className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => { setLoaded(true); }, []);

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-black" style={{ fontFamily: "'Instrument Sans', 'Inter', sans-serif" }}>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={HERO_VIDEO} type="video/mp4" />
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
            <div className="max-w-6xl">
              <h1 className={cn('text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.1] mb-6 transition-all duration-1000 delay-200', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
                Make your tech stack AGI-capable<br />
                <span className="font-normal text-white/90">with AI that self-learns your business.</span>
              </h1>
              <p className={cn('text-white/60 text-base sm:text-lg leading-relaxed mb-8 transition-all duration-1000 delay-400 max-w-xl', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')} style={{ fontWeight: 500 }}>
                A harness that lets you capture the capabilities of AGI before anyone else. Capture the tech before your market does.
              </p>
              <div className={cn('flex items-center gap-4 transition-all duration-1000 delay-600', loaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>
                <button onClick={() => setDemoOpen(true)} className="group flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-medium hover:bg-white/90 transition-all">
                  Accelerate your business
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
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

      {/* ═══════════════ STATS / FACTS ═══════════════ */}
      <section className="relative bg-black py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">The Aegis Advantage</p>
            <h2 className="text-2xl md:text-4xl font-light text-white tracking-tight leading-tight max-w-3xl">
              Multi-agent systems don't just use tokens; they multiply them. If you are building a multi-agent startup on rented public APIs, your margins will collapse the second you hit scale.
            </h2>
          </div>

          <p className="text-sm font-medium text-white/40 mb-6">We are:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-6">
                <div className="text-3xl font-normal text-white mb-2 tracking-tight">{stat.value}</div>
                <p className="text-sm text-white/30 leading-relaxed">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="text-lg md:text-2xl font-light text-white/60 leading-relaxed max-w-3xl">
            There is no one-size-fits-all solution for every business, unless you have models that can teach themselves how your business works.
          </p>
        </div>
      </section>

      {/* ═══════════════ TRAIN YOUR MODEL ═══════════════ */}
      <section className="relative bg-[#0f0f0f] py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">Model Training</p>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-tight mb-6">
              We train your model.<br />
              <span className="font-normal">It learns how your business works.</span>
            </h2>
            <p className="text-lg text-white/40 leading-relaxed mb-6">
              We handle your model training with AGI-capable techniques and a model that self-improves.
            </p>
            <p className="text-lg text-white/40 leading-relaxed">
              We use recursive self-improvement, engineered for guaranteed convergence. 100% completion on any task you hand it.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
            <img src={IMG_TRAIN} alt="AI model training" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ═══════════════ MEASURE YOUR ROI ═══════════════ */}
      <section className="relative bg-black py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3] order-2 lg:order-1">
            <img src={IMG_ROI} alt="ROI analytics" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-4">Measurement</p>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-tight mb-6">
              We measure your ROI.
            </h2>
            <p className="text-lg text-white/40 leading-relaxed">
              We measure your evaluations, business outcomes, your customers, and ROI. You scale users, not API bills.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ GPU BROKERING (HERO) ═══════════════ */}
      <section className="relative overflow-hidden bg-black border-t border-white/[0.06]">
        <img src="/gpus.jpeg" alt="GPUs" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-16 py-32 md:py-48">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4">GPU Brokering</p>
          <h2 className="text-3xl md:text-6xl font-light text-white tracking-tight leading-tight max-w-3xl mb-6">
            We broker your GPUs.<br />
            <span className="font-normal">No more GPU surfing.</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed max-w-2xl">
            We search and automatically apply the best GPU deals, getting you the best price with complete transparency and contracts.
          </p>
        </div>
      </section>

      {/* ═══════════════ SELF-HOSTING ═══════════════ */}
      <section className="relative bg-black py-24 md:py-32 px-6 md:px-16 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-white/[0.06] flex items-center justify-center mx-auto mb-8 text-white/70">
            <Gauge className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-tight mb-6">
            The world is turning to self-hosting<br />
            <span className="font-normal">because of multi-agents.</span>
          </h2>
          <p className="text-lg text-white/40 leading-relaxed mb-10">
            Do you really want to be the most behind?
          </p>
          <ChatbotHero />
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
            Make your tech stack AGI-capable with AI that self-learns your business.
          </p>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
