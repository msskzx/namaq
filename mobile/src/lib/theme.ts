import { useColorScheme } from 'react-native';
import { createContext, useContext, useMemo } from 'react';
import { cardColour, tintSurfaces } from '@shared/cardTint';
import type { ConnectionTone } from '@shared/quran/mutashabih/connections';
import { markTones, type Likeness } from '@shared/quran/wordMatch';
import { cardTints, markMode, themeChoice } from './settings';

// The branches pages' palette on the website (src/app/theme.css, docs/palette.md).
export const light = {
  paper: '#f8f6f0',
  paperDeep: '#eee8da',
  card: '#f4ecdb',
  ink: '#202c35',
  muted: '#62645e',
  rule: '#b9a386',
  accent: '#783d49',
  onAccent: '#fff9f0',
  root: '#665177',
  green: '#506449',
  path: '#426578',
  amber: '#806239',
  // A lit word and its partner on the compare cards.
  highlight: '#dcc5a0',
  onHighlight: '#202c35',
  /** The reader's ayah bands over the card (theme.css --home-band-*): the selected ayah, a forgotten one, the one recited aloud, the long-pressed word over its band. */
  // Bright bands on paper (owner, 2026-11-17): a forgotten ayah amber, the pressed word rose. The ayah recited aloud is the
  // theme's yellow (`highlight`), never the forgotten band's colour (owner, 2026-11-20).
  bands: { mark: '#202c351a', forgot: '#f6dc9a', playing: '#dcc5a0', word: '#eebcc2' },
  /** The prophets timeline's five phase colours, in the website's order (blue, amber, rose, green, violet), muted to this palette. */
  phases: ['#426578', '#8a6420', '#783d49', '#506449', '#665177'],
  /** The website's --home-slot-1…4: the word-connection colours. */
  slots: ['#426578', '#617047', '#665177', '#806239'],
  /** The see-through top and bottom bars: a tint over the blurred page, and a faint edge. */
  glass: '#f8f6f0b8',
  glassEdge: '#202c351f',
  scheme: 'light' as 'light' | 'dark',
  /** Words the ayat share, by how alike they are (shared/quran/wordMatch.ts); the colour setting can leave some out. */
  marks: { exact: '#783d49', written: '#806239', root: '#665177' } as Partial<Record<Likeness, string>>,
};

export type Palette = typeof light;

export const dark: Palette = {
  paper: '#15191b',
  paperDeep: '#242727',
  card: '#242727',
  ink: '#edeae2',
  muted: '#c0b7a8',
  rule: '#88775f',
  accent: '#d9a6b0',
  onAccent: '#15191b',
  root: '#c3afd5',
  green: '#b1c59f',
  path: '#a9c4d1',
  amber: '#dcc5a0',
  highlight: '#dcc5a0',
  onHighlight: '#202c35',
  // Deep wine bands keep the light ink readable; a light wash over a dark card greys it (owner, 2026-11-17). The ayah recited
  // aloud is the theme's yellow (`highlight`) at 35%, the ink still 5.4:1 on it (owner, 2026-11-20: not the forgotten wine).
  bands: { mark: '#edeae21a', forgot: '#783d4973', playing: '#dcc5a059', word: '#783d49d9' },
  phases: ['#a9c4d1', '#dcb46e', '#d9a6b0', '#b1c59f', '#c3afd5'],
  slots: ['#a9c4d1', '#b1c59f', '#c3afd5', '#dcc5a0'],
  glass: '#242727b3',
  glassEdge: '#edeae21a',
  scheme: 'dark',
  marks: { exact: '#d9a6b0', written: '#dcc5a0', root: '#c3afd5' },
};

/**
 * The «مشاهد» sea's picture (owner, 2026-11-21): the same in both themes, as a picture is; the darkness over it is black.
 * Drawn shapes until the owner's own art comes.
 */
export const SEA_ART = {
  // The sea of an-Nur 40 (components/scenes/SeaArt), one dark world whatever the theme: dusk sky down to the black.
  sky: ['#16222c', '#46606e', '#808f96'], glow: '#e1ecec', deep: ['#2c4654', '#0a161e', '#010203'], ray: '#96bece',
  speck: '#aac8d4', crest: '#aac6d2', glint: '#f0ecdc', wave: ['#5c808c', '#304e5c', '#0e1e28', '#020507'], foam: '#e6f2f5',
  cloud: ['#080c0f', '#1e282f', '#46585f'], underlight: '#bed2d7',
  /** The scene's words: the ayah's in gold (the edge of the newest layer takes it too), the sayings' in ink. */
  gold: '#f0d29e', ink: '#ece4d4', muted: '#9a948a', source: '#7d776e', dotRule: 'rgba(236,228,212,0.3)',
  /** The night it ends in, and the shade behind words over a bright sky. */
  black: '#000', backing: 'rgba(0,0,0,0.45)',
  /** The card's still (components/scenes/SeaThumb): the stormy night. */
  thumb: { sky: ['#05080b', '#14222c', '#1f3644', '#03070a'], haze: '#7fa3b5', cloud: ['#0a0e11', '#2b3a43'], mist: '#33454f',
    wave: ['#0e1b23', '#081218'], edge: ['#9fbccb', '#6d8a99'], badge: 'rgba(0,0,0,0.75)', badgeInk: '#fff' },
} as const;

/** A colour from its parts, for a drawing that mixes colours frame by frame (components/scenes/SeaArt). */
export function colourOf(r: number, g: number, b: number, a: number) {
  'worklet';
  return `rgba(${r | 0},${g | 0},${b | 0},${a})`;
}

/** Every card's corners, tree nodes included: one round radius (owner, 2026-11-13). */
export const CARD = { borderRadius: 14 } as const;

export { QURAN_FONT, UI_FONT, UI_FONT_BOLD } from './fonts';

const Forced = createContext<Palette | null>(null);
/** Draws what it wraps in one palette whatever the theme: a scene is always night (components/DarkSea). */
export const ForcePalette = Forced.Provider;

export function usePalette(): Palette {
  const scheme = useColorScheme();
  const [choice] = themeChoice.use();
  const [tints] = cardTints.use();
  const [mode] = markMode.use();
  const isDark = choice === 'system' ? scheme === 'dark' : choice === 'dark';
  const card = isDark ? cardColour('dark', tints.dark) : cardColour('light', tints.light);
  const surfaces = isDark ? tintSurfaces('dark', tints.dark) : tintSurfaces('light', tints.light);
  // Cards and reading areas take the tint chosen on the theme tiles; the page stays as it is.
  const palette = useMemo(() => {
    const base = isDark ? dark : light;
    const page = surfaces ? { ...surfaces, glass: `${surfaces.paperDeep}b3` } : null;
    return { ...base, ...page, card, marks: markTones(mode, { exact: base.accent, written: base.amber, root: base.root }) };
  }, [isDark, card, surfaces, mode]);
  return useContext(Forced) ?? palette;
}

/** Joined و is green and joined ف purple, as on the website's trees. */
export const toneOf = (palette: Palette, conj: string | undefined) => conj === 'و' ? palette.green : conj === 'ف' ? palette.root : palette.ink;

/** Halfway between two colours, for marks that share only a root: a faint purple, as on the website. */
export { blend } from '@shared/quran/compareCardLook';

/** A kind of difference's colour for its connection lines and chip, as on the website. */
export function toneColor(palette: Palette, tone: ConnectionTone) {
  if (tone === 'root' || tone === 'green' || tone === 'muted') return palette[tone];
  return palette.slots[Number(tone.slice(4)) - 1];
}
