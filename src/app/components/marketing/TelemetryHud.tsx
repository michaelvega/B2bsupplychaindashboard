import { useEffect, useState } from 'react';

export interface TelemetryItem {
  label: string;
  value?: string;
  /** Numeric values tick upward every 2s. */
  live?: { base: number; step: number; suffix?: string };
}

/** Mono telemetry strip; live counters increment on a 2s interval. */
export function TelemetryHud({ items }: { items: TelemetryItem[] }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-y border-white/[0.08] bg-ink-950/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 md:px-16 py-3 flex items-center gap-6 md:gap-10 overflow-x-auto whitespace-nowrap">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 font-mono text-[11px] tracking-wider">
            <span className="text-white/30">{item.label}:</span>
            <span className="text-white/80 tabular-nums">
              {item.live
                ? `${(item.live.base + tick * item.live.step).toLocaleString()}${item.live.suffix ?? ''}`
                : item.value}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-term-400 animate-pulse shadow-[0_0_12px_rgba(51,255,153,0.6)]" />
          <span className="text-term-300">ONLINE</span>
        </div>
      </div>
    </div>
  );
}
