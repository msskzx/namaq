import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. The word came
// while he carried two bricks to everyone else's one, building the mosque.
const ammarIbnYasir = {
  kind: 'PERSON',
  slug: 'ammar-ibn-yasir',
  name: 'عمار بن ياسر',
  nameTransliterated: 'Ammar ibn Yasir',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: {
      value: 'عمار بن ياسر بن عامر بن مالك بن كنانة بن قيس بن الوذيم مولى بني مخزوم العنسي',
      claims: legacyUnreviewed,
    },
    // Ibn Ishaq's roster names him حليف بني مخزوم, the way it names the others
    // by clan. Text, not a link: see README, "What is implemented".
    tribalAffiliation: { value: 'حليف بني مخزوم', claims: ['ammar/hilf'] },
    virtues: {
      value:
        'قال صلى الله عليه وسلم: (ويح عمار، تقتله الفئة الباغية، يدعوهم إلى الجنة ويدعونه إلى النار) .',
      claims: ['ammar/fiah-baghiyah'],
    },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData*.ts, which stated these ties without
    // citing them. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON', inverse: 'FATHER', to: 'yasir-ibn-amir', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ammarIbnYasir;
