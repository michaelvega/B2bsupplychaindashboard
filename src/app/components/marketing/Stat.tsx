export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-white/[0.08] bg-ink-900 p-8 hover:border-term-400/40 transition-colors">
      <div className="font-mono text-5xl md:text-6xl font-medium text-term-300 tracking-tight mb-4 tabular-nums">
        {value}
      </div>
      <p className="text-sm text-white/40 leading-relaxed">{label}</p>
    </div>
  );
}
