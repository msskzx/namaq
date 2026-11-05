import { surahList } from './quran/surahList';
import { homeQuranSections } from './homeQuranSections';
import treeData from '@/app/quran/branches/trees.json';
import { groups } from './quran/mutashabih/data';

export async function getHomepageData() {
  const surahs = await surahList();
  return {
    surahs: surahs.map(surah => ({ number: surah.number, name: surah.name, nameEn: surah.nameTransliterated ?? undefined, count: 0 })),
    bookmarkAyat: Object.fromEntries([
      ...treeData.trees.map(tree => [tree.id, [...new Set(tree.occurrences.map(occurrence => occurrence.key))]] as const),
      ...treeData.subtrees.map(tree => [tree.id, tree.keys] as const),
      ...groups.map(group => [group.id, [...new Set(group.places.map(place => place.key))]] as const),
    ]),
    sections: homeQuranSections(surahs),
  };
}

export type HomepageData = Awaited<ReturnType<typeof getHomepageData>>;
