import source from './evidence.json';
import { TAGS, type Group, type Place, type Position, type Tag } from './types';

export const SUPPORTED_TAGS = Object.fromEntries(Object.entries(TAGS).filter(([tag]) =>
  source.cases.some(citation => (citation.tags as string[]).includes(tag))));

const position = (key: string, index: number) => {
  const [surah, ayah] = key.split(':').map(Number);
  return (surah * 1000 + ayah) * 1000 + index;
};
const start = (place: Place) => position(place.key, place.start);
const end = (place: Place) => position(place.through ?? place.key, place.end);
const contains = (place: Place, word: Position) => start(place) <= position(word.key, word.index) && position(word.key, word.index) < end(place);

export function evidenceGroup(group: Group, shownKeys?: string[]): Group {
  const places = group.places.filter(place => !shownKeys || shownKeys.includes(place.key));
  const citations = group.citations.filter(citation => citation.selections && citation.selections.length >= 2 &&
    citation.selections.every(selection => places.some(place => start(place) <= start(selection) && end(place) >= end(selection))));
  const tags = [...new Set(citations.flatMap(citation => citation.tags))];
  const columns = group.columns.map(pair => ({ ...pair, columns: pair.columns.map(column => ({ ...column, tags: column.tags.filter(tag =>
    citations.some(citation => citation.tags.includes(tag) && citation.selections!.some(place => place.key === pair.a) &&
      citation.selections!.some(place => place.key === pair.b) &&
      [column.a, column.b].every(word => !word || citation.selections!.some(place => contains(place, word))))) })) }));
  const examples: Partial<Record<Tag, string>> = {};
  for (const tag of tags) {
    const cited = citations.find(citation => citation.examples?.[tag])?.examples?.[tag];
    if (cited) examples[tag] = cited;
  }
  return { ...group, tags, citations, examples, columns, detail: undefined };
}
