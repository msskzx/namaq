import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { cardColour } from '@shared/cardTint';
import type { ConnectionTone } from '@shared/quran/mutashabih/connections';
import { cardTints, themeChoice } from './settings';

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
  /** The prophets timeline's five phase colours, in the website's order (blue, amber, rose, green, violet), muted to this palette. */
  phases: ['#426578', '#8a6420', '#783d49', '#506449', '#665177'],
  /** The website's --home-slot-1…4: the word-connection colours. */
  slots: ['#426578', '#617047', '#665177', '#806239'],
  /** The see-through top and bottom bars: a tint over the blurred page, and a faint edge. */
  glass: '#f8f6f0b8',
  glassEdge: '#202c351f',
  scheme: 'light' as 'light' | 'dark',
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
  phases: ['#a9c4d1', '#dcb46e', '#d9a6b0', '#b1c59f', '#c3afd5'],
  slots: ['#a9c4d1', '#b1c59f', '#c3afd5', '#dcc5a0'],
  glass: '#242727b3',
  glassEdge: '#edeae21a',
  scheme: 'dark',
};

export const QURAN_FONT = 'KFGQPC Hafs';
/** Every other text (labels, buttons, titles) is in Amiri, as on the website. Bold is its own file: custom fonts don't synthesise weights the same way on every phone. */
export const UI_FONT = 'Amiri';
export const UI_FONT_BOLD = 'Amiri-Bold';

export function usePalette(): Palette {
  const scheme = useColorScheme();
  const [choice] = themeChoice.use();
  const [tints] = cardTints.use();
  const isDark = choice === 'system' ? scheme === 'dark' : choice === 'dark';
  const card = isDark ? cardColour('dark', tints.dark) : cardColour('light', tints.light);
  // Cards and reading areas take the tint chosen on the theme tiles; the page stays as it is.
  return useMemo(() => ({ ...(isDark ? dark : light), card }), [isDark, card]);
}

/** Joined و is green and joined ف purple, as on the website's trees. */
export const toneOf = (palette: Palette, conj: string | undefined) => conj === 'و' ? palette.green : conj === 'ف' ? palette.root : palette.ink;

/** Halfway between two colours, for marks that share only a root: a faint purple, as on the website. */
export function blend(a: string, b: string, weight: number) {
  const parts = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const [x, y] = [parts(a), parts(b)];
  return `#${x.map((value, i) => Math.round(value * weight + y[i] * (1 - weight)).toString(16).padStart(2, '0')).join('')}`;
}

/** A kind of difference's colour for its connection lines and chip, as on the website. */
export function toneColor(palette: Palette, tone: ConnectionTone) {
  if (tone === 'root' || tone === 'green' || tone === 'muted') return palette[tone];
  return palette.slots[Number(tone.slice(4)) - 1];
}
