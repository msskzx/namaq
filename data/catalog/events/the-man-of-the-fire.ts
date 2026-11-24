import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A man fought so well that they said none had done as he had, and the Prophet ﷺ said he was of the people of the Fire;
 * another followed him, saw him wounded and fall on his own sword, and came back saying «أشهد أنك رسول الله». Told from
 * Sahih al-Bukhari 4202 (al-Maghazi, the chapter on Khaybar), whole; then Sahl's other route, 4207, whole, folded. Abu
 * Hurayrah's report of a man at Khaybar who killed himself with arrows (4203) is told as its own story: its details differ
 * and the two are not said to be one man.
 */
const theManOfTheFire = {
  kind: 'EVENT',
  slug: 'the-man-of-the-fire',
  name: "«إنه من أهل النار»",
  nameTransliterated: "The man of the Fire",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4202, 0, 117),
      source: { slug: 'sahih-al-bukhari', hadith: 4202, url: 'https://sunnah.com/bukhari:4202' },
      moments: [
        { title: "«أما إنه من أهل النار»", text: sahih('bukhari', 4202, 118, 529), people: ['prophet-muhammad'] },
        { title: "فقتل نفسه", text: sahih('bukhari', 4202, 530, 845), people: [] },
        { title: "«أشهد أنك رسول الله»", text: sahih('bukhari', 4202, 846, 1270), people: ['prophet-muhammad'] },
        { title: "«إن الرجل ليعمل عمل أهل الجنة فيما يبدو للناس»", text: sahih('bukhari', 4202, 1271, 1528), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4207, 0, 106),
      source: { slug: 'sahih-al-bukhari', hadith: 4207, url: 'https://sunnah.com/bukhari:4207' },
      moments: [
        { title: "«إنه من أهل النار»", text: sahih('bukhari', 4207, 107, 546), people: ['prophet-muhammad'] },
        { title: "فقتل نفسه", text: sahih('bukhari', 4207, 547, 791), people: [] },
        { title: "«أشهد أنك رسول الله»", text: sahih('bukhari', 4207, 792, 1122), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theManOfTheFire;
