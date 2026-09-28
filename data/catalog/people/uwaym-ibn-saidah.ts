import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const uwaymIbnSaidah = {
  kind: 'PERSON',
  slug: 'uwaym-ibn-saidah',
  name: 'عويم بن ساعدة',
  nameTransliterated: 'Uwaym ibn Saidah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عويم بن ساعدة بن عائش بن قيس بن النعمان بن زيد بن أمية الأنصاري الأوسي من بني عمرو بن عوف',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'saidah-ibn-aish', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default uwaymIbnSaidah;
