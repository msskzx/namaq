import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Khaybar the Prophet ﷺ said of a man who claimed Islam that he was of the people of the Fire; he fought hard, then, in
 * pain from his wounds, killed himself with his own arrows, and the Prophet ﷺ had it called out that only a believer enters
 * Paradise, «وإن الله يؤيد الدين بالرجل الفاجر». Told from Sahih al-Bukhari 4203 (al-Maghazi, the chapter on Khaybar), whole.
 * 4204 gives only other chains for it. Sahl's report of the man who fell on his sword is a story of its own
 * (the-man-of-the-fire).
 */
const theDinAndTheWickedMan = {
  kind: 'EVENT',
  slug: 'the-din-and-the-wicked-man',
  name: "«إن الله يؤيد الدين بالرجل الفاجر»",
  nameTransliterated: "Allah supports the religion with the wicked man",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4203, 0, 158),
      source: { slug: 'sahih-al-bukhari', hadith: 4203, url: 'https://sunnah.com/bukhari:4203' },
      moments: [
        { title: "«هذا من أهل النار»", text: sahih('bukhari', 4203, 159, 278), people: ['prophet-muhammad'] },
        { title: "فنحر بها نفسه", text: sahih('bukhari', 4203, 279, 547), people: [] },
        { title: "«إن الله يؤيد الدين بالرجل الفاجر»", text: sahih('bukhari', 4203, 548, 859), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDinAndTheWickedMan;
