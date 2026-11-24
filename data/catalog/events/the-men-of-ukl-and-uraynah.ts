import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Men of Ukl and Uraynah came to Medina professing Islam, found it unhealthy, and were sent out to the camels to drink their
 * milk; they turned from Islam, killed the herdsman and drove the camels off, and were pursued and punished. Told from
 * Sahih al-Bukhari 4192 (al-Maghazi, the chapter on Ukl and Uraynah), whole, with Qatadah's word that he afterwards urged
 * charity and forbade mutilation. 4193 tells only how Abu Qilabah cited it («ذكر القصة») and is not repeated.
 */
const theMenOfUklAndUraynah = {
  kind: 'EVENT',
  slug: 'the-men-of-ukl-and-uraynah',
  name: "العرنيون",
  nameTransliterated: "The men of Ukl and Uraynah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4192, 0, 154),
      source: { slug: 'sahih-al-bukhari', hadith: 4192, url: 'https://sunnah.com/bukhari:4192' },
      moments: [
        { title: "استوخموا المدينة", text: sahih('bukhari', 4192, 155, 511), people: ['prophet-muhammad'] },
        { title: "كفروا بعد إسلامهم", text: sahih('bukhari', 4192, 512, 845), people: ['prophet-muhammad'] },
        { title: "ينهى عن المثلة", text: sahih('bukhari', 4192, 846, 1144), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMenOfUklAndUraynah;
