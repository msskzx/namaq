import treeData from '@shared/quran/quranText/corpus';
import { phrasePresentation } from '@shared/quran/phraseTrees';
import { branchInventory } from '@shared/quran/branchInventory';
import { groupPresentation } from '@shared/quran/mutashabih/presentation';
import type { BranchAyah } from '@shared/quran/branches';
import { tourPieceIn } from '@shared/quran/tour';
import { buildStory } from '@shared/quran/prophets/story';
import { quranStoryText } from '@shared/quran/prophets/storyText';
import { STORIES } from '@shared/quran/prophets/stories';
import { keptViews, type PlaceVerdicts } from '@shared/quran/prophets/review';
import verdicts from '@shared/quran/prophets/verdicts.json';
import type { MushafPage } from '@shared/quran/readerPage';

let tour: ReturnType<typeof phrasePresentation> | null | undefined;
/** The tree the first-visit tour shows (the app's tour tree), built once. */
export function tourTree() {
  if (tour !== undefined) return tour;
  const ayat = treeData.ayat as BranchAyah[];
  const piece = tourPieceIn(branchInventory({}, null));
  tour = !piece ? null : piece.group ? groupPresentation(piece.group, new Map(ayat.map(ayah => [ayah.key, ayah]))) : phrasePresentation(piece.phrase, ayat, true, true);
  return tour;
}

let story: ReturnType<typeof buildTourStory> | undefined;
/** Adam's story as readers see it (the dots the review kept), for the tour's story-map step, built once. */
export function tourStory() {
  return (story ??= buildTourStory());
}

function buildTourStory() {
  const { events, phases } = STORIES.adam;
  return { phases, events: keptViews('adam', buildStory(events, quranStoryText), verdicts.places as PlaceVerdicts) };
}

/** The mushaf page the tour recites: the last one, al-Ikhlas, al-Falaq and an-Nas (the app's tour page). */
export const TOUR_RECITE = { page: 604, start: '112:1', top: 111 };

export async function tourRecitePage() {
  return (await import('@shared/data/quran/mushaf/604.json')).default as MushafPage;
}
