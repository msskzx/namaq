import type { PairCard } from '@shared/quran/compareCards';
import { curatedFor } from '@shared/quran/curatedComparisons';
import { sideTitle } from '@shared/quran/compareCardLook';
import type { ReadStep } from '@shared/quran/readPlan';
import { compareRecorderPage, compareVideoInput, markColours, pageVideoInputs, videoCard, type CompareLook, type VideoNames } from '@shared/video/compareVideo';
import { pairTitle, silentNote, surahName } from './compare';
import { logoUrl } from './logo';
import { QURAN_FONT, UI_FONT, type Palette } from './theme';

/** The compare tab's colours and fonts, for the recorder page. */
export const compareLook = (palette: Palette): CompareLook => ({
  paper: palette.paper, card: palette.card, deep: palette.paperDeep, ink: palette.ink, muted: palette.muted, rule: palette.rule, accent: palette.accent, green: palette.green,
  highlight: palette.highlight, onHighlight: palette.onHighlight, marks: markColours(palette),
  font: `"${QURAN_FONT}"`, ui: `"${UI_FONT}"`, logo: logoUrl(palette.ink, palette.accent),
});

/** The card's names as the app writes them. */
const names: VideoNames = { side: name => sideTitle(name, surahName), silent: silentNote };

/** One card's read-along as the recorder page builds it from the font. */
export function cardVideoPage(card: PairCard, plan: ReadStep[], speed: number, palette: Palette) {
  const input = compareVideoInput({ title: pairTitle(card.sides[0].surah, card.sides[1].surah), cards: [videoCard(card, plan, speed, names)], look: compareLook(palette) });
  return (font: string) => compareRecorderPage(input, font);
}

/** The picked cards of a pair page as recorder pages, one per part. */
export function pageVideoPages(lead: number, other: number, cards: { card: PairCard; plan: ReadStep[] }[], speed: number, palette: Palette) {
  const story = curatedFor(lead, other);
  const inputs = pageVideoInputs({
    title: pairTitle(lead, other), ...(story ? { subtitle: story.name.ar } : {}),
    cards: cards.map(({ card, plan }) => videoCard(card, plan, speed, names)), look: compareLook(palette),
  });
  return inputs.map(input => (font: string) => compareRecorderPage(input, font));
}
