import corpus from '../../data/quran/trees.json';
import surahRows from '../../data/quran/surahs.json';
import type { StoryText } from './story';

const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
let text: Map<string, string> | undefined;

/** A story names its ayat; their words come from the one Quran text the app and the website bundle. */
export const QURAN_TEXT: StoryText = { names, ayah: key => (text ??= new Map(corpus.ayat.map(a => [a.key, a.words.join(' ')]))).get(key) };
