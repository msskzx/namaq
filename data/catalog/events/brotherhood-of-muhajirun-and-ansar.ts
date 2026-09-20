import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The المؤاخاة as a whole, which is what `PACT_BROTHER` records pair by pair.
 * This chapter states the act and its legal effect and names nobody, so only
 * the Prophet is linked. The pairs the app holds come from the companions'
 * own entries: see data/catalog/people/abdur-rahman-ibn-awf.ts.
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
  people: [{ person: 'prophet-muhammad', claims: ['sira/muakhah'] }],
} satisfies CatalogEvent;

export default brotherhoodOfMuhajirunAndAnsar;
