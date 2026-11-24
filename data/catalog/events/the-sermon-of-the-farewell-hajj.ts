import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At the farewell hajj the Prophet ﷺ asked «أي شهر هذا؟» and told them «فإن دماءكم وأموالكم … عليكم حرام» and «ألا هل
 * بلغت». Told from Sahih al-Bukhari (al-Maghazi, the chapter on the farewell hajj), each hadith whole: Abu Bakrah's 4406
 * first, the fullest; then Ibn Umar's 4402 and its end in our copy, 4403, which has no chain of its own; then Jarir's 4405,
 * where he tells him «استنصت الناس». A story of its own and not reports on hajjat-al-wada, which has no cited year and
 * stays off the «حياته» timeline. The other hadith of the chapter (4395–4401, 4404, 4408, 4410–4414) are rulings and counts.
 */
const theSermonOfTheFarewellHajj = {
  kind: 'EVENT',
  slug: 'the-sermon-of-the-farewell-hajj',
  name: "خطبة حجة الوداع",
  nameTransliterated: "The sermon of the farewell hajj",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jarir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4406, 0, 179),
      source: { slug: 'sahih-al-bukhari', hadith: 4406, url: 'https://sunnah.com/bukhari:4406' },
      moments: [
        { title: "«الزمان قد استدار»", text: sahih('bukhari', 4406, 180, 446), people: ['prophet-muhammad'] },
        { title: "«أي شهر هذا؟»", text: sahih('bukhari', 4406, 447, 973), people: ['prophet-muhammad'] },
        { title: "«فإن دماءكم وأموالكم»", text: sahih('bukhari', 4406, 974, 1429), people: ['prophet-muhammad'] },
        { title: "«صدق محمد ﷺ»", text: sahih('bukhari', 4406, 1430, 1540), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4402, 0, 174),
      source: { slug: 'sahih-al-bukhari', hadith: 4402, url: 'https://sunnah.com/bukhari:4402' },
      moments: [
        { title: "«ولا ندري ما حجة الوداع»", text: sahih('bukhari', 4402, 175, 385), people: ['prophet-muhammad'] },
        { title: "«إن ربكم ليس بأعور»", text: sahih('bukhari', 4402, 386, 764), people: ['prophet-muhammad'] },
      ],
    },
    {
      source: { slug: 'sahih-al-bukhari', hadith: 4403, url: 'https://sunnah.com/bukhari:4403' },
      moments: [
        { title: "«ألا هل بلغت»", text: sahih('bukhari', 4403, 0, 211), people: ['prophet-muhammad'] },
        { title: "«لا ترجعوا بعدي كفارا»", text: sahih('bukhari', 4403, 212, 320), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4405, 0, 140),
      source: { slug: 'sahih-al-bukhari', hadith: 4405, url: 'https://sunnah.com/bukhari:4405' },
      moments: [
        { title: "«استنصت الناس»", text: sahih('bukhari', 4405, 141, 300), people: ['prophet-muhammad', 'jarir-ibn-abdullah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theSermonOfTheFarewellHajj;
