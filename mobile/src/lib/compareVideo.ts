import type { PairCard } from '@shared/quran/compareCards';
import { curatedFor } from '@shared/quran/curatedComparisons';
import type { ReadStep } from '@shared/quran/readPlan';
import { compareRecorderPage, compareVideoInput, pageVideoInputs, videoCard, type CompareLook } from '@shared/video/compareVideo';
import { WEBSITE } from './branches';
import { pairTitle, sideLabel } from './compare';
import { logoUrl } from './logo';
import { QURAN_FONT, type Palette } from './theme';

export { sidesAt } from '@shared/video/compareVideo';

export const compareLook = (palette: Palette): CompareLook => ({
  paper: palette.paper, ink: palette.ink, muted: palette.muted, rule: palette.rule, accent: palette.accent, root: palette.root,
  highlight: palette.highlight, onHighlight: palette.onHighlight, font: `"${QURAN_FONT}"`, logo: logoUrl(palette.ink, palette.accent),
});

/** One card's read-along as the recorder page builds it from the font. */
export function cardVideoPage(card: PairCard, plan: ReadStep[], speed: number, palette: Palette) {
  const input = compareVideoInput({ title: pairTitle(card.sides[0].surah, card.sides[1].surah), link: '', cards: [videoCard(card, plan, speed, sideLabel)], look: compareLook(palette) });
  return (font: string) => compareRecorderPage(input, font);
}

/** The picked cards of a pair page as recorder pages, one per part. */
export function pageVideoPages(lead: number, other: number, cards: { card: PairCard; plan: ReadStep[] }[], speed: number, palette: Palette) {
  const story = curatedFor(lead, other);
  const inputs = pageVideoInputs({
    title: pairTitle(lead, other), ...(story ? { subtitle: story.name.ar } : {}),
    link: `${WEBSITE.replace(/^https?:\/\//, '')}/quran/compare?a=${lead}&b=${other}`,
    cards: cards.map(({ card, plan }) => videoCard(card, plan, speed, sideLabel)), look: compareLook(palette),
  });
  return inputs.map(input => (font: string) => compareRecorderPage(input, font));
}
