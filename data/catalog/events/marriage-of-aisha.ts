import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Aisha: he married her at six; at Madinah, after a fever, her mother Umm Ruman took her from the swing to the Ansar women
 * of the house, who made her ready, and he came to her in the forenoon, when she was nine. Told from Sahih al-Bukhari,
 * each hadith whole, from its chapter on his marrying her (Manaqib al-Ansar): 3894, then 3895, his dream of her before
 * it. 3896 (Urwah's dates for Khadijah's death and the marriage) tells no story and is left out. Umm Ruman has no catalog
 * subject and is not linked.
 */
const marriageOfAisha = {
  kind: 'EVENT',
  slug: 'marriage-of-aisha',
  name: "زواج النبي ﷺ بعائشة",
  nameTransliterated: "The marriage of the Prophet to Aisha",
  type: 'MARRIAGE',
  fields: {},
  people: [{ person: 'aisha-bint-abi-bakr' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 3894, 0, 136),
      source: { slug: 'sahih-al-bukhari', hadith: 3894, url: 'https://sunnah.com/bukhari:3894' },
      moments: [
        { title: "«تزوجني النبي ﷺ وأنا بنت ست سنين»", text: sahih('bukhari', 3894, 137, 327), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "أم رومان تأخذها من الأرجوحة", text: sahih('bukhari', 3894, 328, 653), people: ['aisha-bint-abi-bakr'] },
        { title: "«على الخير والبركة»", text: sahih('bukhari', 3894, 654, 854), people: ['aisha-bint-abi-bakr'] },
        { title: "«فلم يرعني إلا رسول الله ﷺ ضحى»", text: sahih('bukhari', 3894, 855, 970), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3895, 0, 114),
      source: { slug: 'sahih-al-bukhari', hadith: 3895, url: 'https://sunnah.com/bukhari:3895' },
      moments: [
        { title: "«أريتك في المنام مرتين»", text: sahih('bukhari', 3895, 115, 297), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
        { title: "«إن يك هذا من عند الله يمضه»", text: sahih('bukhari', 3895, 298, 353), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default marriageOfAisha;
