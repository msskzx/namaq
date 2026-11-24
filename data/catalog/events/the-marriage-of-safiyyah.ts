import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Safiyyah bint Huyayy, a bride whose husband was killed at Khaybar, was chosen by the Prophet ﷺ for himself; he married her
 * on the road back at Sadd al-Sahba', Anas called the people to a wedding feast of dates, cottage cheese and butter, and when
 * he set off he screened her behind him and knelt so she could mount from his knee. Told from Sahih al-Bukhari (al-Maghazi, the
 * chapter on Khaybar), each hadith whole: Anas's 4211 first, the fullest; then 4213, 4212 and 4201.
 */
const theMarriageOfSafiyyah = {
  kind: 'EVENT',
  slug: 'the-marriage-of-safiyyah',
  name: "زواجه ﷺ بصفية",
  nameTransliterated: "His marriage to Safiyyah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'safiyyah-bint-huyayy' }, { person: 'prophet-muhammad' }, { person: 'anas-ibn-malik' }, { person: 'bilal-ibn-rabah' }],
  reports: [
    {
      isnad: sahih('bukhari', 4211, 0, 287),
      source: { slug: 'sahih-al-bukhari', hadith: 4211, url: 'https://sunnah.com/bukhari:4211' },
      moments: [
        { title: "اصطفاها لنفسه", text: sahih('bukhari', 4211, 288, 493), people: ['safiyyah-bint-huyayy', 'prophet-muhammad'] },
        { title: "«آذن من حولك»", text: sahih('bukhari', 4211, 494, 710), people: ['prophet-muhammad', 'safiyyah-bint-huyayy', 'anas-ibn-malik'] },
        { title: "تضع رجلها على ركبته", text: sahih('bukhari', 4211, 711, 925), people: ['prophet-muhammad', 'safiyyah-bint-huyayy'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4213, 0, 168),
      source: { slug: 'sahih-al-bukhari', hadith: 4213, url: 'https://sunnah.com/bukhari:4213' },
      moments: [
        { title: "التمر والأقط والسمن", text: sahih('bukhari', 4213, 169, 486), people: ['prophet-muhammad', 'safiyyah-bint-huyayy', 'anas-ibn-malik', 'bilal-ibn-rabah'] },
        { title: "«إن حجبها فهي إحدى أمهات المؤمنين»", text: sahih('bukhari', 4213, 487, 698), people: [] },
        { title: "ومد الحجاب", text: sahih('bukhari', 4213, 699, 762), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4212, 0, 148),
      source: { slug: 'sahih-al-bukhari', hadith: 4212, url: 'https://sunnah.com/bukhari:4212' },
      moments: [
        { title: "أقام عليها ثلاثة أيام", text: sahih('bukhari', 4212, 149, 317), people: ['prophet-muhammad', 'safiyyah-bint-huyayy'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4201, 0, 134),
      source: { slug: 'sahih-al-bukhari', hadith: 4201, url: 'https://sunnah.com/bukhari:4201' },
      moments: [
        { title: "«أصدقها نفسها»", text: sahih('bukhari', 4201, 135, 284), people: ['prophet-muhammad', 'safiyyah-bint-huyayy'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMarriageOfSafiyyah;
