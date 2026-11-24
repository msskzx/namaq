import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The المؤاخاة as a whole, which is what `PACT_BROTHER` records pair by pair.
 * This chapter states the act and its legal effect and names nobody, so only
 * the Prophet is linked. The pairs the app holds come from the companions'
 * own entries: see data/catalog/people/abdur-rahman-ibn-awf.ts.
 *
 * Told as a story from Sahih al-Bukhari 3937 (Anas: Abd al-Rahman ibn Awf and Sa'd ibn al-Rabi'), whole.
 */
const brotherhoodOfMuhajirunAndAnsar = {
  kind: 'EVENT',
  slug: 'brotherhood-of-muhajirun-and-ansar',
  name: 'المؤاخاة بين المهاجرين والأنصار',
  nameTransliterated: 'The Brotherhood of Muhajirun and Ansar',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 1, claims: ['sira/muakhah'] },
    description: {
      value:
        'آخى رسول الله صلى الله عليه وسلم بين المهاجرين والأنصار على المواساة والحق، وورث بعضهم من بعض حتى نزلت: {وَأُولُوا الْأَرْحَامِ بَعْضُهُمْ أَوْلَى بِبَعْضٍ} .',
      claims: ['sira/muakhah'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/muakhah'] }, { person: 'abdur-rahman-ibn-awf' }, { person: 'saad-ibn-al-rabi' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3937, 0, 104),
      source: { slug: 'sahih-al-bukhari', hadith: 3937, url: 'https://sunnah.com/bukhari:3937' },
      moments: [
        { title: "أن يناصفه أهله وماله", text: sahih('bukhari', 3937, 105, 372), people: ['abdur-rahman-ibn-awf', 'prophet-muhammad', 'saad-ibn-al-rabi'] },
        { title: "وعليه وضر من صفرة", text: sahih('bukhari', 3937, 373, 481), people: ['abdur-rahman-ibn-awf', 'prophet-muhammad'] },
        { title: "«أولم ولو بشاة»", text: sahih('bukhari', 3937, 482, 714), people: ['prophet-muhammad', 'abdur-rahman-ibn-awf'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default brotherhoodOfMuhajirunAndAnsar;
