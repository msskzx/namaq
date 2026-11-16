import itqan from '@shared/data/quran/itqanBalagha';
import kashshaf from '@shared/data/quran/kashshaf';
import { itqanAt, type ItqanParagraph } from '@shared/quran/itqanBalagha';
import { kashshafAt, type KashshafPassage } from '@shared/quran/kashshaf';
import { ayahMushafWords } from './irab';

/** What the reader's balagha sheet shows for one ayah (AyahPreviewSheet.tsx); the app's sheet reads its own books. */
export type BalaghaAyah = { words: string[]; itqan: ItqanParagraph[]; passage: KashshafPassage | null; version: string };

export async function balaghaAyah(key: string): Promise<BalaghaAyah> {
  return { words: (await ayahMushafWords(key)).words, itqan: itqanAt(itqan, key), passage: kashshafAt(kashshaf, key), version: kashshaf.source.version };
}
