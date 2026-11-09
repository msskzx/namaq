import { useColorScheme } from 'react-native';

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
  // A lit word and its partner on the compare cards.
  highlight: '#dcc5a0',
  onHighlight: '#202c35',
  /** The prophets timeline's five phase colours, in the website's order (blue, amber, rose, green, violet), muted to this palette. */
  phases: ['#426578', '#8a6420', '#783d49', '#506449', '#665177'],
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
  highlight: '#dcc5a0',
  onHighlight: '#202c35',
  phases: ['#a9c4d1', '#dcb46e', '#d9a6b0', '#b1c59f', '#c3afd5'],
};

export const QURAN_FONT = 'KFGQPC Hafs';

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

/** Joined و is green and joined ف purple, as on the website's trees. */
export const toneOf = (palette: Palette, conj: string | undefined) => conj === 'و' ? palette.green : conj === 'ف' ? palette.root : palette.ink;
