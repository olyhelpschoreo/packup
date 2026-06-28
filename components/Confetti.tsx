"use client";

import { useEffect, useRef } from "react";

// Dependency-free confetti burst. Re-fires whenever `trigger` changes.
export function Confetti({ trigger }: { trigger: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = (canvas.width = window.innerWidth * dpr);
    const H = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const colors = [
      "#0d9488", "#14b8a6", "#f59e0b", "#fbbf24",
      "#34d399", "#f472b6", "#60a5fa", "#a78bfa",
    ];
    const parts = Array.from({ length: 130 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 80 * dpr,
      y: H * 0.3,
      vx: (Math.random() - 0.5) * 16 * dpr,
      vy: (Math.random() * -13 - 4) * dpr,
      g: 0.34 * dpr,
      size: (5 + Math.random() * 7) * dpr,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      life: 1,
    }));

    let raf = 0;
    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      for (const p of parts) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.rot += p.vr;
        p.life -= 0.011;
        if (p.life <= 0) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (frame < 170) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-40"
      aria-hidden
    />
  );
}
