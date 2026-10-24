import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { CalendarDays, Check, Clock } from 'lucide-react';
import { timelineData } from '../../data/portfolioData';

const statusStyles = {
  done: 'border-night bg-brand text-night',
  current: 'border-night bg-night text-brand',
  placeholder: 'border-dashed border-night bg-paper text-muted'
} as const;

export function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 75%']
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.2,
    restDelta: 0.001
  });

  return (
    <section id="perjalanan" className="on-cream section relative overflow-hidden bg-cream" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="shell relative">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
          <div>
            <span className="label-pill">03 // Perjalanan</span>
            <h2 className="mt-4 text-h2 text-night">
              Jejak langkah<span className="text-brand">.</span>
            </h2>
          </div>
          <div className="md:max-w-[30ch] md:justify-self-end md:text-right">
            <p className="text-[14px] leading-6 text-muted">
              Dari bergabung dengan Elluna Gym &amp; MMA sampai sekarang.
            </p>
            <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-deep">
              Des 2025 sekarang
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-12">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="card card--lg bg-night p-5 text-cream shadow-[7px_7px_0_0_#eb6b10] sm:p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
                Lini masa
              </p>
              <p className="mt-2 font-display text-[2rem] font-extrabold leading-[0.95] text-cream">
                Des 2025
                <br />
                sampai sekarang
              </p>
              <p className="mt-3 max-w-[30ch] text-[12px] leading-5 text-muted-dark">
                Lini masa perjalanan David Andreas sebagai Personal Trainer di Elluna Gym &amp; MMA, Pontianak, berawal dari Desember 2025.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="pill pill--brand border-cream/20">Personal Trainer</span>
                <span className="pill pill--night border-cream/30">Pontianak</span>
              </div>
            </div>
          </div>

          <div ref={containerRef} className="relative min-w-0 pl-8 sm:pl-10">
            <div aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-[3px] bg-night/20" />
            <motion.div
              aria-hidden="true"
              style={reducedMotion ? { scaleY: 1 } : { scaleY: progress }}
              className="absolute top-2 bottom-2 left-[5px] w-[3px] origin-top bg-brand"
            />

            <ol className="space-y-5">
              {timelineData.map((entry, index) => {
                const placeholder = entry.status === 'placeholder';
                return (
                  <motion.li
                    key={entry.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="relative"
                  >
                    <span
                      className={`absolute top-6 -left-8 flex size-6 items-center justify-center rounded-full border-2 sm:-left-10 ${statusStyles[entry.status]}`}
                      aria-hidden="true"
                    >
                      {entry.status === 'current' ? (
                        <span className="size-2 rounded-full bg-brand" />
                      ) : placeholder ? (
                        <Clock size={12} />
                      ) : (
                        <Check size={12} strokeWidth={3} />
                      )}
                    </span>

                    <article
                      className={`rounded-[1.4rem] border-2 p-4 sm:p-5 ${
                        placeholder
                          ? 'border-dashed border-night/40 bg-cream'
                          : 'card card-hover bg-paper border-night'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-night/10 pb-3">
                        <span
                          className={`pill ${
                            placeholder ? 'pill--ghost border-dashed' : 'pill--brand'
                          }`}
                        >
                          <CalendarDays size={11} aria-hidden="true" />
                          {entry.period}
                        </span>
                        {entry.status === 'current' && (
                          <span className="pill pill--night">Sekarang</span>
                        )}
                        {placeholder && (
                          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted">
                            Menunggu detail
                          </span>
                        )}
                      </div>

                      <h3
                        className={`mt-3 font-display text-[1.35rem] font-extrabold leading-tight sm:text-[1.55rem] ${
                          placeholder ? 'text-muted' : 'text-night'
                        }`}
                      >
                        {entry.title}
                      </h3>
                      <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-brand-deep">
                        {entry.organization}
                      </p>
            <p className="mt-1 text-[13px] leading-6 text-muted">{entry.description}</p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-night/25 bg-cream px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-night/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
