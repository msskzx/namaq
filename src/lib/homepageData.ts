import { surahList } from './quran/surahList';
import { homeQuranSections } from './homeQuranSections';
import treeData from '@/app/quran/branches/trees.json';
import { buildPhraseGroups } from './quran/phraseTrees';
import { groups } from './quran/mutashabih/data';
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
    sections: homeQuranSections(surahs, new Set(listedPairs.flatMap(pair => [pair.a, pair.b]))),
  };
}

export type HomepageData = Awaited<ReturnType<typeof getHomepageData>>;
