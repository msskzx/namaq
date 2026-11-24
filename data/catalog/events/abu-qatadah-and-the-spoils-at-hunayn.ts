import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Hunayn Abu Qatadah struck down a mushrik who had a Muslim under him and was crushed in his grip until death let go of
 * him; when the Prophet ﷺ said the spoils of a man go to whoever killed him with proof, another man held them, and Abu
 * Bakr said «لاها الله إذا»; the Prophet ﷺ said «صدق، فأعطه», and with it Abu Qatadah bought his first property. Told from
 * Sahih al-Bukhari (al-Maghazi, the chapter on Hunayn), each hadith whole: 4321 first; then 4322, given by al-Bukhari
 * with «وقال الليث». The man holding the spoils is not named. Sahih Muslim 1751 only points to this hadith («واقتص
 * الحديث») and is not told.
 */
const abuQatadahAndTheSpoilsAtHunayn = {
  kind: 'EVENT',
  slug: 'abu-qatadah-and-the-spoils-at-hunayn',
  name: "سلب أبي قتادة يوم حنين",
  nameTransliterated: "Abu Qatadah and the spoils at Hunayn",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-qatadah-al-ansari' }, { person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4321, 0, 199),
      source: { slug: 'sahih-al-bukhari', hadith: 4321, url: 'https://sunnah.com/bukhari:4321' },
      moments: [
        { title: "ضمني ضمة وجدت منها ريح الموت", text: sahih('bukhari', 4321, 200, 654), people: ['abu-qatadah-al-ansari', 'umar-ibn-al-khattab'] },
        { title: "«من قتل قتيلا له عليه بينة فله سلبه»", text: sahih('bukhari', 4321, 655, 1074), people: ['prophet-muhammad', 'abu-qatadah-al-ansari'] },
        { title: "«لاها الله إذا»", text: sahih('bukhari', 4321, 1075, 1382), people: ['abu-bakr-as-siddiq', 'prophet-muhammad', 'abu-qatadah-al-ansari'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4322, 0, 167),
      source: { slug: 'sahih-al-bukhari', hadith: 4322, url: 'https://sunnah.com/bukhari:4322' },
      moments: [
        { title: "ضمني ضما شديدا", text: sahih('bukhari', 4322, 168, 727), people: ['abu-qatadah-al-ansari', 'umar-ibn-al-khattab'] },
        { title: "«من أقام بينة على قتيل قتله فله سلبه»", text: sahih('bukhari', 4322, 728, 1114), people: ['prophet-muhammad', 'abu-qatadah-al-ansari'] },
        { title: "«كلا، لا يعطه أصيبغ من قريش»", text: sahih('bukhari', 4322, 1115, 1390), people: ['abu-bakr-as-siddiq', 'prophet-muhammad', 'abu-qatadah-al-ansari'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuQatadahAndTheSpoilsAtHunayn;
