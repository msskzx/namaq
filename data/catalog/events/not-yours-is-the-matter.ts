import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ cursed men of Quraysh by name in the dawn prayer, and Allah sent down «ليس لك من الأمر شيء»; in Anas's report
 * it came when he wiped the blood from his face at Uhud saying «كيف يفلح قوم شجوا نبيهم». Told from the two Sahihs, each
 * hadith whole: Ibn Umar's Sahih al-Bukhari 4069 first (al-Maghazi, the chapter on that ayah); then Salim's 4070, which
 * names those he cursed; then Anas's Sahih Muslim 1791. Suhayl ibn Amr and al-Harith ibn Hisham have no catalog subject
 * and are not linked.
 */
const notYoursIsTheMatter = {
  kind: 'EVENT',
  slug: 'not-yours-is-the-matter',
  name: "«ليس لك من الأمر شيء»",
  nameTransliterated: "Not yours is the matter",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'safwan-ibn-umayyah' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '3:128',
      to: '3:128',
      evidence: [
        { source: 'sahih-al-bukhari', hadith: 4069, url: 'https://sunnah.com/bukhari:4069', quote: sahih('bukhari', 4069, 401, 494) },
        { source: 'sahih-al-bukhari', hadith: 4070, url: 'https://sunnah.com/bukhari:4070', quote: sahih('bukhari', 4070, 198, 285) },
        { source: 'sahih-muslim', hadith: 1791, url: 'https://sunnah.com/muslim:1791', quote: sahih('muslim', 1791, 317, 377) },
      ],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4069, 0, 150),
      source: { slug: 'sahih-al-bukhari', hadith: 4069, url: 'https://sunnah.com/bukhari:4069' },
      moments: [
        { title: "«اللهم العن فلانا وفلانا وفلانا»", text: sahih('bukhari', 4069, 151, 400), people: ['prophet-muhammad'] },
        { title: "«ليس لك من الأمر شيء»", text: sahih('bukhari', 4069, 401, 496), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 4070, 0, 82),
      source: { slug: 'sahih-al-bukhari', hadith: 4070, url: 'https://sunnah.com/bukhari:4070' },
      moments: [
        { title: "يدعو على صفوان بن أمية", text: sahih('bukhari', 4070, 83, 197), people: ['prophet-muhammad', 'safwan-ibn-umayyah'] },
        { title: "«ليس لك من الأمر شيء»", text: sahih('bukhari', 4070, 198, 286), people: [] },
      ],
    },
    {
      isnad: sahih('muslim', 1791, 0, 114),
      source: { slug: 'sahih-muslim', hadith: 1791, url: 'https://sunnah.com/muslim:1791' },
      moments: [
        { title: "«كيف يفلح قوم شجوا نبيهم؟»", text: sahih('muslim', 1791, 115, 316), people: ['prophet-muhammad'] },
        { title: "«ليس لك من الأمر شيء»", text: sahih('muslim', 1791, 317, 397), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default notYoursIsTheMatter;
