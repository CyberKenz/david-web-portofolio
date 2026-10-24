import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let globalLenisInstance: Lenis | null = null;
const scrollListeners = new Set<(lenis: Lenis) => void>();

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(reducedMotionQuery).matches;
}

export function getLenisInstance(): Lenis | null {
  return globalLenisInstance;
}

export function stopLenisScroll(): void {
  globalLenisInstance?.stop();
}

export function startLenisScroll(): void {
  globalLenisInstance?.start();
}

export function onLenisScroll(callback: (lenis: Lenis) => void): () => void {
  scrollListeners.add(callback);
  globalLenisInstance?.on('scroll', callback);
  return () => {
    scrollListeners.delete(callback);
    globalLenisInstance?.off('scroll', callback);
  };
}

export function scrollToTarget(target: string | number | HTMLElement, offset: number = -88): void {
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';

  if (typeof target === 'number') {
    if (globalLenisInstance) globalLenisInstance.scrollTo(target, { duration: 0.9 });
    else window.scrollTo({ top: target, behavior });
    return;
  }

  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;

  // Resolve to a number so CSS scroll-margin and Lenis offsets do not stack.
  const top = el.getBoundingClientRect().top + window.pageYOffset + offset;

  if (globalLenisInstance) globalLenisInstance.scrollTo(top, { duration: 0.9 });
  else window.scrollTo({ top, behavior });
}

/**
 * Smooth scroll only when the user has not asked for reduced motion.
 * Lenis is fully destroyed while the media query matches, so native scroll
 * (and anchor behaviour) takes over.
 */
export function useLenisSmoothScroll(): void {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia(reducedMotionQuery);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true
    });

    globalLenisInstance = lenis;
    scrollListeners.forEach((listener) => lenis.on('scroll', listener));

    return () => {
      scrollListeners.forEach((listener) => lenis.off('scroll', listener));
      lenis.destroy();
      globalLenisInstance = null;
    };
  }, [reduced]);
}
