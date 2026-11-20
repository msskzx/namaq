import { cardOfBookmark } from '@shared/bookmarkKind';
import { DRAWING_CARD_KINDS } from '@shared/interests';

/** The saved feed cards the website draws (src/lib/feedCard.ts): every content card kind of the app's feed. */
export const WEB_CARD_KINDS: readonly string[] = ['hadith', 'rajab', 'recorded', 'isnad', 'bukhari', 'muslim', 'tarajim', 'tie', 'life', 'laqab', 'kunya',
  'sira', 'moment', 'prophets', 'term', 'note-qiraat', 'note-tafsir', 'note-irab', 'note-balagha', 'scene', ...DRAWING_CARD_KINDS];
/** Whether a saved item is a feed card the website draws whole. */
export const drawsCard = (id: string) => WEB_CARD_KINDS.includes(cardOfBookmark(id)?.kind ?? '');
