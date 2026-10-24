import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Plus, RotateCcw } from 'lucide-react';

const PLATE_RADIUS = 43;
const MAX_OFFSET = 70;
/** Pelat harus ditarik melewati titik ini (72% jarak) agar rep "siap dihitung". */
const OUT_THRESHOLD = 0.72;
/** Setelah siap, pelat harus kembali ke dalam zona ini (22%) untuk menutup 1 rep. */
const IN_THRESHOLD = 0.22;
const MAX_REPS = 999;

interface PlateState {
  x: number;
  vx: number;
  dragging: boolean;
}

export function RepCounter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const reducedMotion = useReducedMotion();
  const [reps, setReps] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [flash, setFlash] = useState(false);
  const plateRef = useRef<PlateState>({ x: 0, vx: 0, dragging: false });
  const pointerStartRef = useRef<{ pointerX: number; plateX: number } | null>(null);
  const maxOffsetRef = useRef(MAX_OFFSET);
  const armedRef = useRef(false);
  const flashTimerRef = useRef<number | null>(null);

  const draw = useCallback(() => {
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

    const cx = width / 2;
    const cy = height / 2;
    // Jarak tarik menyesuaikan lebar kanvas agar pelat + bayangannya tidak terpotong di 320px.
    const maxOffset = Math.max(36, Math.min(MAX_OFFSET, width / 2 - PLATE_RADIUS - 10));
    maxOffsetRef.current = maxOffset;
    plateRef.current.x = Math.max(-maxOffset, Math.min(maxOffset, plateRef.current.x));
    const { x } = plateRef.current;
    const reach = Math.min(1, Math.abs(x) / maxOffset);

    ctx.strokeStyle = 'rgba(36, 35, 35, 0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, cy);
    ctx.lineTo(width - 12, cy);
    ctx.stroke();

    // Garis tengah + dua garis target (batas tarikan yang dihitung sebagai rep).
    const tickInputs = [-1, -OUT_THRESHOLD, 0, OUT_THRESHOLD, 1];
    tickInputs.forEach((position) => {
      const tickX = cx + position * maxOffset;
      const isCenter = position === 0;
      const isTarget = Math.abs(position) === OUT_THRESHOLD;
      ctx.strokeStyle = isCenter ? '#eb6b10' : isTarget ? 'rgba(235, 107, 16, 0.65)' : 'rgba(36, 35, 35, 0.28)';
      ctx.lineWidth = isCenter ? 3 : 2;
      const tickTop = cy + PLATE_RADIUS + (isCenter ? 8 : 11);
      const tickBottom = cy + PLATE_RADIUS + (isCenter ? 20 : 16);
      ctx.beginPath();
      ctx.moveTo(tickX, tickTop);
      ctx.lineTo(tickX, tickBottom);
      ctx.stroke();
    });

    // Indikator tarikan: terisi oranye sampai sejauh mana pelat ditarik.
    const barY = height - 9;
    const barStart = 12;
    const barWidth = width - 24;
    ctx.strokeStyle = 'rgba(36, 35, 35, 0.14)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(barStart, barY);
    ctx.lineTo(barStart + barWidth, barY);
    ctx.stroke();

    ctx.strokeStyle = armedRef.current ? '#eb6b10' : 'rgba(235, 107, 16, 0.55)';
    ctx.beginPath();
    ctx.moveTo(barStart, barY);
    ctx.lineTo(barStart + barWidth * reach, barY);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(36, 35, 35, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(barStart + barWidth * OUT_THRESHOLD, barY - 6);
    ctx.lineTo(barStart + barWidth * OUT_THRESHOLD, barY + 6);
    ctx.stroke();
    ctx.lineCap = 'butt';

    const plateX = cx + x;
    ctx.save();
    ctx.translate(plateX, cy);
    ctx.rotate((x / maxOffset) * 0.1);

    ctx.fillStyle = '#242323';
    ctx.beginPath();
    ctx.arc(4, 4, PLATE_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#eb6b10';
    ctx.strokeStyle = '#242323';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, PLATE_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(36, 35, 35, 0.45)';
    ctx.lineWidth = 1.5;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 18) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * (PLATE_RADIUS - 8), Math.sin(angle) * (PLATE_RADIUS - 8));
      ctx.lineTo(Math.cos(angle) * (PLATE_RADIUS - 2), Math.sin(angle) * (PLATE_RADIUS - 2));
      ctx.stroke();
    }

    ctx.fillStyle = '#242323';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 250, 242, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#fffaf2';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('25', 0, -17);
    ctx.font = '700 7px "JetBrains Mono", monospace';
    ctx.fillText('KG', 0, 24);

    ctx.restore();
  }, []);

  const animate = useCallback(() => {
    if (frameRef.current !== null) return;

    const step = () => {
      const plate = plateRef.current;
      if (!plate.dragging) {
        plate.vx += (0 - plate.x) * 0.09;
        plate.vx *= 0.9;
        plate.x += plate.vx;
        if (Math.abs(plate.x) < 0.15 && Math.abs(plate.vx) < 0.15) {
          plate.x = 0;
          plate.vx = 0;
          draw();
          frameRef.current = null;
          return;
        }
      }

      draw();

      if (visibleRef.current) {
        frameRef.current = window.requestAnimationFrame(step);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = window.requestAnimationFrame(step);
  }, [draw]);

  const registerRep = useCallback(() => {
    setReps((value) => Math.min(MAX_REPS, value + 1));
    setFlash(true);
    if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
    flashTimerRef.current = window.setTimeout(() => setFlash(false), 550);
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(12);
    }
  }, []);

  useEffect(() => {
    draw();
    void document.fonts.ready.then(draw);

    const panel = panelRef.current;
    if (!panel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting && frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(panel);

    const onVisibility = () => {
      if (document.hidden && frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onResize = () => draw();
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
      frameRef.current = null;
    };
  }, [draw]);

  const onPointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pointerX = event.clientX - rect.left - rect.width / 2;
    const distance = Math.abs(pointerX - plateRef.current.x);
    if (distance > PLATE_RADIUS + 24) return;

    canvas.setPointerCapture(event.pointerId);
    plateRef.current.dragging = true;
    plateRef.current.vx = 0;
    pointerStartRef.current = { pointerX: event.clientX, plateX: plateRef.current.x };
    armedRef.current = false;
    setHasDragged(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const start = pointerStartRef.current;
    if (!start || !plateRef.current.dragging) return;
    const maxOffset = maxOffsetRef.current;
    const next = Math.max(
      -maxOffset,
      Math.min(maxOffset, start.plateX + (event.clientX - start.pointerX))
    );
    plateRef.current.x = next;

    // Satu rep: tarik melewati target, lalu kembali ke tengah.
    const reach = Math.abs(next) / maxOffset;
    if (reach >= OUT_THRESHOLD) {
      armedRef.current = true;
    } else if (armedRef.current && reach <= IN_THRESHOLD) {
      armedRef.current = false;
      registerRep();
    }

    animate();
  };

  const endDrag = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!plateRef.current.dragging) return;
    const canvas = canvasRef.current;
    if (canvas?.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    plateRef.current.dragging = false;
    pointerStartRef.current = null;
    armedRef.current = false;
    if (!reducedMotion) animate();
    else {
      plateRef.current.x = 0;
      draw();
    }
  };

  const reset = () => {
    setReps(0);
    setFlash(false);
    armedRef.current = false;
    plateRef.current.x = 0;
    plateRef.current.vx = 0;
    draw();
  };

  return (
    <div
      ref={panelRef}
      className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_290px]"
    >
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Pelat 25 kg
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            {hasDragged ? 'Tarik ke target, kembali ke tengah' : 'Geser pelat'}
          </span>
        </div>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="mt-2 h-[9rem] w-full cursor-grab touch-pan-y active:cursor-grabbing"
          aria-hidden="true"
        />
      </div>

      <div className="border-t-2 border-night/15 pt-4 lg:border-t-0 lg:border-l-2 lg:pt-0 lg:pl-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
            Hitungan rep
          </span>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset hitungan rep"
            className="flex size-11 items-center justify-center rounded-full border-2 border-night bg-paper text-night transition-colors hover:bg-brand hover:text-night"
          >
            <RotateCcw size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-1 flex items-end justify-between gap-3">
          <div className="flex items-end gap-2">
            <span
              aria-live="polite"
              className={`font-display text-[4.5rem] font-extrabold leading-[0.8] tabular-nums text-brand transition-transform duration-150 ${
                flash ? 'scale-110' : 'scale-100'
              }`}
            >
              {String(reps).padStart(2, '0')}
            </span>
            <span
              aria-hidden="true"
              className={`mb-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-night transition-opacity duration-150 ${
                flash ? 'opacity-100' : 'opacity-0'
              }`}
            >
              rep!
            </span>
          </div>
          <button
            type="button"
            onClick={registerRep}
            aria-label="Tambah satu rep manual"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-night bg-brand px-4 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-night shadow-[3px_3px_0_0_#242323] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <Plus size={15} aria-hidden="true" />
            Tambah rep
          </button>
        </div>
        <p className="mt-2 text-[12px] leading-5 text-muted">
          Tarik pelat melewati garis target, lalu kembalikan ke tengah untuk 1 rep.
        </p>
      </div>
    </div>
  );
}
