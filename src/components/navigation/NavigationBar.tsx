import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems, profileData } from '../../data/portfolioData';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { startLenisScroll, stopLenisScroll } from '../../hooks/useLenisSmoothScroll';
import { WhatsAppIcon } from '../common/BrandIcons';
import { buttonClass } from '../ui/buttonStyles';
import { MobileMenu } from './MobileMenu';

const SECTION_IDS = navItems.map((item) => item.id);
const DARK_SECTIONS = new Set(['spesialisasi', 'galeri', 'kontak']);

export function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeSection, scrollToSection } = useScrollPosition(SECTION_IDS);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    stopLenisScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      startLenisScroll();
    };
  }, [menuOpen]);

  const goTo = (id: string) => {
    const wasOpen = menuOpen;
    setMenuOpen(false);
    if (wasOpen) {
      window.requestAnimationFrame(() => scrollToSection(id));
    } else {
      scrollToSection(id);
    }
  };

  const onDark = DARK_SECTIONS.has(activeSection);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-20 items-center justify-between gap-3 px-4 sm:h-[5.5rem] sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => goTo('hero')}
            className="flex min-h-12 items-center gap-2.5 text-left"
            aria-label="David Andreas, kembali ke atas"
          >
            <span className="flex size-10 items-center justify-center overflow-hidden rounded-[10px] border-2 border-night bg-brand shadow-[3px_3px_0_0_#242323] sm:size-11">
              <img
                src="/daf_logo.png"
                alt="David Andreas"
                width={44}
                height={44}
                className="h-full w-full object-contain p-0.5"
              />
            </span>
            <span className="leading-none">
              <span
                className={`hidden whitespace-nowrap font-angels text-[16px] tracking-wide transition-colors sm:block sm:text-[18px] drop-shadow-[0_1px_2px_rgba(247,239,227,0.8)] ${
                  onDark ? 'text-cream drop-shadow-[0_1px_3px_rgba(36,35,35,0.9)]' : 'text-night'
                }`}
                style={{ textShadow: onDark ? '0 1px 3px rgba(36,35,35,0.9), 0 0 8px rgba(36,35,35,0.5)' : '0 1px 2px rgba(247,239,227,0.9)' }}
              >
                David Andreas
              </span>
              <span
                className={`mt-1 hidden font-mono text-[9px] font-bold uppercase tracking-[0.16em] transition-colors sm:block ${
                  onDark ? 'text-cream/90 drop-shadow-[0_1px_2px_rgba(36,35,35,0.9)]' : 'text-night'
                }`}
                style={{ textShadow: onDark ? '0 1px 2px rgba(36,35,35,0.9)' : '0 1px 2px rgba(247,239,227,0.9)' }}
              >
                Personal Trainer
              </span>
            </span>
          </button>

          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-1 rounded-full border-2 border-night bg-paper p-1.5 shadow-[4px_4px_0_0_#242323] lg:flex"
          >
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.id)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex min-h-12 items-center rounded-full px-4 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${
                    active
                      ? 'bg-brand text-night'
                      : 'text-muted hover:bg-cream-deep hover:text-night'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={profileData.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={buttonClass('night', 'md', 'hidden min-h-12 sm:inline-flex')}
            >
              <WhatsAppIcon size={16} />
            </a>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              className="flex size-12 min-h-12 min-w-12 items-center justify-center rounded-full border-2 border-night bg-paper text-night shadow-[3px_3px_0_0_#242323] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none lg:hidden"
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} activeSection={activeSection} onNavigate={goTo} />
    </>
  );
}
