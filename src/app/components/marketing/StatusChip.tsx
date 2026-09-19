import { cn } from '../ui/utils';

export function StatusChip({ label, tone = 'ok', className }: { label: string; tone?: 'ok' | 'neutral'; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] uppercase',
        tone === 'ok'
          ? 'border-term-400/30 text-term-300 bg-term-950'
          : 'border-white/15 text-white/40',
        className
      )}
    >
      {tone === 'ok' && (
        <span className="w-1.5 h-1.5 rounded-full bg-term-400 animate-pulse shadow-[0_0_12px_rgba(51,255,153,0.6)]" />
      )}
      {label}
    </span>
  );
}
