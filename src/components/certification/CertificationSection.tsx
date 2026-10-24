import { ArrowUpRight, Award, BadgeCheck } from 'lucide-react';
import { certificationsData } from '../../data/portfolioData';
import { buttonClass } from '../ui/buttonStyles';

export function CertificationSection() {
  const [primary, extra] = certificationsData;

  return (
    <section id="sertifikasi" className="on-cream section relative overflow-hidden bg-cream-deep" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <span className="label-pill">04 // Sertifikasi</span>
            <h2 className="mt-4 max-w-[12ch] text-h2 text-night">
              Kredensial latihan<span className="text-brand">.</span>
            </h2>
            <p className="mt-4 max-w-[32ch] text-[14px] leading-6 text-muted">
              Sertifikasi yang tercatat saat ini. Detail tahun.
            </p>

            <div className="mt-6 rounded-[1.5rem] border-2 border-night bg-brand p-4 text-night shadow-[5px_5px_0_0_#242323]">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.12em]">
                Status & Tahun dokumen
              </p>
              <p className="mt-1 font-display text-[1.35rem] font-extrabold leading-tight">
                2026 - Valid Certificate
              </p>

            </div>

            <a href="#kontak" className={buttonClass('night', 'md', 'mt-4')}>
              Tanya sertifikasi
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div className="min-w-0">
            <article className="card card--lg relative rotate-[0.6deg] overflow-hidden p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-night/15 pb-3">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-brand-deep">
                  Sertifikasi utama
                </span>
                <span className="flex items-center gap-1.5 rounded-full border-2 border-night bg-cream px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-night">
                  <BadgeCheck size={12} aria-hidden="true" />
                  Tercatat
                </span>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-night bg-brand text-night shadow-[3px_3px_0_0_#242323]">
                  <Award size={23} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] font-extrabold leading-[0.95] text-night">
                    {primary.name}
                  </h3>
                  <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted">
                    {primary.issuer}
                  </p>
                </div>
              </div>

              <dl className="mt-6 grid gap-2 sm:grid-cols-3">
                {[
                  { label: 'Penerbit', value: primary.issuer },
                  { label: 'Tahun', value: primary.year },
                  { label: 'Jenis', value: 'Foundation' }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border-2 border-night bg-cream px-3 py-2">
                    <dt className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-muted">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-[12px] font-bold text-night">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-[46ch] text-[13px] leading-6 text-muted">
                  {primary.description}
                </p>
                <span
                  aria-hidden="true"
                  className="flex size-[5.5rem] shrink-0 rotate-[-10deg] items-center justify-center overflow-hidden rounded-full border-[3px] border-brand-dark bg-paper shadow-[3px_3px_0_0_#a24305]"
                >
                  <img
                    src="/logo_elluna.png"
                    alt="Elluna Gym & MMA Foundation"
                    width={72}
                    height={72}
                    className="h-full w-full object-contain p-1.5"
                  />
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-night/20 pt-3 font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-muted">
                <span>Elluna Gym Foundation</span>
              </div>
            </article>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-[1.2rem] border-2 border-dashed border-night/40 px-4 py-3">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted">
                {extra.name}
              </span>
              <span className="pill pill--ghost border-dashed">{extra.year}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
