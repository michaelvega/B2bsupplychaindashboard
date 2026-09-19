import { Link } from 'react-router';
import { StatusChip } from './StatusChip';
import { scrollToSection } from './MarketingNav';

const PRODUCT_ITEMS = [
  { id: 'stack', label: 'Self-Hosted Stack' },
  { id: 'stack', label: 'GPU Abstraction' },
  { id: 'harness', label: 'RSI Harness' },
  { id: 'problem', label: 'Flat Pricing' },
];

/** Footer shared by the landing page and legal pages. */
export function MarketingFooter({ onNavigate }: { onNavigate?: (sectionId: string) => void }) {
  return (
    <footer className="bg-ink-950 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src="/procept-logo-light.jpg" alt="Procept" className="w-7 h-7 rounded-sm object-cover ring-1 ring-white/20" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-white/80 font-medium">Procept</span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed mb-4">
            The fully maintained, self-hosted AI stack.
          </p>
          <StatusChip label="All systems operational" />
        </div>

        {/* Product */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-400 mb-4">Product</p>
          <ul className="space-y-2.5">
            {PRODUCT_ITEMS.map((item) =>
              onNavigate ? (
                <li key={item.label}>
                  <button onClick={() => onNavigate(item.id)} className="text-sm text-white/40 hover:text-white transition-colors">
                    {item.label}
                  </button>
                </li>
              ) : (
                <li key={item.label}>
                  <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-400 mb-4">Company</p>
          <ul className="space-y-2.5">
            <li>
              <a href="mailto:hello@procept.tech" className="text-sm text-white/40 hover:text-white transition-colors">Contact</a>
            </li>
            {/* Placeholders — replace with real profile URLs */}
            <li><span className="text-sm text-white/40 cursor-default" title="Coming soon">GitHub</span></li>
            <li><span className="text-sm text-white/40 cursor-default" title="Coming soon">LinkedIn</span></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-term-400 mb-4">Legal</p>
          <ul className="space-y-2.5">
            <li><Link to="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="text-sm text-white/40 hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/data-processing-addendum" className="text-sm text-white/40 hover:text-white transition-colors">Data Processing Addendum</Link></li>
            <li><Link to="/plans" className="text-sm text-white/40 hover:text-white transition-colors">Service Descriptions</Link></li>
            <li><span className="text-sm text-white/40 cursor-default" title="Coming soon">Cookie Policy</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-xs text-white/20">© 2026 Procept Technologies Corp.</span>
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/20">
            SYS v2.0 // PROCEPT.ENGINEERING // WILMINGTON, DE
          </span>
        </div>
      </div>
    </footer>
  );
}
