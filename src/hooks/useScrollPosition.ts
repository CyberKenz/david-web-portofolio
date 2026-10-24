import { useEffect, useState } from 'react';
import { onLenisScroll, scrollToTarget } from './useLenisSmoothScroll';

interface ScrollState {
  scrollY: number;
  isScrolled: boolean;
  activeSection: string;
  scrollToSection: (id: string) => void;
}

function pickActiveSection(sectionIds: string[]): string {
  const focalPoint = window.scrollY + window.innerHeight * 0.38;
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48;

  if (atBottom) return sectionIds[sectionIds.length - 1] ?? 'hero';

  let active = sectionIds[0] ?? 'hero';
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el && focalPoint >= el.offsetTop) active = id;
  }
  return active;
}

export function useScrollPosition(sectionIds: string[]): ScrollState {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    let ticking = false;

    const measure = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);
      setIsScrolled(currentY > 32);
      setActiveSection(pickActiveSection(['hero', ...sectionIds]));
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const unsubscribeLenis = onLenisScroll(onScroll);
    measure();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      unsubscribeLenis();
    };
  }, [sectionIds]);

  return {
    scrollY,
    isScrolled,
    activeSection,
    scrollToSection: (id: string) => scrollToTarget(`#${id}`, -76)
  };
}
