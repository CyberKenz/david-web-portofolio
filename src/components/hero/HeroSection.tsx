import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { profileData } from '../../data/portfolioData';
import { WhatsAppIcon } from '../common/BrandIcons';
import { buttonClass } from '../ui/buttonStyles';
import { HeroReel } from './HeroReel';
import { HeroScene } from './HeroScene';

const facts = ['19 tahun', 'Elluna Gym & MMA', '05 spesialisasi'];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="hero-field on-brand relative isolate min-h-[100svh] overflow-hidden pt-[calc(6rem+env(safe-area-inset-top))] text-night sm:pt-[calc(7rem+env(safe-area-inset-top))]"
    >
      <HeroScene />

      <div className="shell relative z-10">
        <div className="mx-auto flex min-h-[calc(100svh-11rem)] max-w-4xl flex-col items-center justify-center py-8 text-center sm:py-12">
          <span className="label-pill label-pill--paper" data-aos="fade-down" data-aos-duration="700" data-aos-once="true">Personal Trainer</span>

          <h1 className="mt-6 font-jember-sketch text-hero uppercase text-paper text-hard-shadow" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
            David
            <br />
            Andreas
          </h1>

          <p className="mt-6 max-w-[24ch] font-display text-[1.4rem] font-extrabold leading-tight text-night sm:text-[1.7rem]" data-aos="fade-up" data-aos-delay="200" data-aos-duration="700" data-aos-once="true">
            {profileData.tagline}
          </p>
          <p className="mt-3 max-w-xl text-[14px] font-medium leading-6 text-night sm:text-[15px]" data-aos="fade-up" data-aos-delay="300" data-aos-duration="700" data-aos-once="true">
            {profileData.intro}
          </p>

          <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center" data-aos="fade-up" data-aos-delay="400" data-aos-duration="700" data-aos-once="true">
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
            <a
              href="#spesialisasi"
              className={buttonClass('paper', 'lg', 'w-full sm:w-auto')}
            >
              Lihat spesialisasi
              <ArrowDown size={15} aria-hidden="true" />
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-2" data-aos="fade-up" data-aos-delay="500" data-aos-duration="700" data-aos-once="true">
            {facts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border-2 border-night bg-paper px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.09em] text-night shadow-[3px_3px_0_0_#242323]"
              >
                {fact}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-start justify-center gap-4 sm:flex-row sm:items-start sm:justify-center lg:items-center xl:hidden">
            <HeroReel src="/assets/img/david_no_outfit.jpeg" caption="Reel / 01" />
            <HeroReel src="/assets/img/david_no_outfit_2.jpeg" caption="Reel / 02" className="sm:rotate-[-3deg]" />
          </div>
        </div>
      </div>

      <div className="absolute right-[4%] bottom-[13%] z-10 hidden xl:flex xl:flex-col xl:gap-4">
        <HeroReel src="/assets/img/david_no_outfit.jpeg" caption="Reel / 01" />
        <HeroReel src="/assets/img/david_no_outfit_2.jpeg" caption="Reel / 02" className="rotate-[-3deg]" />
      </div>

      <a
        href="#tentang"
        className="absolute bottom-5 left-1/2 z-10 hidden min-h-11 -translate-x-1/2 items-center gap-2 px-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-night transition-colors hover:text-night sm:flex"
      >
        Scroll
        <ArrowDown size={14} aria-hidden="true" />
      </a>
    </section>
  );
}
