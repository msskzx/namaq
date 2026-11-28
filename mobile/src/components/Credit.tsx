import { factSources, type PersonFact } from '@shared/tarajim';
import Reference from '@/ui/Reference';
import { sourcesOf } from '@/ui/SourceLine';
import type { Palette } from '@/lib/theme';

export function Credit({ facts, palette, quotes = false }: { facts: PersonFact[]; palette: Palette; quotes?: boolean }) {
  return <>{sourcesOf(factSources(facts, quotes)).map(book => <Reference key={book.line} title={book.line} quotes={book.quotes} links={book.links} places={book.places} editions={book.editions} palette={palette} />)}</>;
}
