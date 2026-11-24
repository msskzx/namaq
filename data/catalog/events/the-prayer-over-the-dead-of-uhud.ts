import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Eight years after Uhud the Prophet ﷺ prayed over its dead, as one taking leave of the living and the dead, then went up
 * the minbar: «إني بين أيديكم فرط… ولكني أخشى عليكم الدنيا أن تنافسوها»; it was Uqbah's last look at him. Told from Sahih
 * al-Bukhari, each hadith whole: 4042 first, then 4085.
 */
const thePrayerOverTheDeadOfUhud = {
  kind: 'EVENT',
  slug: 'the-prayer-over-the-dead-of-uhud',
  name: "الصلاة على قتلى أحد",
  nameTransliterated: "The prayer over the dead of Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'uqbah-ibn-amir-al-juhani' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4042, 0, 219),
      source: { slug: 'sahih-al-bukhari', hadith: 4042, url: 'https://sunnah.com/bukhari:4042' },
      moments: [
        { title: "صلى على قتلى أحد بعد ثماني سنين", text: sahih('bukhari', 4042, 220, 334), people: ['prophet-muhammad'] },
        { title: "«إني بين أيديكم فرط»", text: sahih('bukhari', 4042, 335, 625), people: ['prophet-muhammad'] },
        { title: "آخر نظرة", text: sahih('bukhari', 4042, 626, 693), people: ['uqbah-ibn-amir-al-juhani', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4085, 0, 124),
      source: { slug: 'sahih-al-bukhari', hadith: 4085, url: 'https://sunnah.com/bukhari:4085' },
      moments: [
        { title: "صلى على أهل أحد", text: sahih('bukhari', 4085, 125, 217), people: ['prophet-muhammad'] },
        { title: "«إني فرط لكم»", text: sahih('bukhari', 4085, 218, 551), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thePrayerOverTheDeadOfUhud;
