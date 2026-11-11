import { surahList } from './quran/surahList';
import { homeQuranSections } from './homeQuranSections';
import treeData from '@shared/data/quran/trees.json';
import { buildPhraseGroups } from '@shared/quran/phraseTrees';
import { tourTree } from './tourTree';
import { groups } from '@shared/quran/mutashabih/data';
import { listedPairs } from '@/app/quran/compare/pairCards';

const phrases = buildPhraseGroups(treeData.ayat);

export async function getHomepageData() {
  const surahs = await surahList();
  return {
    surahs: surahs.map(surah => ({ number: surah.number, name: surah.name, nameEn: surah.nameTransliterated ?? undefined, count: 0 })),
    bookmarkAyat: Object.fromEntries([
      ...phrases.map(phrase => [phrase.id, [...new Set(phrase.occurrences.map(occurrence => occurrence.key))]] as const),
      ...treeData.trees.map(tree => [tree.id, [...new Set(tree.occurrences.map(occurrence => occurrence.key))]] as const),
      ...treeData.subtrees.map(tree => [tree.id, tree.keys] as const),
      ...groups.map(group => [group.id, [...new Set(group.places.map(place => place.key))]] as const),
    ]),
    tour: tourTree(),
    sections: homeQuranSections(surahs, new Set(listedPairs.flatMap(pair => [pair.a, pair.b]))),
  };
}

export type HomepageData = Awaited<ReturnType<typeof getHomepageData>>;
