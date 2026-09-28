import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const saadIbnAlRabi = {
  kind: 'PERSON',
  slug: 'saad-ibn-al-rabi',
  name: 'سعد بن الربيع',
  nameTransliterated: 'Saad ibn al-Rabi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'سعد بن الربيع بن عمرو بن أبي زهير بن مالك بن امرئ القيس بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-rabi-ibn-amr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default saadIbnAlRabi;
