import type { BranchPiece } from '../branchInventory';
import type { PhraseOccurrence } from '../phraseTrees';
import { num } from '../arabicNumber';
import { ANSWER_BOOKS, answerBookOf } from './bookAnswer';

/**
 * The mutashabih tab's index by surah (owner, 2026-11-24: sketch quran-design/mutashabih-page, design ب): how many of the
 * list's cards each surah holds, and a surah's cards in mushaf order.
 */

const surahOf = (key: string) => Number(key.split(':')[0]);
const placesOf = (piece: BranchPiece): PhraseOccurrence[] => piece.group?.places ?? piece.phrase.occurrences;

/** A book's author as the page names him: as «لماذا؟» does for the three it quotes («ابن الزبير»), else as the citation does («الزركشي»). */
const bookName = (citation: { id: string; book: string }) =>
  ANSWER_BOOKS.find(each => each.book === answerBookOf(citation.id))?.name ?? citation.book.split('،')[0].trim();

/** For each surah (al-Fatiha first), how many of the cards have a place in it. */
export function surahCounts(pieces: BranchPiece[]): number[] {
  const counts = Array<number>(114).fill(0);
  for (const piece of pieces) for (const surah of new Set(placesOf(piece).map(place => surahOf(place.key)))) counts[surah - 1]++;
  return counts;
}

/** A card as the index lists it under a surah: its first place there, the places it is set beside, its books, the words it differs by there. */
export type IndexRow = { piece: BranchPiece; place: PhraseOccurrence; others: string[]; books: string[]; lit: number[] };

/** The surah's cards, one row each at its first place in the surah, in mushaf order. */
export function indexRows(pieces: BranchPiece[], surah: number): IndexRow[] {
  const ayah = (key: string) => Number(key.split(':')[1]);
  return pieces.flatMap(piece => {
    const places = placesOf(piece);
    const here = places.filter(place => surahOf(place.key) === surah).sort((a, b) => ayah(a.key) - ayah(b.key) || a.start - b.start)[0];
    if (!here) return [];
    const others = [...new Set(places.filter(place => place !== here && !(place.key === here.key && place.start === here.start)).map(place => place.key))];
    const books = [...new Set((piece.group?.citations ?? []).map(citation => bookName(citation)))];
    return [{ piece, place: here, others, books, lit: piece.group?.differences[here.key] ?? [] }];
  }).sort((a, b) => ayah(a.place.key) - ayah(b.place.key) || a.place.start - b.place.start);
}

/** «موضع واحد», «موضعان», «٣ مواضع», «١١ موضعًا». */
export const placesCount = (count: number) => (count === 1 ? 'موضع واحد' : count === 2 ? 'موضعان' : count <= 10 ? `${num(count)} مواضع` : `${num(count)} موضعًا`);
