import { searchPhrases, textHolds, type Opening } from './branches';

export const ALL_KINDS = 'mutashabeh,pondering,words';

export const PAGE_KINDS = [{ id: 'mutashabeh', ar: 'في كتب المتشابهات', en: 'In the mutashabih books' }, { id: 'pondering', ar: 'تدبّر', en: 'Pondering' },
  { id: 'tanasub', ar: 'في كتب تناسب السور', en: 'In the surah-order books' }] as const;
export const PAGE_DEFAULT_KIND = 'mutashabeh';


export function searchSharedPhrases<T extends Opening>(phrases: T[], query: string): T[] {
  const byId = new Map(phrases.map(phrase => [phrase.id, phrase]));
  const searchable = phrases.map(phrase => ({ ...phrase, aliases: undefined }));
  return searchPhrases(searchable, query).filter(phrase => /[a-z]/i.test(query)
    ? phrase.textEn?.toLowerCase().includes(query.trim().toLowerCase())
    : (['strict', 'loose'] as const).some(level => textHolds(phrase.text, query, level)))
    .map(phrase => byId.get(phrase.id)!);
}
