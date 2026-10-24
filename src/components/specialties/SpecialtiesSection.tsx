import { Activity, ArrowRight, Dumbbell, Flame, Move, Weight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { specializationsData } from '../../data/portfolioData';
import type { Specialization } from '../../types/portfolio';
import { buttonClass } from '../ui/buttonStyles';

const iconMap: Record<Specialization['icon'], LucideIcon> = {
  muscle: Dumbbell,
  fatloss: Flame,
  basic: Activity,
  strength: Weight,
  functional: Move
};

const spanClasses = [
  'md:col-span-2 lg:col-span-4',
  'md:col-span-1 lg:col-span-2',
  'md:col-span-1 lg:col-span-2',
  'md:col-span-1 lg:col-span-2',
  'md:col-span-1 lg:col-span-2'
];

export function SpecialtiesSection() {
  return (
    <section id="spesialisasi" className="section relative overflow-hidden bg-night" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
      <div aria-hidden="true" className="dot-grid-dark pointer-events-none absolute inset-0 opacity-45" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[8%] size-64 rounded-full bg-brand/25 blur-3xl"
      />

      <div className="shell relative">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
          <div>
            <span className="label-pill label-pill--night">02 // Spesialisasi</span>
            <h2 className="mt-4 max-w-[14ch] text-h2 text-cream">
              Lima area latihan<span className="text-brand">.</span>
            </h2>
          </div>
          <div className="md:max-w-[30ch] md:justify-self-end md:text-right">
          <p className="text-[13px] leading-6 text-muted-dark">
            Fokus latihan yang dijalani David sebagai Personal Trainer di Elluna Gym &amp; MMA.
          </p>
          <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
            01 05
          </p>
          </div>
        </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {specializationsData.map((item, index) => {
            const Icon = iconMap[item.icon];
            const isBrand = index === 0;

            return (
              <article className={`card card--lg ${spanClasses[index] ?? 'lg:col-span-2'} ${
                  isBrand
                    ? 'card card--lg card--brand card-hover flex flex-col justify-between p-4 shadow-[7px_7px_0_0_#f7efe3] sm:p-6 lg:min-h-[19rem]'
                    : 'card card--lg card--dark-section card-hover flex flex-col justify-between p-4 sm:p-5'
                }`}>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex size-11 items-center justify-center rounded-full border-2 border-night ${
                        isBrand ? 'bg-night text-brand' : 'bg-brand text-night'
                      }`}
                    >
                      <Icon size={19} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span
                      className={`rounded-full border-2 border-night px-2 py-1 font-mono text-[9px] font-bold tracking-[0.1em] ${
                        isBrand ? 'bg-night text-cream' : 'bg-cream text-night'
                      }`}
                    >
                      {item.index}
                    </span>
                  </div>

                  <p
                    className={`mt-4 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${
                      isBrand ? 'text-night' : 'text-muted'
                    }`}
                  >
                    {item.englishTitle}
                  </p>
                  <h3
                    className={`mt-1 font-display font-extrabold leading-[0.95] ${
                      isBrand ? 'text-[2rem] text-night sm:text-[2.4rem]' : 'text-[1.45rem] text-night'
                    }`}
                  >
                    {item.title}
                  </h3>
            <p className="mt-2 text-[13px] leading-6 text-muted-dark">
              {item.description}
            </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.points.map((point) => (
                    <span
                      key={point}
                      className={`rounded-full border border-night/35 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.08em] ${
                        isBrand ? 'bg-night/10 text-night' : 'bg-cream text-night/75'
                      }`}
                    >
                      {point}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-[52ch] text-[13px] leading-6 text-muted-dark">
            Belum yakin mulai dari mana? Ceritakan tujuan dan kondisimu lewat WhatsApp.
          </p>
          <a href="#kontak" className={buttonClass('primary', 'md', 'min-h-12')}>
            Diskusi dulu
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
