import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Named among the dead of Uhud. prisma/personSeedData11.ts declared him too,
 * under the slug abdullah-ibn-jubair, and the spelling was enough to hide him
 * from seedAuthoredPeople's exact match: the catalog took itself for his only
 * author and created a second row beside the seed's. That entry is retired and
 * its two values carried below, so this module is now what it thought it was.
 */
// The archers' commander at Uhud, and the one man of the fifty who obeyed the
// order not to leave the hill. The battle turned on the others leaving it.
const abdullahIbnJubayr = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-jubayr',
  name: 'عبد الله بن جبير',
  nameTransliterated: 'Abdullah ibn Jubayr',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['ibn-jubayr/sex'] },
    virtues: {
      value:
        'أمره رسول الله صلى الله عليه وسلم على الرماة يوم أحد وهم خمسون، وقال: (لا تبرحوا) ، فثبت مكانه حتى استشهد.',
      claims: ['ibn-jubayr/uhud'],
    },
    // Carried from the retired seed entry. The batch names him without his
    // nasab, so the fuller name's evidence is owed.
    fullName: {
      value: 'عبد الله بن جبير بن النعمان بن أمية بن البرك الأنصاري الأوسي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    // Carried from the retired seed entry, like every other صحابي the seeds
    // gave this title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData10.ts, which stated the tie without
    // citing it. The catalog owns his edges now, so it lives here or not at
    // all.
    { type: 'BROTHER', inverse: 'BROTHER', to: 'khawwat-ibn-jubair', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnJubayr;
