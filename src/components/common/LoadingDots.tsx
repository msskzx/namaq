'use client';

import { useLanguage } from '../language/LanguageContext';
import styles from './LoadingDots.module.css';

/**
 * The one loader, as in the app: three dots like the logo's berries, each swelling and fading in turn.
 * Inline where something small is coming; `fill` centres it in the room it is given (a list, a panel),
 * `fill="page"` holds a page's height while the page loads. `className` is for its place only.
 */
export default function LoadingDots({ className = '', label, fill = false }: { className?: string; label?: string; fill?: boolean | 'page' }) {
  const ar = useLanguage().language === 'ar';
  const dots = (
    <span role="status" className={`${styles.dots} ${fill ? 'text-xl' : className}`}>
      <span aria-hidden className={styles.dot} />
      <span aria-hidden className={styles.dot} />
      <span aria-hidden className={styles.dot} />
      <span className="sr-only">{label ?? (ar ? 'جارٍ التحميل' : 'Loading')}</span>
    </span>
  );
  if (!fill) return dots;
  return <div className={`flex w-full flex-1 items-center justify-center ${fill === 'page' ? 'min-h-[60vh]' : 'min-h-24'} ${className}`}>{dots}</div>;
}
