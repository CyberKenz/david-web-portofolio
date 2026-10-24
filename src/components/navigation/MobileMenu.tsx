import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { navItems, profileData } from '../../data/portfolioData';
import { WhatsAppIcon } from '../common/BrandIcons';
import { buttonClass } from '../ui/buttonStyles';

interface MobileMenuProps {
  open: boolean;
  activeSection: string;
  onNavigate: (id: string) => void;
}

export function MobileMenu({ open, activeSection, onNavigate }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-x-0 top-[calc(5rem+env(safe-area-inset-top))] bottom-0 z-40 overflow-y-auto overscroll-contain bg-cream pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:top-[calc(5.5rem+env(safe-area-inset-top))] lg:hidden"
        >
          <div className="shell py-5">
            <div className="rounded-[1.75rem] border-2 border-night bg-paper p-4 shadow-[6px_6px_0_0_#242323]">
              <ul className="divide-y-2 divide-hairline">
                {navItems.map((item, index) => {
                  const active = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        aria-current={active ? 'true' : undefined}
                        className="flex min-h-16 w-full items-center justify-between gap-3 py-3 text-left"
                      >
                        <span className="flex items-center gap-3">
                          <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-brand-dark">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`font-display text-[1.65rem] font-extrabold leading-none ${
                              active ? 'text-brand-dark' : 'text-night'
                            }`}
                          >
                            {item.label}
                          </span>
                        </span>
                        <ArrowUpRight size={17} className="text-muted" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <a
              href={profileData.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('primary', 'lg', 'mt-4 w-full')}
            >
              <WhatsAppIcon size={18} />
              Tanya via WhatsApp
            </a>

            <div className="mt-4 rounded-[1.5rem] border-2 border-night bg-brand p-4 text-night shadow-[5px_5px_0_0_#242323]">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
                Lokasi latihan
              </p>
              <p className="mt-2 font-display text-xl font-extrabold">Elluna Gym &amp; MMA</p>
              <p className="text-sm font-medium">Pontianak, Kalimantan Barat</p>
              <p className="mt-2 text-[12px] leading-5">
                Personal Trainer sejak Desember 2025 sampai sekarang.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
