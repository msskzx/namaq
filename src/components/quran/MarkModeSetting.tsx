'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import { MARK_LEGEND, MARK_MODE_NAMES, MARK_MODES, MARK_SETTING_LABEL, type MarkMode } from '@shared/quran/wordMatch';
import { readMarkMode, setMarkMode } from '@/lib/markMode';
import styles from '@/components/theme/ThemeTiles.module.css';

const COLOUR: Record<MarkMode, Record<string, string>> = {
  kinds: { exact: 'var(--home-accent)', written: 'var(--home-amber)', root: 'var(--home-root)' },
  one: { exact: 'var(--home-accent)', written: 'var(--home-accent)', root: 'var(--home-accent)' },
  none: {},
};

/** How words the ayat share are coloured (the app's MarkTiles): each tile draws the legend's words as that choice colours them. */
export default function MarkModeSetting() {
  const ar = useLanguage().language === 'ar';
  const [mode, setMode] = useState<MarkMode | null>(null);
  useEffect(() => setMode(readMarkMode()), []);
  const label = ar ? MARK_SETTING_LABEL.ar : MARK_SETTING_LABEL.en;
  const words = MARK_LEGEND.filter(item => item.kind !== 'plain');
  return <div className="flex flex-col gap-2">
    <span aria-hidden className="text-sm text-[var(--home-muted)]">{label}</span>
    <div role="group" aria-label={label} className={`${styles.tiles} ${styles.short}`}>
      {MARK_MODES.map(option => {
        const on = mode === option;
        const name = ar ? MARK_MODE_NAMES[option].ar : MARK_MODE_NAMES[option].en;
        return <button key={option} type="button" aria-pressed={on} title={name} onClick={() => { setMarkMode(option); setMode(option); }} className={styles.tile}>
          <span className={styles.thumb} aria-hidden>
            <span className={styles.words}>
              {words.map(item => <span key={item.kind} style={{ color: COLOUR[option][item.kind] }}>{item.word}</span>)}
            </span>
            {on && <span className={styles.check}><Check size={10} strokeWidth={3} aria-hidden /></span>}
          </span>
          <span>{name}</span>
        </button>;
      })}
    </div>
  </div>;
}
