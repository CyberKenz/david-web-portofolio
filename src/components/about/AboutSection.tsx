import { useRef, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { profileData } from '../../data/portfolioData';
import { RepCounter } from '../hero/RepCounter';
import { ResponsiveImage } from '../common/ResponsiveImage';

const tabs = [
  { id: 'tentang', label: 'Tentang' },
  { id: 'prinsip', label: 'Prinsip' },
  { id: 'data', label: 'Data' }
] as const;

type TabId = (typeof tabs)[number]['id'];

const facts = [
  { label: 'Nama', value: profileData.name },
  { label: 'Usia', value: `${profileData.age} tahun` },
  { label: 'Peran', value: 'Personal Trainer' },
  { label: 'Tempat', value: profileData.gym },
  { label: 'Kota', value: profileData.city },
  { label: 'Mulai', value: profileData.startPeriod }
];

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<TabId>('tentang');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    const tab = tabs[next];
    if (!tab) return;
    setActiveTab(tab.id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="tentang" className="on-cream section relative overflow-hidden bg-cream">
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-50" />

      <div className="shell relative">
        <div className="grid gap-5 border-b-2 border-night/10 pb-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-end md:gap-12">
          <div>
            <span className="label-pill">01 // Profil</span>
            <h2 className="mt-4 text-h2 text-night">
              Kenalan dulu<span className="text-brand">.</span>
            </h2>
          </div>
          <p className="max-w-[32ch] text-[14px] leading-6 text-muted md:justify-self-end">
            Personal Trainer di Elluna Gym &amp; MMA, Pontianak. Profil, prinsip latihan, dan data
            singkat.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
          <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0" data-aos="fade-right" data-aos-duration="800" data-aos-once="true">
            <span className="absolute -top-4 -right-3 z-20 flex size-[4.75rem] rotate-6 flex-col items-center justify-center rounded-full border-2 border-night bg-brand font-display text-night shadow-[4px_4px_0_0_#242323]">
              <span className="text-[1.6rem] font-extrabold leading-none">{profileData.age}</span>
              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.1em]">tahun</span>
            </span>

            <div className="card card--lg relative -rotate-1 bg-paper p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem] border-2 border-night bg-cream-deep">
                <ResponsiveImage
                  image={profileData.avatar}
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 90vw"
                  className="block h-full w-full"
                />
                <span className="absolute top-3 left-3 rounded-full border-2 border-night bg-brand px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-night shadow-[2px_2px_0_0_#242323]">
                  Personal Trainer | David Andreas
                </span>
                <span className="absolute top-3 right-3 rounded-full border-2 border-night bg-paper px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-night">
                  PT
                </span>

                <div className="absolute inset-x-3 bottom-3 rounded-[1.15rem] border-2 border-night bg-paper/95 p-3 shadow-[3px_3px_0_0_#242323]">
                  <p className="font-display text-lg font-extrabold leading-tight text-night">
                    {profileData.name}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold leading-4 text-muted">
                    Personal Trainer {profileData.gym}
                  </p>
                  <p className="mt-1 flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-brand-deep">
                    <MapPin size={10} aria-hidden="true" />
                    {profileData.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 px-2 pt-2 pb-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-muted">
                <span>Foto profil</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="pill pill--paper shadow-[2px_2px_0_0_#242323]">
                Elluna Gym &amp; MMA
              </span>
              <span className="pill pill--brand shadow-[2px_2px_0_0_#242323]">
                Sejak Des 2025
              </span>
            </div>
          </div>

          <div className="card card--lg min-w-0 p-4 sm:p-6 lg:p-7">
            <div role="tablist" aria-label="Profil David" className="flex flex-wrap gap-2">
              {tabs.map((tab, index) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={`min-h-11 rounded-full border-2 border-night px-4 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${
                      selected
                        ? 'bg-brand text-night shadow-[2px_2px_0_0_#242323]'
                        : 'bg-paper text-muted hover:bg-cream-deep hover:text-night'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              className="mt-5 min-h-[19rem]"
            >
              {activeTab === 'tentang' && (
                <div className="space-y-3.5">
                  {profileData.aboutParagraphs.map((paragraph, index) => (
                    <p
                      key={paragraph}
                      className={
                        index === 0
                          ? 'max-w-[58ch] text-[16px] font-medium leading-7 text-night'
                          : 'max-w-[58ch] text-[14px] leading-6 text-muted'
                      }
                    >
                      {paragraph}
                    </p>
                  ))}

                </div>
              )}

              {activeTab === 'prinsip' && (
                <ul className="divide-y-2 divide-hairline">
                  {profileData.principles.map((principle, index) => (
                    <li key={principle} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-night bg-brand font-mono text-[10px] font-bold text-night">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="font-display text-[1.1rem] font-extrabold leading-tight text-night">
                          {principle}
                        </p>
                        <p className="mt-1 text-[13px] leading-6 text-muted">
                          Prinsip kerja yang dipakai untuk menyusun arah latihan.
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'data' && (
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="rounded-2xl border-2 border-night bg-cream px-3 py-2.5"
                    >
                      <dt className="font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-muted">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-[13px] font-bold leading-snug text-night">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                  <div className="col-span-2 rounded-2xl border-2 border-night bg-brand px-3 py-2.5 text-night sm:col-span-3">
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.1em]">
                      Sertifikasi
                    </p>
                    <p className="mt-1 text-[13px] font-bold">Elluna Gym Foundation</p>
                  </div>
                </dl>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-night/10 pt-4">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted">
                Sertifikasi: Elluna Gym Foundation
              </span>
              <a href="#perjalanan" className="link-underline min-h-11 py-2 text-[12px] uppercase tracking-[0.08em]">
                Lihat perjalanan
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="card card--lg mt-8 bg-brand p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-night">
                Latihan interaktif
              </p>
              <h3 className="mt-1 font-display text-[1.6rem] font-extrabold leading-none text-night">
                Coba hitung rep<span className="text-paper">.</span>
              </h3>
            </div>
            <p className="max-w-[34ch] text-[13px] leading-6 text-night">
              Tarik pelat 25 kg melewati garis target lalu kembali ke tengah. Satu putaran, satu rep.
            </p>
          </div>
          <div className="rounded-[1.2rem] border-2 border-night bg-paper p-4 shadow-[4px_4px_0_0_#242323]">
            <RepCounter />
          </div>
        </div>
      </div>
    </section>
  );
}
