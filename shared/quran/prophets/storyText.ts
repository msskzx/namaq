import corpus from '../../data/quran/trees.json';
import surahRows from '../../data/quran/surahs.json';
import type { StoryText } from './story';

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
let text: Map<string, string> | undefined;

/** The stories' ayat as the Madina pages print them (AGENTS.md, "Quran text"), the same on the website and in the app. */
export const quranStoryText: StoryText = {
  names,
  ayah: key => (text ??= new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words.join(' ')]))).get(key),
};
