import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Graph-only: named in data/history/batches/arwa-bint-abd-al-muttalib-siyar175
 * as Arwa bint Abd al-Muttalib's first husband, with nothing else the source
 * says about him.
 */
const umayrIbnWahb = {
  kind: 'PERSON',
  slug: 'umayr-ibn-wahb',
  name: 'عمير بن وهب',
  nameTransliterated: 'Umayr ibn Wahb',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default umayrIbnWahb;
