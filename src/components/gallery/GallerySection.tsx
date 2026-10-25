import { useCallback, useEffect, useRef, useState } from 'react';
import type { TouchEvent as ReactTouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { galleryData } from '../../data/portfolioData';
import { startLenisScroll, stopLenisScroll } from '../../hooks/useLenisSmoothScroll';
import { ResponsiveImage } from '../common/ResponsiveImage';

export function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastIndexRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const active = activeIndex === null ? null : galleryData[activeIndex];

  const close = useCallback(() => {
    setActiveIndex(null);
    const trigger = triggerRefs.current[lastIndexRef.current];
    window.setTimeout(() => trigger?.focus(), 30);
  }, []);

  const show = useCallback((next: number) => {
    const total = galleryData.length;
    setActiveIndex(((next % total) + total) % total);
  }, []);

  const open = useCallback((index: number) => {
    lastIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const onTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    show((activeIndex ?? 0) + (dx < 0 ? 1 : -1));
  };

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopLenisScroll();
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') show(activeIndex + 1);
      if (event.key === 'ArrowLeft') show(activeIndex - 1);
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], video, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      startLenisScroll();
    };
  }, [activeIndex, close, show]);

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="galeri" className="section relative overflow-hidden bg-night" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
      {/* Background crossfade dengan 2 foto */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img
          src="/assets/img/1.jpeg"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
            bgIndex === 0 ? 'opacity-30' : 'opacity-0'
          }`}
        />
        <img
          src="/assets/img/2.jpeg"
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out ${
            bgIndex === 1 ? 'opacity-30' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-night/70" />
      </div>
      <div aria-hidden="true" className="dot-grid-dark pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-[10%] size-72 rounded-full bg-brand/20 blur-3xl"
      />

      <div className="shell relative">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
          <div>
            <span className="label-pill label-pill--night">05 // Galeri</span>
            <h2 className="mt-4 text-h2 text-cream">
              Galeri Dokumentasi Saya<span className="text-brand">.</span>
            </h2>
          </div>
          <div className="md:max-w-[30ch] md:justify-self-end md:text-right">
            <p className="text-[14px] leading-6 text-muted-dark">
              Dokumentasi sesi latihan, pendampingan, dan aktivitas di luar gym. Ketuk untuk
              memperbesar.
            </p>
          </div>
        </div>

        <ul className="mt-10 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {galleryData.map((item, index) => (
            <li key={item.id} className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-start">
              <button
                ref={(node) => {
                  triggerRefs.current[index] = node;
                }}
                type="button"
                onClick={() => open(index)}
                aria-label={`Buka ${item.type === 'video' ? 'video' : 'foto'}: ${item.caption}`}
                className="group block w-full text-left"
              >
                <span className="card card--dark-section card-hover block overflow-hidden p-1.5 sm:p-2">
                  <span
                    className="relative block w-full overflow-hidden rounded-[1.1rem] border-2 border-night bg-cream-deep aspect-[3/4]"
                  >
                    {item.type === 'image' && item.image ? (
                      <ResponsiveImage
                        image={item.image}
                        sizes="(min-width: 1024px) 42vw, (min-width: 768px) 46vw, 94vw"
                        className="block h-full w-full"
                        imgClassName="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                      />
                    ) : item.video ? (
                      <>
                        <img
                          src={item.video.poster}
                          alt={item.alt}
                          width={item.video.width}
                          height={item.video.height}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                        />
                        <span className="absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-night bg-brand text-night shadow-[3px_3px_0_0_#242323]">
                          <Play size={18} className="translate-x-0.5" aria-hidden="true" />
                        </span>
                      </>
                    ) : null}
                  </span>

                  <span className="flex items-baseline justify-between gap-2 px-1.5 pt-2 pb-1">
                    <span className="pill pill--brand border-night px-2 py-0.5 text-[8px]">
                      {item.tag}
                    </span>
                    <span className="text-right text-[11px] font-semibold leading-tight text-night/75">
                      {item.caption}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Lightbox di-portal ke <body>: section #galeri memakai animasi AOS
          yang menyisakan `transform: translateZ(0)`. Transform itu menjadikan
          section sebagai containing block untuk position:fixed (dialog jadi tidak
          seukuran viewport) sekaligus membuat stacking context, sehingga z-index
          dialog terkunci di bawah nav (z-50) dan tombol tutup ketimpa. */}
      {createPortal(
        <AnimatePresence>
          {active && (
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`Galeri: ${active.caption}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: 'linear' }}
              className="fixed inset-0 z-[80] flex w-screen flex-col bg-night/97 pt-[max(env(safe-area-inset-top),0.75rem)] pr-[env(safe-area-inset-right)] pb-[max(env(safe-area-inset-bottom),0.75rem)] pl-[env(safe-area-inset-left)] sm:pt-[env(safe-area-inset-top)] sm:pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b-2 border-cream/20 px-4 py-3 text-cream sm:px-6">
                <div className="min-w-0">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-brand">
                    {active.tag}
                  </p>
                  <p className="mt-1 truncate font-display text-[1.3rem] font-extrabold leading-none">
                    {active.caption}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden font-mono text-[10px] tabular-nums tracking-[0.1em] text-muted-dark sm:block">
                    {(activeIndex ?? 0) + 1} / {galleryData.length}
                  </span>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Tutup galeri"
                    className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-night bg-brand text-night shadow-[3px_3px_0_0_#242323] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div
                className="relative flex min-h-0 flex-1 p-4 sm:p-8"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {/* Kolom media yang bisa di-scroll: foto tetap ditengahkan bila
                    muat, dan caption tetap terjangkau pada layar pendek/landscape. */}
                <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto overscroll-contain">
                  <figure className="my-auto w-full max-w-4xl">
                    <div className="card card--lg overflow-hidden p-2 sm:p-3">
                      <div className="overflow-hidden rounded-[1.1rem] border-2 border-night bg-cream-deep">
                        {active.type === 'image' && active.image ? (
                          <ResponsiveImage
                            image={active.image}
                            sizes="(min-width: 1024px) 900px, 92vw"
                            className="block max-h-[68dvh] w-full"
                            fit="contain"
                            priority
                          />
                        ) : active.video ? (
                          <video
                            key={active.video.mp4}
                            controls
                            autoPlay
                            playsInline
                            muted
                            preload="metadata"
                            poster={active.video.poster}
                            aria-label={active.alt}
                            className="max-h-[68dvh] w-full bg-night object-contain"
                          >
                            <source src={active.video.mp4} type="video/mp4" />
                            <source src={active.video.webm} type="video/webm" />
                            Browser tidak mendukung video ini.
                          </video>
                        ) : null}
                      </div>
                      <figcaption className="px-2 pt-2 pb-1 text-[12px] leading-5 text-muted">
                        {active.alt}
                      </figcaption>
                    </div>
                  </figure>
                </div>

                {/* Panah prev/next: berada di luar kolom scroll supaya tetap
                    terlihat di tengah, dan hanya tampil >= 640px agar tidak
                    menutupi tepi foto di layar kecil. */}
                <button
                  type="button"
                  onClick={() => show((activeIndex ?? 0) - 1)}
                  aria-label="Item sebelumnya"
                  className="absolute top-1/2 left-2 z-10 -mt-6 hidden size-12 items-center justify-center rounded-full border-2 border-night bg-paper text-night shadow-[3px_3px_0_0_#242323] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:left-5 sm:flex"
                >
                  <ChevronLeft size={22} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => show((activeIndex ?? 0) + 1)}
                  aria-label="Item berikutnya"
                  className="absolute top-1/2 right-2 z-10 -mt-6 hidden size-12 items-center justify-center rounded-full border-2 border-night bg-paper text-night shadow-[3px_3px_0_0_#242323] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:right-5 sm:flex"
                >
                  <ChevronRight size={22} aria-hidden="true" />
                </button>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-2 border-t-2 border-cream/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-dark sm:gap-4 sm:px-6 sm:py-3">
                {/* Navigasi prev/next di baris bawah — hanya layar kecil,
                    supaya tidak menutupi foto dan tetap terjangkau jempol. */}
                <div className="flex shrink-0 items-center gap-2 sm:hidden">
                  <button
                    type="button"
                    onClick={() => show((activeIndex ?? 0) - 1)}
                    aria-label="Item sebelumnya"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-night bg-paper text-night shadow-[3px_3px_0_0_#242323] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => show((activeIndex ?? 0) + 1)}
                    aria-label="Item berikutnya"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-night bg-paper text-night shadow-[3px_3px_0_0_#242323] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </div>
                <span className="min-w-0 truncate">Geser / panah kiri-kanan</span>
                <span className="hidden shrink-0 sm:block">Esc untuk menutup</span>
                <span className="shrink-0 tabular-nums sm:hidden">
                  {(activeIndex ?? 0) + 1} / {galleryData.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
