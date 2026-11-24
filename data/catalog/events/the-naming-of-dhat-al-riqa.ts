import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Musa: six of us went out with the Prophet ﷺ sharing one camel, and our feet were holed and my nails fell off, so we
 * wrapped our feet in rags, and it was called the raid of the rags; then he disliked having told it. Told from Sahih
 * al-Bukhari 4128 (al-Maghazi, the chapter on Dhat al-Riqa'), whole.
 *
 * Then Abu Musa's same hadith in Sahih Muslim 1816 (al-Jihad, the raid of Dhat al-Riqa'), whole.
 */
const theNamingOfDhatAlRiqa = {
  kind: 'EVENT',
  slug: 'the-naming-of-dhat-al-riqa',
  name: "تسمية ذات الرقاع",
  nameTransliterated: "How Dhat al-Riqa' got its name",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-musa-al-ashari' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4128, 0, 178),
      source: { slug: 'sahih-al-bukhari', hadith: 4128, url: 'https://sunnah.com/bukhari:4128' },
      moments: [
        { title: "نقبت أقدامنا", text: sahih('bukhari', 4128, 179, 486), people: ['abu-musa-al-ashari', 'prophet-muhammad'] },
        { title: "كره أن يذكره", text: sahih('bukhari', 4128, 487, 647), people: ['abu-musa-al-ashari'] },
      ],
    },
    {
      isnad: sahih('muslim', 1816, 0, 249),
      source: { slug: 'sahih-muslim', hadith: 1816, url: 'https://sunnah.com/muslim:1816' },
      moments: [
        { title: "نقبت أقدامنا", text: sahih('muslim', 1816, 250, 543), people: ['abu-musa-al-ashari', 'prophet-muhammad'] },
        { title: "كره أن يذكره", text: sahih('muslim', 1816, 544, 761), people: ['abu-musa-al-ashari'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theNamingOfDhatAlRiqa;
