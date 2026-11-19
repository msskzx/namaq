import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { SahihIndex, SahihSlug, SahihText } from '@shared/sahih';
import bukhariIndex from '@shared/data/hadith/bukhari.json';
import muslimIndex from '@shared/data/hadith/muslim.json';

/** The Sahihayn's kitabs and babs (scripts/hadith/buildSahihayn.ts), the same index the app ships. */
export const SAHIH: Record<SahihSlug, SahihIndex> = { bukhari: bukhariIndex as SahihIndex, muslim: muslimIndex as SahihIndex };
export const SAHIH_SLUGS: SahihSlug[] = ['bukhari', 'muslim'];
export const isSahihSlug = (value: string): value is SahihSlug => (SAHIH_SLUGS as string[]).includes(value);

const texts = new Map<SahihSlug, Promise<SahihText>>();
/** A book's whole text, read once from disk on the server (data/hadith/sahih/<book>.json, traced in next.config.ts). */
export function sahihText(slug: SahihSlug): Promise<SahihText> {
  if (!texts.has(slug)) texts.set(slug, readFile(path.join(process.cwd(), 'data', 'hadith', 'sahih', `${slug}.json`), 'utf8').then(raw => JSON.parse(raw) as SahihText));
  return texts.get(slug)!;
}
