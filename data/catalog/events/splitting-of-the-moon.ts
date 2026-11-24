import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

// At Mecca, قبل مخرج النبي صلى الله عليه وسلم to Medina, which dates it before
// the hijra and to no year the model can hold.
//
// Told as a story from Sahih al-Bukhari, each hadith whole (Manaqib al-Ansar, the chapter on the splitting of the moon): Ibn Mas'ud's
// 3869 first, then Anas's 3868 and Ibn Abbas's 3870. 3871 is 3869's chain cut to «انشق القمر» and is not repeated.
const splittingOfTheMoon = {
  kind: 'EVENT',
  slug: 'splitting-of-the-moon',
  name: 'انشقاق القمر',
  nameTransliterated: 'The Splitting of the Moon',
  type: 'OTHER',
  fields: {
    description: {
      value:
        'سأل أهل مكة النبي صلى الله عليه وسلم أن يريهم آية، فانشق القمر فرقتين، شقة على أبي قبيس وشقة على السويداء، فقال: اشهدوا. وفيه نزل: {اقْتَرَبَتِ السَّاعَةُ وَانْشَقَّ الْقَمَرُ} .',
      claims: ['sira/splitting-moon'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/splitting-moon'] }, { person: 'abdullah-ibn-masud' }],
  reports: [
    {
      isnad: sahih('bukhari', 3869, 0, 132),
      source: { slug: 'sahih-al-bukhari', hadith: 3869, url: 'https://sunnah.com/bukhari:3869' },
      moments: [
        { title: "انشق ونحن معه بمنى", text: sahih('bukhari', 3869, 133, 195), people: ['abdullah-ibn-masud', 'prophet-muhammad'] },
        { title: "«اشهدوا»", text: sahih('bukhari', 3869, 196, 253), people: ['prophet-muhammad'] },
        { title: "«انشق بمكة»", text: sahih('bukhari', 3869, 254, 451), people: ['abdullah-ibn-masud'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3868, 0, 182),
      source: { slug: 'sahih-al-bukhari', hadith: 3868, url: 'https://sunnah.com/bukhari:3868' },
      moments: [
        { title: "سألوه أن يريهم آية", text: sahih('bukhari', 3868, 183, 252), people: ['prophet-muhammad'] },
        { title: "حتى رأوا حراء بينهما", text: sahih('bukhari', 3868, 253, 324), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3870, 0, 251),
      source: { slug: 'sahih-al-bukhari', hadith: 3870, url: 'https://sunnah.com/bukhari:3870' },
      moments: [
        { title: "على زمان رسول الله ﷺ", text: sahih('bukhari', 3870, 252, 309), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default splittingOfTheMoon;
