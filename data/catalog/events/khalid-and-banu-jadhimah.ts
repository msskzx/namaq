import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Khalid ibn al-Walid called Banu Jadhimah to islam; not knowing how to say «أسلمنا» they said «صبأنا صبأنا», and he killed
 * and took captives and ordered each man to kill his captive; Ibn Umar refused, and the Prophet ﷺ raised his hands twice,
 * «اللهم إني أبرأ إليك مما صنع خالد». Told from Sahih al-Bukhari 4339 (al-Maghazi, the sending of Khalid to Banu
 * Jadhimah), whole. Ibn Umar, who tells it, has no catalog subject.
 */
const khalidAndBanuJadhimah = {
  kind: 'EVENT',
  slug: 'khalid-and-banu-jadhimah',
  name: "خالد وبنو جذيمة",
  nameTransliterated: "Khalid and Banu Jadhimah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'khalid-ibn-al-walid' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4339, 0, 197),
      source: { slug: 'sahih-al-bukhari', hadith: 4339, url: 'https://sunnah.com/bukhari:4339' },
      moments: [
        { title: "«صبأنا صبأنا»", text: sahih('bukhari', 4339, 198, 481), people: ['prophet-muhammad', 'khalid-ibn-al-walid'] },
        { title: "«والله لا أقتل أسيري»", text: sahih('bukhari', 4339, 482, 657), people: ['khalid-ibn-al-walid'] },
        { title: "«اللهم إني أبرأ إليك مما صنع خالد»", text: sahih('bukhari', 4339, 658, 818), people: ['prophet-muhammad', 'khalid-ibn-al-walid'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default khalidAndBanuJadhimah;
