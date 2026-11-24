import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Fourteen hundred at al-Hudaybiyah drew its well dry; the Prophet ﷺ sat on its rim, rinsed his mouth and prayed and poured
 * the water into it, and it gave them and their mounts all they wanted. Told from Sahih al-Bukhari 4150 (al-Maghazi, the
 * chapter on al-Hudaybiyah), whole, with al-Bara's «ونحن نعد الفتح بيعة الرضوان»; then 4151, whole, folded.
 */
const theWellOfAlHudaybiyah = {
  kind: 'EVENT',
  slug: 'the-well-of-al-hudaybiyah',
  name: "بئر الحديبية",
  nameTransliterated: "The well of al-Hudaybiyah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4150, 0, 116),
      source: { slug: 'sahih-al-bukhari', hadith: 4150, url: 'https://sunnah.com/bukhari:4150' },
      moments: [
        { title: "«ونحن نعد الفتح بيعة الرضوان»", text: sahih('bukhari', 4150, 117, 326), people: ['prophet-muhammad'] },
        { title: "فجلس على شفيرها", text: sahih('bukhari', 4150, 327, 653), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4151, 0, 221),
      source: { slug: 'sahih-al-bukhari', hadith: 4151, url: 'https://sunnah.com/bukhari:4151' },
      moments: [
        { title: "نزحوا البئر", text: sahih('bukhari', 4151, 222, 390), people: ['prophet-muhammad'] },
        { title: "«دعوها ساعة»", text: sahih('bukhari', 4151, 391, 606), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWellOfAlHudaybiyah;
