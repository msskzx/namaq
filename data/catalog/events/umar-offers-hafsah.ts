import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When Hafsah was widowed of Khunays ibn Hudhafah, a man of Badr, Umar offered her to Uthman, who declined, then to Abu Bakr,
 * who said nothing; the Prophet ﷺ then asked for her, and Abu Bakr told Umar he had known the Prophet ﷺ had spoken of her.
 * Told from Sahih al-Bukhari 4005 (al-Maghazi, in the chapters on Badr), whole. Khunays has no catalog subject and is not
 * linked.
 */
const umarOffersHafsah = {
  kind: 'EVENT',
  slug: 'umar-offers-hafsah',
  name: "عرض عمر حفصة",
  nameTransliterated: "Umar offers Hafsah in marriage",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'hafsa-bint-umar' }, { person: 'uthman-ibn-affan' }, { person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4005, 0, 181),
      source: { slug: 'sahih-al-bukhari', hadith: 4005, url: 'https://sunnah.com/bukhari:4005' },
      moments: [
        { title: "«إن شئت أنكحتك حفصة»", text: sahih('bukhari', 4005, 182, 635), people: ['umar-ibn-al-khattab', 'hafsa-bint-umar', 'uthman-ibn-affan'] },
        { title: "فصمت أبو بكر", text: sahih('bukhari', 4005, 636, 838), people: ['umar-ibn-al-khattab', 'abu-bakr-as-siddiq'] },
        { title: "«ولو تركها لقبلتها»", text: sahih('bukhari', 4005, 839, 1272), people: ['prophet-muhammad', 'hafsa-bint-umar', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default umarOffersHafsah;
