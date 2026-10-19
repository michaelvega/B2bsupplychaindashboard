import { useState, useEffect } from 'react';
import { Check, X, Mail, User } from 'lucide-react';

/** "Contact Us Now": name, email, optional message. Emails the founders via /api/contact. */
export function DemoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot, left empty by real people
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) { setName(''); setEmail(''); setMessage(''); setWebsite(''); setSubmitted(false); setError(''); }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website,
          source: window.location.pathname,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong.');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please email michael@procept.tech directly.');
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  const inputClass =
    'w-full bg-white/[0.04] border border-white/[0.08] rounded-sm pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#636363]/60 focus:outline-none focus:border-term-400/50 transition-colors';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-ink-800 border border-white/[0.08] rounded-sm w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-400 mb-1.5">CONTACT // FOUNDERS</p>
            <h3 className="text-lg font-medium text-white">Contact Us Now</h3>
            <p className="text-xs text-[#636363]/70 mt-0.5">Just your name and email. We'll write back within a day.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 text-[#636363]/70 hover:text-[#636363] transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 border border-term-400/40 bg-term-950 flex items-center justify-center mx-auto mb-5">
              <Check className="w-6 h-6 text-term-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Sent.</h3>
            <p className="text-sm text-[#636363]/70 leading-relaxed">Michael and Sam got your note and will email you back soon.</p>
            <button onClick={onClose} className="mt-6 font-mono text-[11px] tracking-[0.2em] uppercase text-[#636363]/80 hover:text-term-300 transition-colors">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80 mb-1.5">Name //</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#636363]/60" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80 mb-1.5">Email //</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#636363]/60" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-[#636363]/80 mb-1.5">Message // optional</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Anything you'd like us to know"
                rows={3}
                maxLength={2000}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-sm px-4 py-2.5 text-sm text-white placeholder:text-[#636363]/60 focus:outline-none focus:border-term-400/50 transition-colors resize-y"
              />
            </div>
            {/* Honeypot: hidden from people, tempting to bots */}
            <input type="text" name="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            {error && <p role="alert" className="text-sm text-[#e0735c]">{error}</p>}
            <button type="submit" disabled={sending || !name.trim() || !email.trim()} className="w-full bg-white text-ink-950 font-mono text-xs tracking-[0.2em] uppercase font-medium py-3.5 rounded-sm hover:text-term-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {sending ? 'Sending...' : 'Send →'}
            </button>
            <p className="text-center text-xs text-[#636363]/70">
              or email{' '}
              <a href="mailto:michael@procept.tech" className="text-[#636363] hover:text-term-300 transition-colors">michael@procept.tech</a>
              {' '}or{' '}
              <a href="mailto:sam@procept.tech" className="text-[#636363] hover:text-term-300 transition-colors">sam@procept.tech</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
