import { useEffect, useState } from 'react';
import { profileData } from '../../data/portfolioData';
import { WhatsAppIcon } from './BrandIcons';

/**
 * Floating CTA. Hidden while the hero, gallery, or contact section is on
 * screen, where another primary action is already visible.
 */
export function FloatingWhatsApp() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = ['hero', 'galeri', 'kontak']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!targets.length) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        setHidden(visible.size > 0);
      },
      { threshold: 0.02 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={profileData.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi David Andreas via WhatsApp"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : 0}
      className={`fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex min-h-14 items-center gap-2 rounded-full border-2 border-night bg-brand px-4 text-night shadow-[4px_4px_0_0_#242323] transition-[opacity,background-color,color] duration-200 hover:bg-paper focus-visible:outline-night active:translate-x-[2px] active:translate-y-[2px] active:shadow-none sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <WhatsAppIcon size={20} />
    </a>
  );
}
