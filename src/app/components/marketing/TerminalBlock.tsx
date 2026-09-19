/** Terminal-style code block: traffic-light squares, mono lines, diff coloring. */
export function TerminalBlock({ lines, title = 'procept — zsh' }: { lines: string[]; title?: string }) {
  const renderLine = (line: string) => {
    const t = line.trimStart();
    let className = 'text-white/70';
    if (t.startsWith('$') || t.startsWith('▸') || t.startsWith('+')) className = 'text-term-300';
    else if (line.includes('✓')) className = 'text-term-400';
    else if (t.startsWith('-')) className = 'text-white/35 line-through decoration-white/20';
    return <span className={className}>{line}</span>;
  };

  return (
    <div className="bg-ink-800 border border-white/10 rounded-sm overflow-hidden shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <span className="w-2.5 h-2.5 bg-term-400/80" />
        <span className="w-2.5 h-2.5 bg-white/20" />
        <span className="w-2.5 h-2.5 bg-white/10" />
        <span className="ml-3 font-mono text-[11px] text-white/30 tracking-wider">{title}</span>
      </div>
      <div className="p-5 md:p-6 font-mono text-[13px] leading-relaxed whitespace-pre overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i}>{renderLine(line)}</div>
        ))}
      </div>
    </div>
  );
}
