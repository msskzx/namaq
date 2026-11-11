import type { Beat } from './growth';
import { growthState } from './growPlayer';
import { VIDEO_TYPES, type TreeScene, type VideoInput } from './scene';
import { logoUrl } from './logo';
import type { Palette } from './theme';

/** What the video of a growing tree records: the drawn tree, the beats of the studio's mode, and the screen's colours. */
export function treeVideo(scene: TreeScene, beats: { watch: Beat[]; ask: Beat[] }, palette: Palette): VideoInput {
  const state = growthState();
  return { scene, beats: state.mode === 'ask' ? beats.ask : beats.watch, speed: state.speed, ask: state.mode === 'ask', timer: state.timer, types: VIDEO_TYPES,
    look: { paper: palette.paper, ink: palette.ink, muted: palette.muted, rule: palette.rule, accent: palette.accent, path: palette.path, green: palette.green, deep: palette.paperDeep, font: '"KFGQPC Hafs"', logo: logoUrl(palette.ink, palette.accent) } };
}
