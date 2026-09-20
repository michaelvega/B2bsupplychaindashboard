import { useMemo } from 'react';
import { cn } from '../ui/utils';

/** Deterministic seeded PRNG so the network is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Subtle node-link network drawn behind a section. */
export function NetworkBackdrop({ className }: { className?: string }) {
  const { nodes, links } = useMemo(() => {
    const rand = mulberry32(1337);
    const nodes = Array.from({ length: 42 }, (_, i) => ({
      id: i,
      x: rand() * 1200,
      y: rand() * 600,
    }));
    const links: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes
        .map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d);
      const count = 2 + (i % 3 === 0 ? 1 : 0);
      for (const o of dists.slice(0, count)) {
        const a = Math.min(i, o.j);
        const b = Math.max(i, o.j);
        if (!links.some(([x, y]) => x === a && y === b)) links.push([a, b]);
      }
    }
    return { nodes, links };
  }, []);

  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0 h-full w-full pointer-events-none', className)}
      aria-hidden
    >
      <g stroke="rgba(255,255,255,0.07)" strokeWidth="1">
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} />
        ))}
      </g>
      {nodes.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.id % 7 === 0 ? 3 : 2}
          fill={n.id % 7 === 0 ? 'rgba(51,255,153,0.25)' : 'rgba(255,255,255,0.12)'}
        />
      ))}
    </svg>
  );
}
