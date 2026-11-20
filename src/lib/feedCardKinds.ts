import { cardOfBookmark } from '@shared/bookmarkKind';
import { DRAWING_CARD_KINDS } from '@shared/interests';

/** The saved feed cards the website draws (src/lib/feedCard.ts); the app's other kinds (scene, the tafsir, i'rab and balagha ayah cards) stay plain saved items here. */
export const WEB_CARD_KINDS: readonly string[] = ['hadith', 'rajab', 'recorded', 'isnad', 'bukhari', 'muslim', 'tarajim', 'tie', 'life', 'laqab', 'kunya',
  'sira', 'moment', 'prophets', 'term', 'note-qiraat', ...DRAWING_CARD_KINDS];
/** Whether a saved item is a feed card the website draws whole. */
export const drawsCard = (id: string) => WEB_CARD_KINDS.includes(cardOfBookmark(id)?.kind ?? '');
