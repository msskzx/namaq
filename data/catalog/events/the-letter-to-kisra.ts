import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent his letter to Kisra with Abd Allah ibn Hudhafah al-Sahmi by way of the ruler of Bahrain; Kisra read it
 * and tore it, and he prayed that they be torn apart. Told from Sahih al-Bukhari 4424 (al-Maghazi, his letter to Kisra and
 * Qaysar), whole, with al-Zuhri's note from Ibn al-Musayyab. 4425 is Abu Bakrah's saying; 4426–4427 al-Sa'ib's memory of
 * going out to meet him back from Tabuk.
 */
const theLetterToKisra = {
  kind: 'EVENT',
  slug: 'the-letter-to-kisra',
  name: "كتابه ﷺ إلى كسرى",
  nameTransliterated: "The letter to Kisra",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-hudhafah' }],
  reports: [
    {
      isnad: sahih('bukhari', 4424, 0, 198),
      source: { slug: 'sahih-al-bukhari', hadith: 4424, url: 'https://sunnah.com/bukhari:4424' },
      moments: [
        { title: "فلما قرأه مزقه", text: sahih('bukhari', 4424, 199, 436), people: ['prophet-muhammad', 'abdullah-ibn-hudhafah'] },
        { title: "أن يمزقوا كل ممزق", text: sahih('bukhari', 4424, 437, 549), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theLetterToKisra;
