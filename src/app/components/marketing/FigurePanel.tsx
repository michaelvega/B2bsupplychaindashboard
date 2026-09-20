import type { ReactNode } from 'react';
import { cn } from '../ui/utils';

const CORNERS = [
  'top-0 left-0 border-t border-l',
  'top-0 right-0 border-t border-r',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
] as const;

/** Editorial figure panel: HUD corner brackets, mono caption bar, optional image. */
export function FigurePanel({
  fig,
  caption,
  image,
  imageClass,
  fadeBottom = false,
  children,
  className,
}: {
  fig: string;
  caption: string;
  image?: string;
  imageClass?: string;
  fadeBottom?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative border border-white/[0.08] bg-ink-900 hover:border-term-400/40 transition-colors group', className)}>
      {CORNERS.map((pos) => (
        <span
          key={pos}
          className={cn('absolute w-4 h-4 border-term-400/60 opacity-40 group-hover:opacity-100 transition-opacity', pos)}
        />
      ))}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-2.5">
        <span className="font-mono text-[10px] tracking-[0.2em] text-term-400">FIG.{fig}</span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-white/30">{caption}</span>
      </div>
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={image} alt={caption} className={cn('w-full h-full object-cover', imageClass)} />
          <div className="absolute inset-0 bg-ink-950/40" />
          {fadeBottom && (
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900 to-transparent" />
          )}
        </div>
      )}
      {children && <div className="p-6">{children}</div>}
    </div>
  );
}
