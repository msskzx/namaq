import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent three hundred riders under Abu Ubaydah to watch for a caravan of Quraysh; their food ran out to a date
 * a day and they ate leaves, until the sea threw up a great fish, al-Anbar, which fed them for half a month; Abu Ubaydah set
 * up one of its ribs and a rider passed under it, and back in Medina the Prophet ﷺ said «كلوا، رزقا أخرجه الله» and ate of
 * it. Told from Jabir's hadith in Sahih al-Bukhari (al-Maghazi, the raid of Sif al-Bahr), each whole: 4361 first, then
 * 4360 and 4362. In 4361 Amr adds that Qays ibn Sa'd slaughtered for the army and told his father; Qays is Qays ibn Sa'd
 * ibn Ubadah (his father in the catalog), who is linked.
 */
const theArmyOfAlKhabat = {
  kind: 'EVENT',
  slug: 'the-army-of-al-khabat',
  name: "جيش الخبط",
  nameTransliterated: "The army of al-Khabat",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-ubaydah-ibn-al-jarrah' }, { person: 'jabir-ibn-abdullah' }, { person: 'qais-ibn-saad' }, { person: 'saad-ibn-ubadah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4361, 0, 163),
      source: { slug: 'sahih-al-bukhari', hadith: 4361, url: 'https://sunnah.com/bukhari:4361' },
      moments: [
        { title: "جيش الخبط", text: sahih('bukhari', 4361, 164, 425), people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah', 'jabir-ibn-abdullah'] },
        { title: "دابة يقال لها العنبر", text: sahih('bukhari', 4361, 426, 798), people: ['abu-ubaydah-ibn-al-jarrah', 'jabir-ibn-abdullah'] },
        { title: "نحر ثلاث جزائر", text: sahih('bukhari', 4361, 799, 972), people: ['abu-ubaydah-ibn-al-jarrah'] },
        { title: "قيس بن سعد وأبوه", text: sahih('bukhari', 4361, 973, 1288), people: ['qais-ibn-saad', 'saad-ibn-ubadah'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4360, 0, 140),
      source: { slug: 'sahih-al-bukhari', hadith: 4360, url: 'https://sunnah.com/bukhari:4360' },
      moments: [
        { title: "فني الزاد", text: sahih('bukhari', 4360, 141, 620), people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah', 'jabir-ibn-abdullah'] },
        { title: "حوت مثل الظرب", text: sahih('bukhari', 4360, 621, 896), people: ['abu-ubaydah-ibn-al-jarrah'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4362, 0, 135),
      source: { slug: 'sahih-al-bukhari', hadith: 4362, url: 'https://sunnah.com/bukhari:4362' },
      moments: [
        { title: "حوت لم نر مثله", text: sahih('bukhari', 4362, 136, 413), people: ['abu-ubaydah-ibn-al-jarrah', 'jabir-ibn-abdullah'] },
        { title: "«رزقا أخرجه الله»", text: sahih('bukhari', 4362, 414, 685), people: ['abu-ubaydah-ibn-al-jarrah', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theArmyOfAlKhabat;
