import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A young widow stopped Umar in the market: her father Khufaf ibn Ima' had been at al-Hudaybiyah with the Prophet ﷺ; Umar
 * loaded a camel with food, money and clothes for her, and to the man who said he had given too much answered that her father
 * and brother had besieged a fort and taken it. Told from Sahih al-Bukhari 4160 (al-Maghazi, the chapter on al-Hudaybiyah),
 * whole. Khufaf has no catalog subject and is not linked.
 */
const umarAndTheDaughterOfKhufaf = {
  kind: 'EVENT',
  slug: 'umar-and-the-daughter-of-khufaf',
  name: "عمر وابنة خفاف بن إيماء",
  nameTransliterated: "Umar and the daughter of Khufaf",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4160, 0, 115),
      source: { slug: 'sahih-al-bukhari', hadith: 4160, url: 'https://sunnah.com/bukhari:4160' },
      moments: [
        { title: "«هلك زوجي وترك صبية صغارا»", text: sahih('bukhari', 4160, 116, 517), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "«مرحبا بنسب قريب»", text: sahih('bukhari', 4160, 518, 869), people: ['umar-ibn-al-khattab'] },
        { title: "«ثكلتك أمك»", text: sahih('bukhari', 4160, 870, 1113), people: ['umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default umarAndTheDaughterOfKhufaf;
