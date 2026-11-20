// A saved home-feed card on the website, found by its kind and item (`card:<kind>:<item>`, shared/bookmarkKind.ts) and
// built by the same functions that build it for the feed, so a saved card looks as it did there (the app's SavedFeedCard).
import { termCardOf, type TermCard } from '@/lib/balaghaTerms';
import { hadithCardOf, type HadithCard } from '@/lib/forty';
import { siraCardOf, storyCardOf, type SiraCard, type StoryCard } from '@/lib/homeFeed';
import { isSahihSlug, sahihCardOf, type SahihCard } from '@/lib/sahih';
import { nameCardOf, tarajimCardOf, type NameCard, type TarajimCard } from '@/lib/tarajim';
import { cardOfBookmark } from '@shared/bookmarkKind';
import { DRAWING_CARD_KINDS, type DrawingCardKind } from '@shared/interests';
import { drawingCardOf, type DrawingCard } from '@/lib/drawingCards';

export type SavedFeedCard =
  | { kind: 'hadith' | 'rajab' | 'recorded' | 'isnad'; card: HadithCard }
  | { kind: 'bukhari' | 'muslim'; card: SahihCard }
  | { kind: 'tarajim' | 'tie' | 'life'; card: TarajimCard }
  | { kind: 'laqab' | 'kunya'; card: NameCard }
  | { kind: 'sira' | 'moment'; card: SiraCard }
  | { kind: 'prophets'; card: StoryCard }
  | { kind: 'term'; card: TermCard }
  | { kind: 'note-qiraat'; ayah: string }
  | { kind: DrawingCardKind; card: DrawingCard };

/** The card a `card:` bookmark names, or null when the website does not draw that kind or the data no longer holds it. */
export async function savedFeedCard(id: string, day: number): Promise<SavedFeedCard | null> {
  const saved = cardOfBookmark(id);
  if (!saved) return null;
  const { kind, item } = saved;
  switch (kind) {
    case 'hadith': case 'rajab': case 'recorded': case 'isnad': { const card = hadithCardOf(kind, item); return card ? { kind, card } : null; }
    case 'tarajim': case 'tie': case 'life': { const card = tarajimCardOf(kind, item); return card ? { kind, card } : null; }
    case 'laqab': case 'kunya': { const card = nameCardOf(kind, item); return card ? { kind, card } : null; }
    case 'sira': case 'moment': { const card = await siraCardOf(kind, item); return card ? { kind, card } : null; }
    case 'prophets': { const card = storyCardOf(item); return card ? { kind, card } : null; }
    case 'term': { const card = await termCardOf(item, day); return card ? { kind, card } : null; }
    case 'note-qiraat': return /^\d{1,3}:\d{1,3}$/.test(item) ? { kind, ayah: item } : null;
    default: {
      if ((DRAWING_CARD_KINDS as readonly string[]).includes(kind)) { const card = await drawingCardOf(kind, item); return card ? { kind: card.kind, card } : null; }
      if (!isSahihSlug(kind)) return null;
      const card = await sahihCardOf(kind, item);
      return card ? { kind, card } : null;
    }
  }
}
