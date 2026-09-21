import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. The word came while he carried two bricks to
// everyone else's one, building the mosque.
const ammarIbnYasir = {
  kind: 'PERSON',
  slug: 'ammar-ibn-yasir',
  name: 'عمار بن ياسر',
  nameTransliterated: 'Ammar ibn Yasir',
  hasProfile: true,
  fields: {
    // Ibn Ishaq's roster names him حليف بني مخزوم, the way it names the others
    // by clan. Text, not a link: see README, "What is implemented".
    tribalAffiliation: { value: 'حليف بني مخزوم', claims: ['ammar/hilf'] },
    virtues: {
      value: 'قال صلى الله عليه وسلم: (ويح عمار، تقتله الفئة الباغية، يدعوهم إلى الجنة ويدعونه إلى النار) .',
      claims: ['ammar/fiah-baghiyah'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default ammarIbnYasir;
