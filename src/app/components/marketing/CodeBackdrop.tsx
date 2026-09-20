import { useEffect, useRef } from 'react';

const CODE_IMAGES = [
  '/inspo/code1.png',
  '/inspo/code2.png',
  '/inspo/code4.png',
  '/inspo/code5.png',
];

/**
 * Collage of repeated code screenshots layered over the whole site.
 * Revealed only while the mouse moves: a small horizontal ellipse trails
 * the cursor and shows the code over the page content, then closes back
 * up when the mouse stops. Sits above all page content (z-80, below the
 * cursor dot and modals) so images under the circle dim to ~10% opacity
 * while the code layer shows at ~90%.
 */
export function CodeBackdrop() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = { x: -500, y: -500, r: 0 };
    const current = { x: -500, y: -500, r: 0 };
    let raf = 0;
    let lastMove = performance.now();
    let lastPos = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMove);
      lastMove = now;
      const speed = Math.hypot(e.clientX - lastPos.x, e.clientY - lastPos.y) / dt;
      lastPos = { x: e.clientX, y: e.clientY };
      target.x = e.clientX;
      target.y = e.clientY;
      target.r = Math.min(150, 55 + speed * 28);
    };

    const loop = () => {
      const now = performance.now();
      // Close gradually once the mouse rests, a touch faster than the grow-in.
      if (now - lastMove > 220) target.r += (0 - target.r) * 0.12;
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      current.r += (target.r - current.r) * 0.14;
      const el = layerRef.current;
      if (el) {
        // Code at ~90% in the middle (10% of the site still on top), fading out smoothly.
        const mask = `radial-gradient(ellipse ${current.r * 1.6}px ${current.r}px at ${current.x}px ${current.y}px, rgba(0,0,0,0.9) 0%, black 45%, transparent 100%)`;
        el.style.maskImage = mask;
        el.style.webkitMaskImage = mask;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      className="fixed inset-0 z-[80] pointer-events-none"
      style={{
        maskImage: 'radial-gradient(ellipse 0px 0px at -500px -500px, black, transparent)',
        WebkitMaskImage: 'radial-gradient(ellipse 0px 0px at -500px -500px, black, transparent)',
      }}
      aria-hidden
    >
      <div className="h-full w-full grid grid-cols-4 md:grid-cols-6 auto-rows-fr bg-ink-950">
        {Array.from({ length: 48 }, (_, i) => (
          <img
            key={i}
            src={CODE_IMAGES[i % CODE_IMAGES.length]}
            alt=""
            className="w-full h-full object-cover grayscale brightness-125"
          />
        ))}
      </div>
    </div>
  );
}
