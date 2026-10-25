import { ArrowUp, ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { contactChannels, profileData } from '../../data/portfolioData';
import { scrollToTarget } from '../../hooks/useLenisSmoothScroll';
import { InstagramIcon, WhatsAppIcon } from '../common/BrandIcons';
import { buttonClass } from '../ui/buttonStyles';

const iconMap = {
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  mail: Mail,
  pin: MapPin
} as const;

export function ContactSection() {
  const whatsapp = contactChannels.find((channel) => channel.id === 'whatsapp');
  const instagram = contactChannels.find((channel) => channel.id === 'instagram');
  const email = contactChannels.find((channel) => channel.id === 'email');

  const secondaryChannels = [instagram, email].filter(
    (channel): channel is NonNullable<typeof instagram> => Boolean(channel)
  );

  return (
    <>
      <section id="kontak" className="section relative overflow-hidden bg-night" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
        <div aria-hidden="true" className="dot-grid-dark pointer-events-none absolute inset-0 opacity-40" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-[8%] size-80 rounded-full bg-brand/25 blur-3xl"
        />

        <div className="shell relative">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
            <div>
              <span className="label-pill label-pill--night">06 // Kontak</span>
              <h2 className="mt-4 text-[clamp(2.8rem,9vw,5.5rem)] font-display font-extrabold leading-[0.92] text-cream">
                Mari mulai<span className="text-brand">.</span>
              </h2>
            </div>
            <p className="max-w-[30ch] text-[13px] leading-6 text-muted-dark md:justify-self-end md:text-right">
              Hubungi David untuk membahas tujuan latihan.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:gap-6">
            <article className="card card--lg flex flex-col justify-between bg-brand p-5 text-night shadow-[7px_7px_0_0_#fffaf2] sm:p-7">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-night/20 pb-3">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-night">
                    Kanal utama
                  </span>
                  <WhatsAppIcon size={16} />
                </div>

                <h3 className="mt-5 max-w-[12ch] font-display text-[clamp(2rem,4.5vw,3.6rem)] font-extrabold leading-[0.94]">
                  Ceritakan tujuanmu<span className="text-paper">.</span>
                </h3>
                <p className="mt-2 max-w-[42ch] text-[13px] leading-6 text-night">
                  Mulai dari target, pengalaman latihan, dan waktu yang tersedia. David akan membalas lewat WhatsApp.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={profileData.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass('night', 'lg', 'w-full sm:w-auto')}
                  >
                    <WhatsAppIcon size={17} />
                    Tanya via WhatsApp
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <dl className="mt-6 grid gap-3 border-t-2 border-night/20 pt-4 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-night bg-paper/70 px-3 py-2">
                  <dt className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-night">
                    Lokasi latihan
                  </dt>
                  <dd className="mt-1 text-[12px] font-bold">
                    {profileData.gym}, {profileData.city}
                  </dd>
                </div>
                <div className="rounded-2xl border-2 border-night bg-paper/70 px-3 py-2">
                  <dt className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-night">
                    Status
                  </dt>
                  <dd className="mt-1 text-[12px] font-bold">Personal Trainer aktif</dd>
                </div>
              </dl>
            </article>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              {whatsapp && (
                <a
                  href={whatsapp.href ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex size-14 min-h-14 min-w-14 items-center justify-center rounded-full border-2 border-night bg-brand text-night shadow-[4px_4px_0_0_#242323] transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[6px_6px_0_0_#242323]"
                >
                  <WhatsAppIcon size={24} />
                </a>
              )}

              {secondaryChannels.map((channel) => {
                const Icon = iconMap[channel.icon];
                const isInstagram = channel.id === 'instagram';
                return (
                  <a
                    key={channel.id}
                    href={channel.href ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={channel.label}
                    className={`flex size-14 min-h-14 min-w-14 items-center justify-center rounded-full border-2 border-night shadow-[4px_4px_0_0_#242323] transition-all duration-200 hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[6px_6px_0_0_#242323] ${
                      isInstagram ? 'bg-cream text-night' : 'bg-night text-cream border-cream/30'
                    }`}
                  >
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-cream/15 bg-night-deep py-7 pb-[calc(1.75rem+env(safe-area-inset-bottom))]">
        <div className="shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center overflow-hidden rounded-[10px] border-2 border-cream/40 bg-brand">
              <img
                src="/daf_logo_small.png"
                alt="David Andreas"
                width={30}
                height={30}
                className="h-full w-full object-contain p-0.5"
              />
            </span>
            <div>
              <p className="font-display text-[1.15rem] font-extrabold text-cream">David Andreas</p>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-dark">
                Personal Trainer
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <p className="text-[11px] leading-5 text-muted-dark" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToTarget(0)}
                className="flex min-h-12 items-center gap-2 rounded-full border-2 border-cream/30 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-brand hover:text-night"
              >
                Back
                <ArrowUp size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
