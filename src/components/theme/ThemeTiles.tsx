'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Check } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import { MODE_PREVIEW, THEME_TILES, cardColour, currentTile, type CardMode } from '@shared/cardTint';
import { readCardTint, setCardTint } from '@/lib/cardTint';
import styles from './ThemeTiles.module.css';

/** A small page with a card on it: the tile's page colour, card tint and a matched word. */
function Mini({ mode, card }: { mode: CardMode; card: string }) {
  const colours = MODE_PREVIEW[mode];
  return <span className={styles.page} style={{ background: colours.page }}>
    <span className={styles.card} style={{ background: card, color: colours.ink, borderColor: colours.rule }}>
      <span><b style={{ color: colours.accent }}>هُدًى</b> لِّلْمُتَّقِينَ</span>
      <span>ذَٰلِكَ ٱلْكِتَٰبُ</span>
    </span>
  </span>;
}

/** Appearance as preview tiles: light paper or lighter, device, dark or black. */
export default function ThemeTiles() {
  const ar = useLanguage().language === 'ar';
  const { theme, setTheme } = useTheme();
  const [tints, setTints] = useState<Record<CardMode, string> | null>(null);
  useEffect(() => setTints({ light: readCardTint('light'), dark: readCardTint('dark') }), []);
  if (!tints) return <div className={styles.tiles} aria-hidden />;
  const current = currentTile(theme, tints);
  const label = ar ? 'المظهر' : 'Theme';
  return <div className="flex flex-col gap-2">
    <span aria-hidden className="text-sm text-[var(--home-muted)]">{label}</span>
    <div role="group" aria-label={label} className={styles.tiles}>
      {THEME_TILES.map(tile => {
        const on = current === tile.key;
        const name = ar ? tile.ar : tile.en;
        const choose = () => {
          if (tile.mode !== 'system') { setCardTint(tile.mode, tile.key); setTints({ ...tints, [tile.mode]: tile.key }); }
          setTheme(tile.mode);
        };
        return <button key={tile.key} type="button" aria-pressed={on} title={name} onClick={choose} className={styles.tile}>
          <span className={styles.thumb} aria-hidden>
            {tile.mode === 'system'
              ? <span className={styles.split}><Mini mode="light" card={cardColour('light', tints.light)} /><Mini mode="dark" card={cardColour('dark', tints.dark)} /></span>
              : <Mini mode={tile.mode} card={cardColour(tile.mode, tile.key)} />}
            {on && <span className={styles.check}><Check size={10} strokeWidth={3} aria-hidden /></span>}
          </span>
          <span>{name}</span>
        </button>;
      })}
    </div>
  </div>;
}
