import type { Beat } from './growth';
import { growthState } from './growPlayer';
import { VIDEO_TYPES, type TreeScene, type VideoAyah, type VideoInput } from './scene';
import { logoUrl } from './logo';
import type { Palette } from './theme';
import { QURAN_FONT, UI_FONT } from './fonts';
import { ayahOf, matrixOf, surahNames, type MatrixAyah, type Presentation } from './branches';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';

const mix = (a: string, b: string, t: number) => {
  const channel = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return `#${[0, 1, 2].map(i => Math.round(channel(a, i) * t + channel(b, i) * (1 - t)).toString(16).padStart(2, '0')).join('')}`;
};

/**
 * The tree's ayat in the order they grow, as the chips and the ayah card show them. The card's words are the matrix's row for the
 * ayah, coloured as MatrixCard colours them (same root purple, same word in the accent, words only some rows share faded).
 */
export function videoAyat(beats: Beat[], presentation: Presentation | undefined, palette: Palette): VideoAyah[] {
  const matrix = presentation && matrixOf(presentation, false);
  const starts = presentation?.ayat.map(ayah => ayah.key) ?? [];
  return [...new Set(beats.map(beat => beat.key).filter(Boolean))].map(key => {
    const [surah, number] = key.split(':').map(Number);
    const row: MatrixAyah[] = matrix?.rows[starts.indexOf(key)]?.ayah?.ayat ?? [{ key, page: 0, words: ayahOf(key)?.words ?? [], exact: new Set(), rooted: new Set() }];
    const words = row.flatMap(ayah => [
      ...ayah.words.map((word, i) => {
        const link = ayah.links?.get(i);
        const color = ayah.rooted.has(i) ? palette.root : ayah.exact.has(i) ? palette.accent : link?.some ? mix(link.exact ? palette.accent : palette.root, palette.card, 0.55) : palette.ink;
        return { text: mushafText(word), color };
      }),
      { text: num(Number(ayah.key.split(':')[1])), color: palette.accent },
    ]);
    const [lastSurah, last] = row[row.length - 1].key.split(':').map(Number);
    const name = surahNames[surah] ?? num(surah);
    // As the matrix card names it, a run into the next surah included.
    const label = lastSurah !== surah ? `الآية ${num(number)} ثم سورة ${surahNames[lastSurah]} ${num(last)}` : row.length > 1 ? `الآيات ${num(number)}–${num(last)}` : `الآية ${num(number)}`;
    return { key, chip: `${name} ${num(number)}`, name, label, words };
  });
}

/** What the video of a growing tree records: the drawn tree, the beats of the studio's mode, and the screen's colours. */
export function treeVideo(scene: TreeScene, beats: { watch: Beat[]; ask: Beat[] }, palette: Palette, presentation?: Presentation): VideoInput {
  const state = growthState();
  const played = state.mode === 'ask' ? beats.ask : beats.watch;
  return { scene, beats: played, ayat: videoAyat(played, presentation, palette), speed: state.speed, ask: state.mode === 'ask', timer: state.timer, types: VIDEO_TYPES,
    look: { paper: palette.paper, ink: palette.ink, muted: palette.muted, rule: palette.rule, accent: palette.accent, path: palette.path, green: palette.green, deep: palette.paperDeep, card: palette.card, lit: mix(palette.path, palette.paper, 0.12), font: `"${QURAN_FONT}"`, ui: `"${UI_FONT}"`, logo: logoUrl(palette.ink, palette.accent) } };
}
