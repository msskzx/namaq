import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Seed-declared, so the catalog only adds. The chapter gives a great deal the
 * model has no shape for: الطاهرة as her name in the jahiliyyah, her two
 * husbands before him, her age at marriage and at death, and the house of
 * قصب she was promised. Only the virtues land, in the Prophet's own words.
 */
const khadijahBintKhuwaylid = {
  kind: 'PERSON',
  slug: 'khadijah-bint-khuwaylid',
  name: 'خديجة بنت خويلد',
  nameTransliterated: 'Khadijah bint Khuwaylid',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'خديجة بنت خويلد بن أسد بن عبد العزى بن قصي القرشية الأسدية', claims: legacyUnreviewed },
    sex: { value: 'FEMALE', claims: ['khadijah/sex'] },
    virtues: {
      value:
        'قال صلى الله عليه وسلم: (والله لقد آمنت بي إذ كفر بي الناس، وآوتني إذ رفضني الناس، وصدقتني إذ كذبني الناس، ورزقت منها الولد) .',
      claims: ['khadijah/virtues'],
    },
  },
  titles: [
    // Carried from the retired seed entry; no batch cites these yet.
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'mother-of-believers', claims: legacyUnreviewed },
    { title: 'first-wife', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData.ts, whose node declaration is retired
    // with the rest. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'khuwaylid-ibn-asad', claims: legacyUnreviewed },
    { type: 'SISTER', inverse: 'BROTHER', to: 'hizam-ibn-khuwaylid', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default khadijahBintKhuwaylid;
