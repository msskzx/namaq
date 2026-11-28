import { useColorScheme } from 'react-native';
import { createContext, useContext, useMemo } from 'react';
import { cardColour, tintSurfaces } from '@shared/cardTint';
import type { ConnectionTone } from '@shared/quran/mutashabih/connections';
import { markTones, type Likeness } from '@shared/quran/wordMatch';
import { cardTints, markMode, themeChoice } from './settings';

// see docs/palette.md
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
  highlight: '#dcc5a0',
  onHighlight: '#202c35',
  bands: { mark: '#202c351a', forgot: '#f6dc9a', playing: '#dcc5a0', word: '#eebcc2' },
  phases: ['#426578', '#8a6420', '#783d49', '#506449', '#665177'],
  slots: ['#426578', '#617047', '#665177', '#806239'],
  glass: '#f8f6f0b8',
  glassEdge: '#202c351f',
  scheme: 'light' as 'light' | 'dark',
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
  bands: { mark: '#edeae21a', forgot: '#783d4973', playing: '#dcc5a059', word: '#783d49d9' },
  phases: ['#a9c4d1', '#dcb46e', '#d9a6b0', '#b1c59f', '#c3afd5'],
  slots: ['#a9c4d1', '#b1c59f', '#c3afd5', '#dcc5a0'],
  glass: '#242727b3',
  glassEdge: '#edeae21a',
  scheme: 'dark',
  marks: { exact: '#d9a6b0', written: '#dcc5a0', root: '#c3afd5' },
};

export const DAY_SKY = { night: '#0c0f1a', glow: '#8a5a4a', day: '#dcc5a0', twilight: '#6d6a78' };

export const SEA_ART = {
  sky: ['#16222c', '#46606e', '#808f96'], glow: '#e1ecec', deep: ['#2c4654', '#0a161e', '#010203'], ray: '#96bece',
  speck: '#aac8d4', crest: '#aac6d2', glint: '#f0ecdc', wave: ['#5c808c', '#304e5c', '#0e1e28', '#020507'], foam: '#e6f2f5',
  cloud: ['#080c0f', '#1e282f', '#46585f'], underlight: '#bed2d7',
  rim: ['#e1f0f4', '#ebf5f7', '#d7e6ea'],
  gold: '#f0d29e', ink: '#ece4d4', muted: '#9a948a', source: '#7d776e', dotRule: 'rgba(236,228,212,0.3)',
  black: '#000', backing: 'rgba(0,0,0,0.45)',
  clear: '#00000000', vignette: '#0000008c',
  thumb: { sky: ['#05080b', '#14222c', '#1f3644', '#03070a'], haze: '#7fa3b5', cloud: ['#0a0e11', '#2b3a43'], mist: '#33454f',
    wave: ['#0e1b23', '#081218'], edge: ['#9fbccb', '#6d8a99'], badge: 'rgba(0,0,0,0.75)', badgeInk: '#fff' },
} as const;

export const RAHMAN_PAPER: Palette = { ...light, paper: '#f3ead8', paperDeep: '#eadcc2', card: '#f3ead8', ink: '#2b2620', muted: '#7a6e5c',
  rule: '#cdbd9c', accent: '#a8432d' };
export const RAHMAN_ART = { table: '#2a2724', frame: '#b9a888', title: '#8a5a2e', mark: '#d9ccb2', lit: '#2f6b5e' } as const;

export const CARD = { borderRadius: 14 } as const;

export { QURAN_FONT, UI_FONT, UI_FONT_BOLD } from './fonts';

const Forced = createContext<Palette | null>(null);
export const ForcePalette = Forced.Provider;

export function usePalette(): Palette {
  const scheme = useColorScheme();
  const [choice] = themeChoice.use();
  const [tints] = cardTints.use();
  const [mode] = markMode.use();
  const isDark = choice === 'system' ? scheme === 'dark' : choice === 'dark';
  const card = isDark ? cardColour('dark', tints.dark) : cardColour('light', tints.light);
  const surfaces = isDark ? tintSurfaces('dark', tints.dark) : tintSurfaces('light', tints.light);
  const palette = useMemo(() => {
    const base = isDark ? dark : light;
    const page = surfaces ? { ...surfaces, glass: `${surfaces.paperDeep}b3` } : null;
    return { ...base, ...page, card, marks: markTones(mode, { exact: base.accent, written: base.amber, root: base.root }) };
  }, [isDark, card, surfaces, mode]);
  return useContext(Forced) ?? palette;
}

export const toneOf = (palette: Palette, conj: string | undefined) => conj === 'و' ? palette.green : conj === 'ف' ? palette.root : palette.ink;

export { blend } from '@shared/quran/compareCardLook';

export function toneColor(palette: Palette, tone: ConnectionTone) {
  if (tone === 'root' || tone === 'green' || tone === 'muted') return palette[tone];
  return palette.slots[Number(tone.slice(4)) - 1];
}
