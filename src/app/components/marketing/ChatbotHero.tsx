import { useState } from 'react';

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

export function ChatbotHero({ className }: { className?: string }) {
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
    <div className={`max-w-2xl mx-auto text-left ${className ?? ''}`}>
      <div className="bg-ink-800 border border-white/[0.08] rounded-sm overflow-hidden shadow-2xl shadow-black/50">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-term-400 animate-pulse shadow-[0_0_12px_rgba(51,255,153,0.6)]" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-white/60 font-medium">AEGIS</span>
          <span className="font-mono text-[10px] text-white/25">— OPERATIONAL ASSISTANT</span>
          <span className="ml-auto font-mono text-[10px] text-term-400">online</span>
        </div>

        <div className="max-h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={`max-w-[85%] rounded-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'bg-term-400 text-ink-950' : 'bg-white/[0.06] text-white/80'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-white/[0.06] rounded-sm px-4 py-3 flex items-center gap-1.5">
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
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-sm px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-term-400/50 transition-colors"
          />
          <button type="submit" disabled={!input.trim() || thinking} className="px-5 py-2.5 bg-white text-ink-950 font-mono text-xs tracking-[0.15em] uppercase font-medium rounded-sm hover:bg-term-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
