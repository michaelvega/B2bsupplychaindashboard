export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative border border-white/15 bg-gradient-to-b from-white/[0.07] to-transparent p-6 overflow-hidden group hover:border-term-400/40 transition-colors">
      {/* Accent hairline across the top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-term-400/70 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
      {/* Corner notch */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/25 group-hover:border-term-400/50 transition-colors" />
      <div className="font-mono text-4xl md:text-5xl font-medium text-white tracking-tight mb-3 tabular-nums">
        {value}
      </div>
      <p className="text-sm text-white/50 leading-relaxed">{label}</p>
    </div>
  );
}
