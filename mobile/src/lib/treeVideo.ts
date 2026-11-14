import type { Beat } from './growth';
import { growthState } from './growPlayer';
import { VIDEO_TYPES, type TreeScene, type VideoAyah, type VideoInput } from './scene';
import { logoUrl } from './logo';
import type { Palette } from './theme';
import { ayahOf, surahNames } from './branches';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';

/** The tree's ayat in the order they grow, as the bubbles and the ayah card show them. */
export function videoAyat(beats: Beat[]): VideoAyah[] {
  return [...new Set(beats.map(beat => beat.key).filter(Boolean))].map(key => {
    const [surah, ayah] = key.split(':').map(Number);
    const words = ayahOf(key)?.words ?? [];
    return { key, bubble: `${num(surah)}:${num(ayah)}`, text: mushafText(`${words.join(' ')} ﴿${num(ayah)}﴾`), place: surahNames[surah] ?? num(surah) };
  });
}

/** What the video of a growing tree records: the drawn tree, the beats of the studio's mode, and the screen's colours. */
export function treeVideo(scene: TreeScene, beats: { watch: Beat[]; ask: Beat[] }, palette: Palette): VideoInput {
  const state = growthState();
  const played = state.mode === 'ask' ? beats.ask : beats.watch;
  return { scene, beats: played, ayat: videoAyat(played), speed: state.speed, ask: state.mode === 'ask', timer: state.timer, types: VIDEO_TYPES,
    look: { paper: palette.paper, ink: palette.ink, muted: palette.muted, rule: palette.rule, accent: palette.accent, path: palette.path, green: palette.green, deep: palette.paperDeep, font: '"KFGQPC Hafs"', logo: logoUrl(palette.ink, palette.accent) } };
}
