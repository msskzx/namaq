import { surahList } from './quran/surahList';
import { surahLabel } from './quran/surahLabel';
import { homeQuranSections } from './homeQuranSections';
import treeData from '@shared/data/quran/trees.json';
import { buildPhraseGroups } from '@shared/quran/phraseTrees';
import { tourRecitePage, tourStory, tourTree, TOUR_RECITE } from './tourTree';
import { groups } from '@shared/quran/mutashabih/data';
import { listedPairs } from '@/app/quran/compare/pairCards';

const phrases = buildPhraseGroups(treeData.ayat);

const bookmarkAyat = () => Object.fromEntries([
  ...phrases.map(phrase => [phrase.id, [...new Set(phrase.occurrences.map(occurrence => occurrence.key))]] as const),
  ...treeData.trees.map(tree => [tree.id, [...new Set(tree.occurrences.map(occurrence => occurrence.key))]] as const),
  ...treeData.subtrees.map(tree => [tree.id, tree.keys] as const),
  ...groups.map(group => [group.id, [...new Set(group.places.map(place => place.key))]] as const),
]);

/** What a saved or forgotten card needs: surah names, and the ayat of every tree or group a bookmark can name. */
export async function getCardData() {
  const surahs = await surahList();
  return { surahs: surahs.map(surah => ({ number: surah.number, name: surahLabel(surah), nameEn: surah.nameTransliterated ?? undefined, count: 0 })), bookmarkAyat: bookmarkAyat() };
}

export async function getHomepageData() {
  const surahs = await surahList();
  return {
    surahs: surahs.map(surah => ({ number: surah.number, name: surahLabel(surah), nameEn: surah.nameTransliterated ?? undefined, count: 0 })),
    bookmarkAyat: bookmarkAyat(),
    tour: tourTree(),
    tourStory: tourStory(),
    tourRecite: { ...TOUR_RECITE, data: await tourRecitePage(), names: Object.fromEntries(surahs.filter(surah => surah.number >= TOUR_RECITE.top).map(surah => [surah.number, surah.name])) },
    sections: homeQuranSections(surahs.map(surah => ({ ...surah, name: surahLabel(surah) })), new Set(listedPairs.flatMap(pair => [pair.a, pair.b]))),
  };
}

type Loaded = Awaited<ReturnType<typeof getHomepageData>>;
/** The tour's story and recite steps are left out where a page has no use for them (tests). */
export type HomepageData = Omit<Loaded, 'tourStory' | 'tourRecite'> & Partial<Pick<Loaded, 'tourStory' | 'tourRecite'>>;
