import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In his last illness the Prophet ﷺ called Fatimah and told her something in secret and she wept, then told her something
 * and she laughed; asked, she said he had told her he would die of this illness, then that she would be the first of his
 * family to follow him. Told from Sahih al-Bukhari 4433 (al-Maghazi, the illness of the Prophet ﷺ), whole.
 */
const fatimahWeepsAndLaughs = {
  kind: 'EVENT',
  slug: 'fatimah-weeps-and-laughs',
  name: "بكاء فاطمة وضحكها",
  nameTransliterated: "Fatimah weeps and laughs",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'fatimah-bint-muhammad' }, { person: 'aisha-bint-abi-bakr' }],
  reports: [
    {
      isnad: sahih('bukhari', 4433, 0, 165),
      source: { slug: 'sahih-al-bukhari', hadith: 4433, url: 'https://sunnah.com/bukhari:4433' },
      moments: [
        { title: "سارها فبكت ثم سارها فضحكت", text: sahih('bukhari', 4433, 166, 348), people: ['prophet-muhammad', 'fatimah-bint-muhammad', 'aisha-bint-abi-bakr'] },
        { title: "«أني أول أهله يتبعه»", text: sahih('bukhari', 4433, 349, 529), people: ['fatimah-bint-muhammad', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default fatimahWeepsAndLaughs;
