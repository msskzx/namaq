import { expect, it } from 'vitest';
import data from '@/app/quran/branches/trees.json';
import words from './mushafWords.json';

it('covers every source word without the font-incompatible circle character', () => {
  const display: Record<string, string> = words;
  for (const ayah of data.ayat) {
    for (const word of ayah.words.flatMap(word => word === 'بَعْدَ مَا' || word === 'إِلْ يَاسِينَ' ? word.split(' ') : [word])) {
      expect(display[word], `${ayah.key}: ${word}`).toBeDefined();
      expect(display[word]).not.toContain('\u06DF');
    }
  }
});
