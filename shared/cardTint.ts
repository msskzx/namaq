// Card and reading-area tint (reader pages, matrix, compare cards): one choice per light/dark mode.
// Shared by the website (src/lib/cardTint.ts) and the phone app (mobile/src/lib/settings.ts).

export const CARD_TINTS = {
  light: [
    { key: 'paper', color: '#f4ecdb', ar: 'ورقي', en: 'Paper' },
    { key: 'cream', color: '#faf5ea', ar: 'أفتح', en: 'Lighter' },
  ],
  dark: [
    { key: 'dim', color: '#242727', ar: 'داكن', en: 'Dark' },
    { key: 'black', color: '#0b0b0b', ar: 'أسود', en: 'Black' },
  ],
} as const;

/** Page colours behind each mode's preview tile (the feature palette in src/app/theme.css). */
export const MODE_PREVIEW = {
  light: { page: '#f8f6f0', ink: '#202c35', accent: '#783d49', rule: '#b9a386' },
  dark: { page: '#15191b', ink: '#edeae2', accent: '#d9a6b0', rule: '#88775f' },
} as const;

export type CardMode = keyof typeof CARD_TINTS;

/** The tint for a mode, or the first (default) one when the value is missing or unknown. */
export function parseCardTint(mode: CardMode, value: unknown): string {
  const tints = CARD_TINTS[mode];
  return tints.some(tint => tint.key === value) ? value as string : tints[0].key;
}

export const cardColour = (mode: CardMode, key: string) => CARD_TINTS[mode].find(tint => tint.key === parseCardTint(mode, key))!.color;

/** The settings sheet's theme tiles, in order: light tints, device, dark tints. */
export type ThemeTile = { key: string; mode: CardMode | 'system'; ar: string; en: string };
export const THEME_TILES: ThemeTile[] = [
  ...CARD_TINTS.light.map(({ key, ar, en }) => ({ key, mode: 'light' as const, ar, en })),
  { key: 'device', mode: 'system', ar: 'حسب الجهاز', en: 'Device' },
  ...CARD_TINTS.dark.map(({ key, ar, en }) => ({ key, mode: 'dark' as const, ar, en })),
];

/** Which tile is chosen: device when following the phone, else the chosen mode's tint. */
export const currentTile = (theme: string | undefined, tints: Record<CardMode, string>) =>
  theme === 'light' || theme === 'dark' ? parseCardTint(theme, tints[theme]) : 'device';
