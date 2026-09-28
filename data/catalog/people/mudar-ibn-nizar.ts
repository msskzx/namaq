import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named only in prophet-muhammad.ts's nasab chain (see
 * data/history/batches/prophet-muhammad-sira/batch.json, claim
 * prophet/lineage): al-Dhahabi's one sentence names the whole chain to
 * Adnan, nothing more, so this stays graph-only.
 */
const mudarIbnNizar = {
  kind: 'PERSON',
  slug: 'mudar-ibn-nizar',
  name: 'مضر بن نزار',
  nameTransliterated: 'Mudar ibn Nizar',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'nizar-ibn-maad', claims: ['prophet/lineage'] },
  ],
} satisfies CatalogPerson;

export default mudarIbnNizar;
