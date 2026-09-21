import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. The roster gives him both a nisba and a حلف
// in one breath, النمري حليف بني تميم, which is how the value reads here.
const suhaibIbnSinan = {
  kind: 'PERSON',
  slug: 'suhaib-ibn-sinan',
  name: 'صهيب بن سنان',
  nameTransliterated: 'Suhayb ibn Sinan',
  hasProfile: true,
  fields: {
    tribalAffiliation: { value: 'النمري حليف بني تميم', claims: ['suhayb/hilf'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default suhaibIbnSinan;
