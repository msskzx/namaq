import type { Beat } from './growth';
import { growthState } from './growPlayer';
import { VIDEO_TYPES, type TreeScene, type VideoAyah, type VideoInput } from './scene';
import { logoUrl } from './logo';
import type { Palette } from './theme';
import { UI_FONT } from './fonts';
import { QURAN_FAMILY } from '@/components/quran/text/quranFont';
import { ayahOf, matrixOf, rowOf, NOTHING_SHARED, readId, surahNames, type MatrixAyah, type Presentation } from './branches';
import { sharedTone } from './marks';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';

const mix = (a: string, b: string, t: number) => {
  const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2].map(i => Math.round(channel(a, i) * t + channel(b, i) * (1 - t)).toString(16).padStart(2, '0')).join('')}`;
};

export function videoAyat(beats: Beat[], presentation: Presentation | undefined, palette: Palette): VideoAyah[] {
  const matrix = presentation && matrixOf(presentation, false);
  return [...new Set(beats.map(beat => beat.key).filter(Boolean))].map(key => {
    const [surah, number] = key.split(':').map(Number);
    const found = matrix ? rowOf(matrix, key) : null;
    const r = found?.r ?? -1;
    const row: MatrixAyah[] = found?.row.ayah?.ayat ?? [{ key, page: 0, words: ayahOf(key)?.words ?? [], ...NOTHING_SHARED }];
    const words = row.flatMap(ayah => [
      ...ayah.words.map((word, i) => {
        const color = sharedTone(palette, ayah, i) ?? palette.ink;
        return { text: mushafText(word), color, id: readId(r, ayah.key, i) };
      }),
      { text: num(Number(ayah.key.split(':')[1])), color: palette.accent, end: true },
    ]);
    const [lastSurah, last] = row[row.length - 1].key.split(':').map(Number);
    const name = surahNames[surah] ?? num(surah);
    const label = lastSurah !== surah ? `الآية ${num(number)} ثم سورة ${surahNames[lastSurah]} ${num(last)}` : row.length > 1 ? `الآيات ${num(number)}–${num(last)}` : `الآية ${num(number)}`;
    return { key, chip: `${name} ${num(number)}`, name, label, words };
  });
}

export function treeVideo(scene: TreeScene, beats: { watch: Beat[]; ask: Beat[] }, palette: Palette, presentation?: Presentation): VideoInput {
  const state = growthState();
  const played = state.mode === 'ask' ? beats.ask : beats.watch;
  return { scene, beats: played, ayat: videoAyat(played, presentation, palette), speed: state.speed, ask: state.mode === 'ask', timer: state.timer, types: VIDEO_TYPES,
    look: { paper: palette.paper, ink: palette.ink, muted: palette.muted, rule: palette.rule, accent: palette.accent, path: palette.path, green: palette.green, deep: palette.paperDeep, card: palette.card, lit: mix(palette.path, palette.paper, 0.12), highlight: palette.highlight, onHighlight: palette.onHighlight, font: `"${QURAN_FAMILY}"`, ui: `"${UI_FONT}"`, logo: logoUrl(palette.ink, palette.accent) } };
}
