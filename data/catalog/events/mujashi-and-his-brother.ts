import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * After the conquest Mujashi' brought his brother to pledge for hijrah and the Prophet ﷺ said «ذهب أهل الهجرة بما فيها»
 * and took his pledge on islam, iman and jihad. Told from Sahih al-Bukhari (al-Maghazi, the chapter after the conquest),
 * each hadith whole: 4305 first, then 4307, which names the brother as Abu Ma'bad. Mujashi' and his brother have no
 * catalog subject.
 */
const mujashiAndHisBrother = {
  kind: 'EVENT',
  slug: 'mujashi-and-his-brother',
  name: "مجاشع وأخوه بعد الفتح",
  nameTransliterated: "Mujashi' and his brother after the conquest",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4305, 0, 129),
      source: { slug: 'sahih-al-bukhari', hadith: 4305, url: 'https://sunnah.com/bukhari:4305' },
      moments: [
        { title: "«ذهب أهل الهجرة بما فيها»", text: sahih('bukhari', 4305, 130, 508), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4307, 0, 166),
      source: { slug: 'sahih-al-bukhari', hadith: 4307, url: 'https://sunnah.com/bukhari:4307' },
      moments: [
        { title: "«مضت الهجرة لأهلها»", text: sahih('bukhari', 4307, 167, 487), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default mujashiAndHisBrother;
