import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the people broke away from the Prophet ﷺ at Uhud, Abu Talhah stood before him with his shield, shooting, «نحري دون
 * نحرك», while Aisha and Umm Sulaym carried water skins to the wounded. Told from Sahih al-Bukhari 4064 (al-Maghazi, the
 * chapter on Uhud), whole.
 *
 * Then Anas's same hadith in Sahih Muslim 1811 (al-Jihad, women going out with the men), whole.
 */
const abuTalhahAtUhud = {
  kind: 'EVENT',
  slug: 'abu-talhah-at-uhud',
  name: "أبو طلحة يوم أحد",
  nameTransliterated: "Abu Talhah at Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-talha-al-ansari' }, { person: 'anas-ibn-malik' }, { person: 'aisha-bint-abi-bakr' }, { person: 'umm-sulaym-al-ghumaysa' }],
  reports: [
    {
      isnad: sahih('bukhari', 4064, 0, 119),
      source: { slug: 'sahih-al-bukhari', hadith: 4064, url: 'https://sunnah.com/bukhari:4064' },
      moments: [
        { title: "مجوب عليه بحجفة له", text: sahih('bukhari', 4064, 120, 468), people: ['prophet-muhammad', 'abu-talha-al-ansari'] },
        { title: "«نحري دون نحرك»", text: sahih('bukhari', 4064, 469, 655), people: ['prophet-muhammad', 'abu-talha-al-ansari'] },
        { title: "تنقزان القرب على متونهما", text: sahih('bukhari', 4064, 656, 953), people: ['anas-ibn-malik', 'aisha-bint-abi-bakr', 'umm-sulaym-al-ghumaysa'] },
        { title: "وقع السيف من يديه", text: sahih('bukhari', 4064, 954, 1046), people: ['abu-talha-al-ansari'] },
      ],
    },
    {
      isnad: sahih('muslim', 1811, 0, 247),
      source: { slug: 'sahih-muslim', hadith: 1811, url: 'https://sunnah.com/muslim:1811' },
      moments: [
        { title: "مجوب عليه بجحفة", text: sahih('muslim', 1811, 248, 563), people: ['prophet-muhammad', 'abu-talha-al-ansari'] },
        { title: "«نحري دون نحرك»", text: sahih('muslim', 1811, 564, 761), people: ['prophet-muhammad', 'abu-talha-al-ansari'] },
        { title: "تنقلان القرب على متونهما", text: sahih('muslim', 1811, 762, 1061), people: ['anas-ibn-malik', 'aisha-bint-abi-bakr', 'umm-sulaym-al-ghumaysa'] },
        { title: "وقع السيف من يدي أبي طلحة", text: sahih('muslim', 1811, 1062, 1139), people: ['abu-talha-al-ansari'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuTalhahAtUhud;
