import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const malikIbnAnNadrAlNajjari = {
  kind: 'PERSON',
  slug: 'malik-ibn-an-nadr-al-najjari',
  name: 'مالك بن النضر',
  nameTransliterated: 'Malik ibn An Nadr Al Najjari',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'an-nadr-ibn-damdam', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-sulaym-al-ghumaysa', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default malikIbnAnNadrAlNajjari;
