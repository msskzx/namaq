import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry and its graph node are retired, so this module is
// the author; what they held and no batch cites is carried below with its
// evidence owed. The chapter's section on his Islam is three
// du'as and Ibn Mas'ud's line; only the du'a in Aishah's narration is a
// sentence about Umar himself rather than about what followed.
const umarIbnAlKhattab = {
  kind: 'PERSON',
  slug: 'umar-ibn-al-khattab',
  name: 'عمر بن الخطاب',
  nameTransliterated: 'Umar ibn al-Khattab',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'عمر بن الخطاب بن نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي', claims: legacyUnreviewed },
    appearance: { value: 'كان طويلًا، أصلع، شديد البياض، قوي البنية.', claims: legacyUnreviewed },
    virtues: {
      value: 'قال صلى الله عليه وسلم: (اللهم أعز الإسلام بعمر بن الخطاب خاصة) .',
      claims: ['umar/virtues-islam'],
    },
  },
  titles: [
    // Carried from the retired seed entry; no batch cites these yet.
    { title: 'the-ten-promised-paradise', claims: legacyUnreviewed },
    { title: 'caliph', claims: legacyUnreviewed },
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'al-farouq', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData.ts, whose node declaration is retired
    // with the rest. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON', inverse: 'FATHER', to: 'al-khattab-ibn-nufayl', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'hafsa-bint-umar', claims: legacyUnreviewed },
    { type: 'FATHER_IN_LAW', inverse: 'SON_IN_LAW', to: 'prophet-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default umarIbnAlKhattab;
