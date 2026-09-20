export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-white/25 bg-neutral-800/80 p-6">
      <div className="font-mono text-4xl md:text-5xl font-medium text-white tracking-tight mb-3 tabular-nums">
        {value}
      </div>
      <p className="text-sm text-white/50 leading-relaxed">{label}</p>
    </div>
  );
}
