import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

// Shortly after Badr. The chapter gives his rank among the first Muslims and
// his manner rather than a cause. Told as a story from Sahih al-Bukhari 3929 (Umm al-Ala), whole; Umm
// al-Ala has no catalog subject and is not linked.
const deathOfUthmanIbnMazun = {
  kind: 'EVENT',
  slug: 'death-of-uthman-ibn-mazun',
  name: 'وفاة عثمان بن مظعون',
  nameTransliterated: 'The Death of Uthman ibn Mazun',
  type: 'DEATH',
  fields: {
    hijriYear: { value: 2, claims: ['ibn-mazun/death'] },
    description: {
      value:
        'توفي بعد بدر بيسير، وهو أحد السابقين، أسلم بعد ثلاثة عشر رجلا، وهاجر إلى الحبشة الهجرة الأولى، وكان صواما قواما قانتا لله.',
      claims: ['ibn-mazun/death'],
    },
  },
  people: [{ person: 'uthman-ibn-mazun', claims: ['ibn-mazun/death'] }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3929, 0, 230),
      source: { slug: 'sahih-al-bukhari', hadith: 3929, url: 'https://sunnah.com/bukhari:3929' },
      moments: [
        { title: "طار لهم في السكنى", text: sahih('bukhari', 3929, 231, 353), people: ['uthman-ibn-mazun'] },
        { title: "«لقد أكرمك الله»", text: sahih('bukhari', 3929, 354, 603), people: ['uthman-ibn-mazun', 'prophet-muhammad'] },
        { title: "«وما يدريك أن الله أكرمه»", text: sahih('bukhari', 3929, 604, 951), people: ['prophet-muhammad', 'uthman-ibn-mazun'] },
        { title: "«ذلك عمله»", text: sahih('bukhari', 3929, 952, 1114), people: ['uthman-ibn-mazun', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default deathOfUthmanIbnMazun;
