import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * NOT a paternal aunt of the Prophet despite the retired
 * prisma/personSeedData10.ts entry listing her among that group: her own
 * page gives her father as al-Zubayr ibn Abd al-Muttalib (a son of Abd
 * al-Muttalib), making her a first cousin. Distinct from the unrelated
 * companion az-Zubayr ibn al-Awwam.
 */
const dubaahBintAlZubayrIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'dubaah-bint-al-zubayr-ibn-abd-al-muttalib',
  name: 'ضباعة بنت الزبير',
  nameTransliterated: 'Dubaah bint al-Zubayr ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'ضباعة بنت الزبير بن عبد المطلب بن هاشم القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'al-zubayr-ibn-abd-al-muttalib-al-hashimi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default dubaahBintAlZubayrIbnAbdAlMuttalib;
