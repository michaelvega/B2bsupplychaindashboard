import { useState, useEffect } from 'react';
import { Check, X, Mail, User, Building2 } from 'lucide-react';

export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  const inputClass =
    'w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-term-400/50 transition-colors';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-ink-800 border border-white/[0.08] rounded-sm w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-400 mb-1.5">REQ // DEMO-ACCESS</p>
            <h3 className="text-lg font-medium text-white">Request Demo Access</h3>
            <p className="text-xs text-white/30 mt-0.5">We'll get back to you within 24 hours.</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/30 hover:text-white/60 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 border border-term-400/40 bg-term-950 flex items-center justify-center mx-auto mb-5">
              <Check className="w-6 h-6 text-term-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Thank you.</h3>
            <p className="text-sm text-white/30 leading-relaxed">Your demo request has been sent. Check your email for a confirmation. We'll be in touch shortly.</p>
            <button onClick={onClose} className="mt-6 font-mono text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-term-300 transition-colors">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1.5">Name //</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1.5">Email //</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1.5">Business //</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" value={business} onChange={e => setBusiness(e.target.value)} placeholder="Your company" className={inputClass} />
              </div>
            </div>
            <button type="submit" disabled={sending || !name.trim() || !email.trim()} className="w-full bg-white text-ink-950 font-mono text-xs tracking-[0.2em] uppercase font-medium py-3.5 rounded-sm hover:bg-term-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {sending ? 'Sending...' : 'Send Request →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
