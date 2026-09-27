import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Died from a mule accident after disembarking from the Cyprus expedition,
 * per the retired prisma/personSeedData10.ts entry's account of a prophetic
 * dream about her people "riding the sea like kings." Her husband Ubadah
 * ibn al-Samit already declares the marriage from his own side.
 */
const ummHaramBintMilhan = {
  kind: 'PERSON',
  slug: 'umm-haram-bint-milhan',
  name: 'أم حرام',
  nameTransliterated: 'Umm Haram bint Milhan',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'أم حرام بنت ملحان بن خالد بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصارية النجارية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'milhan-ibn-khalid-al-najjari', claims: legacyUnreviewed },
    { type: 'SISTER', inverse: 'SISTER', to: 'umm-sulaym-al-ghumaysa', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummHaramBintMilhan;
