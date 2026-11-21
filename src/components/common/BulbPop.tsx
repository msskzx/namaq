'use client';

import styles from './BulbPop.module.css';

/**
 * A double tap's mark where the finger was: «نسيت» (`forgot`) or the save (`save`), and `on`, what it became (forgotten,
 * saved). `id` tells one pop from the next.
 */
export type Pop = { id: number; x: number; y: number; kind: 'forgot' | 'save'; on: boolean };

const BOOKMARK = 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z';

const BULB = (
  <>
    <path className={styles.glass} d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <line className={styles.strike} x1="2" y1="2" x2="22" y2="22" />
  </>
);

/**
 * The double tap's pop (owner, 2026-11-21; the app's ui/BulbPop.tsx), like the heart on a double tap: forgetting, a lit
 * yellow bulb is struck through and dims to the forgotten wine; remembering, the reverse; saving, the bookmark fills;
 * unsaving, it empties. Hidden with reduced motion.
 */
export default function BulbPop({ pop }: { pop: Pop | null }) {
  if (!pop) return null;
  const turn = pop.kind === 'forgot' ? (pop.on ? styles.forget : styles.remember) : (pop.on ? styles.save : styles.unsave);
  return (
    <div key={pop.id} className={`${styles.pop} ${turn}`} style={{ left: pop.x, top: pop.y }} aria-hidden>
      {pop.kind === 'forgot'
        ? <>
          <svg viewBox="0 0 24 24" className={styles.lit}>{BULB}</svg>
          <svg viewBox="0 0 24 24" className={styles.struck}>{BULB}</svg>
        </>
        : <svg viewBox="0 0 24 24" className={styles.saved}><path d={BOOKMARK} /><path className={styles.fill} d={BOOKMARK} /></svg>}
    </div>
  );
}
