import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const anNadrIbnKinanah = {
  kind: 'PERSON',
  slug: 'an-nadr-ibn-kinanah',
  name: 'النضر بن كنانة',
  nameTransliterated: 'An-Nadr ibn Kinanah',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'kinanah-ibn-khuzayma', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default anNadrIbnKinanah;
