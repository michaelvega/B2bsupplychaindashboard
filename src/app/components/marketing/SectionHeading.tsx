import type { ReactNode } from 'react';
import { cn } from '../ui/utils';

export function SectionHeading({
  num,
  label,
  title,
  sub,
  align = 'left',
  compact = false,
  className,
}: {
  num?: string;
  label?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'left' | 'center';
  /** Smaller subtitle, used by long-form articles. */
  compact?: boolean;
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div className={cn(centered && 'text-center', className)}>
      {(num || label) && (
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-term-400 mb-5">
          {num} / {label}
        </p>
      )}
      <h2 className={cn('text-3xl md:text-5xl font-light text-white tracking-tight leading-[1.15] max-w-3xl', centered && 'mx-auto')}>
        {title}
      </h2>
      {sub && (
        <div className={cn('mt-6 text-white/60 leading-relaxed max-w-2xl', compact ? 'text-sm md:text-base' : 'text-base md:text-lg', centered && 'mx-auto')}>
          {sub}
        </div>
      )}
    </div>
  );
}
