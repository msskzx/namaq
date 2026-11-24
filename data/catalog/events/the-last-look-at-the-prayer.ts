import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At the dawn prayer on Monday, with Abu Bakr leading, the Prophet ﷺ lifted the curtain of Aisha's room, looked at them in
 * their rows and smiled; Abu Bakr stepped back thinking he would come out, the Muslims almost broke their prayer for joy,
 * and he signed to them to finish, went in and let down the curtain. Told from Sahih al-Bukhari 4448 (al-Maghazi, the
 * illness of the Prophet ﷺ), whole.
 */
const theLastLookAtThePrayer = {
  kind: 'EVENT',
  slug: 'the-last-look-at-the-prayer',
  name: "نظرته ﷺ إلى الصفوف يوم الاثنين",
  nameTransliterated: "His last look at the prayer",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }],
  reports: [
    {
      isnad: sahih('bukhari', 4448, 0, 160),
      source: { slug: 'sahih-al-bukhari', hadith: 4448, url: 'https://sunnah.com/bukhari:4448' },
      moments: [
        { title: "كشف ستر حجرة عائشة", text: sahih('bukhari', 4448, 161, 560), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "«أن أتموا صلاتكم»", text: sahih('bukhari', 4448, 561, 783), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theLastLookAtThePrayer;
