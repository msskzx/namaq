'use client';

import { useLanguage } from '../language/LanguageContext';
import styles from './LoadingDots.module.css';

// Three dots like the logo's berries, each swelling and fading in turn: the small loader for inline waits.
export default function LoadingDots({ className = '', label }: { className?: string; label?: string }) {
  const ar = useLanguage().language === 'ar';
  return (
    <span role="status" className={`${styles.dots} ${className}`}>
      <span aria-hidden className={styles.dot} />
      <span aria-hidden className={styles.dot} />
      <span aria-hidden className={styles.dot} />
      <span className="sr-only">{label ?? (ar ? 'جارٍ التحميل' : 'Loading')}</span>
    </span>
  );
}
