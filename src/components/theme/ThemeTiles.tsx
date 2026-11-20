'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Check } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';
import { MODE_PREVIEW, THEME_TILES, cardColour, currentTile, tintSurfaces, type CardMode } from '@shared/cardTint';
import { SAMPLE_AYAH, TILE_SHARE } from '@shared/viewPreview';
import { readCardTint, setCardTint } from '@/lib/cardTint';
import styles from './ThemeTiles.module.css';
import { MiniQuran } from '@/components/quran/text/AyahFlow';

/** A small page with a card on it: the tile's page colour, card tint and the sample ayah, its ending in the accent. */
function Mini({ mode, tint, half = false }: { mode: CardMode; tint: string; half?: boolean }) {
  const colours = MODE_PREVIEW[mode];
  const card = cardColour(mode, tint);
  return <span className={styles.page} style={{ background: tintSurfaces(mode, tint)?.paper ?? colours.page }}>
    <span className={styles.card} style={{ background: card, color: colours.ink, borderColor: colours.rule }}>
      <MiniQuran share={half ? TILE_SHARE.half : TILE_SHARE.tile}>
        <span>{SAMPLE_AYAH.start}</span>
        <span>{SAMPLE_AYAH.end} <b style={{ color: colours.accent }}>{SAMPLE_AYAH.ending}</b></span>
      </MiniQuran>
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
              ? <span className={styles.split}><Mini mode="light" tint={tints.light} half /><Mini mode="dark" tint={tints.dark} half /></span>
              : <Mini mode={tile.mode} tint={tile.key} />}
            {on && <span className={styles.check}><Check size={10} strokeWidth={3} aria-hidden /></span>}
          </span>
          <span>{name}</span>
        </button>;
      })}
    </div>
  </div>;
}
