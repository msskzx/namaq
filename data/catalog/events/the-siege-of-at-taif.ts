import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ besieged al-Ta'if and gained nothing, and said «إنا قافلون إن شاء الله»; it weighed on them, so he said
 * «اغدوا على القتال», they were wounded, and when he said again they would leave tomorrow they were pleased and he laughed.
 * Told from Abd Allah ibn Amr's hadith: Sahih al-Bukhari 4325 (al-Maghazi, the raid of al-Ta'if) first, whole; then
 * Sahih Muslim 1778 (al-Jihad, the raid of al-Ta'if), whole.
 */
const theSiegeOfAtTaif = {
  kind: 'EVENT',
  slug: 'the-siege-of-at-taif',
  name: "حصار الطائف",
  nameTransliterated: "The siege of al-Ta'if",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4325, 0, 156),
      source: { slug: 'sahih-al-bukhari', hadith: 4325, url: 'https://sunnah.com/bukhari:4325' },
      moments: [
        { title: "«إنا قافلون إن شاء الله»", text: sahih('bukhari', 4325, 157, 360), people: ['prophet-muhammad'] },
        { title: "«اغدوا على القتال»", text: sahih('bukhari', 4325, 361, 627), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1778, 0, 263),
      source: { slug: 'sahih-muslim', hadith: 1778, url: 'https://sunnah.com/muslim:1778' },
      moments: [
        { title: "«إنا قافلون، إن شاء الله»", text: sahih('muslim', 1778, 264, 437), people: ['prophet-muhammad'] },
        { title: "«اغدوا على القتال»", text: sahih('muslim', 1778, 438, 650), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theSiegeOfAtTaif;
