import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Some of the Jews told Umar that had «اليوم أكملت لكم دينكم» come down to them they would have taken that day as a feast; Umar
 * said he knew where it came down: «أنزلت ورسول الله ﷺ واقف بعرفة». Told from Sahih al-Bukhari 4407 (al-Maghazi, the
 * chapter on the farewell hajj), whole.
 */
const umarAndTheVerseOfArafah = {
  kind: 'EVENT',
  slug: 'umar-and-the-verse-of-arafah',
  name: "عمر وآية عرفة",
  nameTransliterated: "Umar and the verse of Arafah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '5:3',
      to: '5:3',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4407, url: 'https://sunnah.com/bukhari:4407', quote: sahih('bukhari', 4407, 283, 464) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4407, 0, 123),
      source: { slug: 'sahih-al-bukhari', hadith: 4407, url: 'https://sunnah.com/bukhari:4407' },
      moments: [
        { title: "«لاتخذنا ذلك اليوم عيدا»", text: sahih('bukhari', 4407, 124, 356), people: ['umar-ibn-al-khattab'] },
        { title: "«أنزلت ورسول الله ﷺ واقف بعرفة»", text: sahih('bukhari', 4407, 357, 466), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default umarAndTheVerseOfArafah;
