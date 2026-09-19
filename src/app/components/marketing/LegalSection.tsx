interface LegalBlock {
  sub?: string;
  paras: string[];
  list?: string[];
}

/** Numbered legal section: optional §num, heading, paragraphs, key/value blocks, lists. */
export function LegalSection({
  num,
  heading,
  paras,
  blocks,
  list,
}: {
  num?: string;
  heading: string;
  paras?: string[];
  blocks?: LegalBlock[];
  list?: string[];
}) {
  return (
    <section>
      <div className="flex items-baseline gap-4 mb-5">
        {num && <span className="text-term-400 font-mono text-sm tabular-nums shrink-0">§{num}</span>}
        <h2 className="text-xl font-medium text-white">{heading}</h2>
      </div>

      {paras && (
        <div className="space-y-4 mb-5">
          {paras.map((para, j) => (
            <p key={j} className="text-sm text-white/50 leading-relaxed">{para}</p>
          ))}
        </div>
      )}

      {list && (
        <ul className="space-y-2.5 mb-5">
          {list.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-sm text-white/50 leading-relaxed">
              <span className="w-1.5 h-1.5 bg-term-400/70 mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {blocks && (
        <div className="space-y-6">
          {blocks.map((block, j) => (
            <div key={j}>
              {block.sub && (
                <h3 className="font-mono text-xs text-white/70 tracking-wider mb-3">{block.sub}</h3>
              )}
              <div className="space-y-3">
                {block.paras.map((para, k) => (
                  <p key={k} className="text-sm text-white/50 leading-relaxed">{para}</p>
                ))}
              </div>
              {block.list && (
                <ul className="space-y-2.5 mt-4">
                  {block.list.map((item, k) => (
                    <li key={k} className="flex items-start gap-3 text-sm text-white/50 leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-term-400/70 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
