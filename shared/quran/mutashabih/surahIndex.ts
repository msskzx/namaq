import type { BranchPiece } from '../branchInventory';
import type { PhraseOccurrence } from '../phraseTrees';
import { counted } from '../arabicNumber';
import { ANSWER_BOOKS, answerBookOf } from './bookAnswer';


const surahOf = (key: string) => Number(key.split(':')[0]);
const placesOf = (piece: BranchPiece): PhraseOccurrence[] => piece.group?.places ?? piece.phrase.occurrences;

const bookName = (citation: { id: string; book: string }) =>
  ANSWER_BOOKS.find(each => each.book === answerBookOf(citation.id))?.name ?? citation.book.split('،')[0].trim();

export function surahCounts(pieces: BranchPiece[]): number[] {
  const counts = Array<number>(114).fill(0);
  for (const piece of pieces) for (const surah of new Set(placesOf(piece).map(place => surahOf(place.key)))) counts[surah - 1]++;
  return counts;
}

export type IndexRow = { piece: BranchPiece; place: PhraseOccurrence; others: string[]; books: string[]; lit: number[] };

export function indexRows(pieces: BranchPiece[], surah: number): IndexRow[] {
  const ayah = (key: string) => Number(key.split(':')[1]);
  return pieces.flatMap(piece => {
    const places = placesOf(piece);
    const here = places.filter(place => surahOf(place.key) === surah).sort((a, b) => ayah(a.key) - ayah(b.key) || a.start - b.start)[0];
    if (!here) return [];
    const others = [...new Set(places.filter(place => place !== here && !(place.key === here.key && place.start === here.start)).map(place => place.key))];
    const books = [...new Set((piece.group?.citations ?? []).map(citation => bookName(citation)))];
    const lit = (piece.group?.differences[here.key] ?? []).filter(at => at >= here.start && at < here.end);
    return [{ piece, place: here, others, books, lit: lit.length < here.end - here.start ? lit : [] }];
  }).sort((a, b) => ayah(a.place.key) - ayah(b.place.key) || a.place.start - b.place.start);
}

export const placesCount = (count: number) => (count === 1 ? 'موضع واحد' : counted(count, ['موضع', 'موضعان', 'مواضع', 'موضعًا']));
