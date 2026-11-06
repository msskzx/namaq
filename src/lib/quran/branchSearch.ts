import { searchPhrases, textHolds, type Opening } from './branches';

export function searchSharedPhrases<T extends Opening>(phrases: T[], query: string): T[] {
  const byId = new Map(phrases.map(phrase => [phrase.id, phrase]));
  const searchable = phrases.map(phrase => ({ ...phrase, aliases: undefined }));
  return searchPhrases(searchable, query).filter(phrase => /[a-z]/i.test(query)
    ? phrase.textEn?.toLowerCase().includes(query.trim().toLowerCase())
    : (['strict', 'loose'] as const).some(level => textHolds(phrase.text, query, level)))
    .map(phrase => byId.get(phrase.id)!);
}
