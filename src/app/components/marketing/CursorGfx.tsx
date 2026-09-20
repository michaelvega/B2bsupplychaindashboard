import { useEffect, useRef, useState } from 'react';

/** Trailing cursor graphic: a green circle that grows with movement speed and while scrolling. */
export function CursorGfx() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const scale = useRef(1);
  const target = useRef(1);

  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let lastMove = performance.now();
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMove);
      lastMove = now;
      const speed = Math.hypot(e.clientX - pos.current.x, e.clientY - pos.current.y) / dt;
      target.current = Math.max(target.current, Math.min(3.5, 1 + speed * 0.35));
      pos.current = { x: e.clientX, y: e.clientY };
    };
    let scrollTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      target.current = Math.max(target.current, 2.4);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {}, 220);
    };
    const loop = () => {
      scale.current += (target.current - scale.current) * 0.08;
      target.current += (1 - target.current) * 0.03; // decay toward rest size
      if (dotRef.current) {
        const s = scale.current;
        dotRef.current.style.transform = `translate3d(${pos.current.x - 4}px, ${pos.current.y - 4}px, 0) scale(${s})`;
        dotRef.current.style.opacity = String(Math.min(0.9, 0.45 + 0.55 * ((s - 1) / 2.5)));
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, true);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll, true);
      cancelAnimationFrame(raf);
      clearTimeout(scrollTimer);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[95] w-2 h-2 bg-term-400 rounded-full pointer-events-none shadow-[0_0_14px_rgba(51,255,153,0.7)]"
    />
  );
}
