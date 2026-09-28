import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const malikIbnAnNadr = {
  kind: 'PERSON',
  slug: 'malik-ibn-an-nadr',
  name: 'مالك بن النضر',
  nameTransliterated: 'Malik ibn an-Nadr',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'an-nadr-ibn-kinanah', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default malikIbnAnNadr;
