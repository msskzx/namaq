import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const nizarIbnMaad = {
  kind: 'PERSON',
  slug: 'nizar-ibn-maad',
  name: 'نزار بن معد',
  nameTransliterated: 'Nizar ibn Maad',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'maad-ibn-adnan', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default nizarIbnMaad;
