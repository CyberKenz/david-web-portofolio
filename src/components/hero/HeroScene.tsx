import { useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  alpha: number;
}

const CREAM = '247, 239, 227';
const NIGHT = '#242323';
const BRAND = '#eb6b10';
const PAPER = '#fffaf2';

function PlateMascot({ onDrop }: { onDrop: (x: number, y: number) => void }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      drag
      dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
      dragElastic={0.16}
      dragMomentum
      whileDrag={{ scale: 1.06, rotate: 8 }}
      onDragEnd={(_, info) => onDrop(info.point.x, info.point.y)}
      className="pointer-events-auto absolute bottom-[18%] left-[4%] hidden w-24 cursor-grab touch-none active:cursor-grabbing md:block lg:w-28"
      aria-hidden="true"
    >
      <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-night bg-paper px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-night shadow-[2px_2px_0_0_#242323]">
        Siap latihan?
      </span>
      <svg viewBox="0 0 120 120" className={reducedMotion ? '' : 'float-y'}>
        <circle cx="60" cy="60" r="48" fill={PAPER} stroke={NIGHT} strokeWidth="4" />
        <circle cx="60" cy="60" r="38" fill="none" stroke={NIGHT} strokeWidth="2" strokeDasharray="2 5" opacity="0.5" />
        <circle cx="60" cy="60" r="20" fill={BRAND} stroke={NIGHT} strokeWidth="3" />
        <circle cx="60" cy="60" r="9" fill={PAPER} stroke={NIGHT} strokeWidth="2" />
        <circle cx="52" cy="56" r="2.4" fill={NIGHT} />
        <circle cx="68" cy="56" r="2.4" fill={NIGHT} />
        <path d="M54 65 Q60 69 66 65" fill="none" stroke={NIGHT} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M18 44 L8 38" stroke={NIGHT} strokeWidth="3" strokeLinecap="round" />
        <path d="M102 44 L112 38" stroke={NIGHT} strokeWidth="3" strokeLinecap="round" />
        <path d="M18 76 L8 82" stroke={NIGHT} strokeWidth="3" strokeLinecap="round" />
        <path d="M102 76 L112 82" stroke={NIGHT} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

export function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const visibleRef = useRef(true);
  const reducedMotion = useReducedMotion();

  const ensureParticles = useCallback((width: number, height: number) => {
    if (particlesRef.current.length) return;
    particlesRef.current = Array.from({ length: 26 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 2.4,
      speed: 0.12 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.15,
      alpha: 0.15 + Math.random() * 0.4
    }));
  }, []);

  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ensureParticles(width, height);
    particlesRef.current.forEach((particle) => {
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = `rgb(${CREAM})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    for (let line = 0; line < 3; line += 1) {
      const baseY = height * (0.26 + line * 0.2);
      ctx.beginPath();
      for (let x = 0; x <= width; x += 12) {
        const y = baseY + Math.sin(x / 180 + line * 1.4) * (12 + line * 6);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${CREAM}, ${0.14 + line * 0.05})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [ensureParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (reducedMotion) {
      drawStatic();
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ensureParticles(width, height);
      time += 0.006;

      for (let line = 0; line < 3; line += 1) {
        const baseY = height * (0.24 + line * 0.2);
        ctx.beginPath();
        for (let x = 0; x <= width; x += 10) {
          const y =
            baseY +
            Math.sin(x / 190 + time * (1.2 + line * 0.25) + line * 1.6) * (12 + line * 7);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${CREAM}, ${0.16 + line * 0.06})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      particlesRef.current.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;
        if (particle.y < -6) {
          particle.y = height + 6;
          particle.x = Math.random() * width;
        }
        if (particle.x < -6) particle.x = width + 6;
        if (particle.x > width + 6) particle.x = -6;
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = `rgb(${CREAM})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      ripplesRef.current = ripplesRef.current.filter((ripple) => ripple.alpha > 0.02);
      ripplesRef.current.forEach((ripple) => {
        ripple.radius += 2.4;
        ripple.alpha *= 0.965;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${CREAM}, ${ripple.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      if (visibleRef.current) frameRef.current = window.requestAnimationFrame(render);
      else frameRef.current = null;
    };

    frameRef.current = window.requestAnimationFrame(render);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && frameRef.current === null) {
          frameRef.current = window.requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden && frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      } else if (!document.hidden && visibleRef.current && frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', drawStatic);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', drawStatic);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [drawStatic, ensureParticles, reducedMotion]);

  const spawnRipple = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    ripplesRef.current.push({
      x: x - rect.left,
      y: y - rect.top,
      radius: 6,
      alpha: 0.7
    });
    if (reducedMotion) drawStatic();
  }, [drawStatic, reducedMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerDown={(event) => spawnRipple(event.clientX, event.clientY)}
        className="pointer-events-auto absolute inset-0 h-full w-full"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 120 70"
        className="float-soft absolute top-[26%] right-[6%] hidden w-24 lg:block"
      >
        <g fill={PAPER} stroke={NIGHT} strokeWidth="3.5" strokeLinecap="round">
          <rect x="8" y="27" width="12" height="18" rx="3" />
          <rect x="20" y="22" width="9" height="28" rx="3" />
          <rect x="29" y="32" width="62" height="8" />
          <rect x="91" y="22" width="9" height="28" rx="3" />
          <rect x="100" y="27" width="12" height="18" rx="3" />
        </g>
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 90 90"
        className="float-y absolute bottom-[24%] right-[16%] hidden w-16 lg:block"
      >
        <path
          d="M30 20 C30 10 60 10 60 20 L57 40 C64 44 70 52 70 62 C70 76 59 82 45 82 C31 82 20 76 20 62 C20 52 26 44 33 40 Z"
          fill={PAPER}
          stroke={NIGHT}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M38 18 C42 14 48 14 52 18" fill="none" stroke={NIGHT} strokeWidth="3.5" strokeLinecap="round" />
      </svg>

      <PlateMascot onDrop={spawnRipple} />
    </div>
  );
}
