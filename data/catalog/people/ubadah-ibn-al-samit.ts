import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ubadahIbnAlSamit = {
  kind: 'PERSON',
  slug: 'ubadah-ibn-al-samit',
  name: 'عبادة بن الصامت',
  nameTransliterated: 'Ubadah ibn al-Samit',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عبادة بن الصامت بن قيس بن أصرم بن فهر بن ثعلبة بن غنم بن عوف بن عمرو بن عوف الأنصاري الخزرجي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-samit-ibn-qais-al-khazraji', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-haram-bint-milhan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ubadahIbnAlSamit;
