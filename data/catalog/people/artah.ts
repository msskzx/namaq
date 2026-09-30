import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Graph-only: named in data/history/batches/arwa-bint-abd-al-muttalib-siyar175
 * as Arwa bint Abd al-Muttalib's second husband, by this one name only —
 * the source gives no further nasab for him.
 */
const artah = {
  kind: 'PERSON',
  slug: 'artah',
  name: 'أرطاة',
  nameTransliterated: 'Artah',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default artah;
