import corpus from '../quranText/corpus';
import type { StoryText } from './story';

let text: Map<string, string> | undefined;

export const quranStoryText: StoryText = {
  ayah: key => (text ??= new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words.join(' ')]))).get(key),
};
