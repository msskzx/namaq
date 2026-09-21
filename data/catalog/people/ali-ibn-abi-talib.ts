import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry and its graph node are retired, so this module is
// the author; what they held and no batch cites is carried below with its
// evidence owed. Chapter two gives one act: the night of the
// hijra, on the Prophet's bed while Quraysh watched the door.
const aliIbnAbiTalib = {
  kind: 'PERSON',
  slug: 'ali-ibn-abi-talib',
  name: 'علي بن أبي طالب',
  nameTransliterated: 'Ali ibn Abi Talib',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'علي بن أبي طالب بن عبد المطلب الهاشمي القرشي', claims: legacyUnreviewed },
    appearance: { value: 'كان ربعة، عريض المنكبين، قوي البنية، كث اللحية.', claims: legacyUnreviewed },
    // ADR 0014 moved أبو الحسن off the abu-al-hasan Title row and onto his
    // kunya, parking it in the seed entry because the catalog was not his
    // author yet. It is now, so the value lands here and the stale Title row
    // goes when this projects.
    kunya: { value: 'أبو الحسن', claims: legacyUnreviewed },
    sex: { value: 'MALE', claims: ['ali/sex'] },
    virtues: {
      value: 'عمد علي فرقد على فراش رسول الله صلى الله عليه وسلم ليلة خروجه مهاجرا، يواري عنه العيون.',
      claims: ['ali/hijra-bed'],
    },
  },
  titles: [
    // Carried from the retired seed entry; no batch cites these yet.
    { title: 'the-ten-promised-paradise', claims: legacyUnreviewed },
    { title: 'the-six-of-the-shura', claims: legacyUnreviewed },
    { title: 'caliph', claims: legacyUnreviewed },
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'al-sabiqoon', claims: ['ali/al-sabiqoon-eight'] },
  ],
  relations: [
    // Carried from neo4j/graphSeedData.ts, whose node declaration is retired
    // with the rest. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON', inverse: 'FATHER', to: 'abu-talib', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'fatimah-bint-asad', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'asma-bint-umays', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'aqil-ibn-abi-talib', claims: legacyUnreviewed },
    { type: 'SON_IN_LAW', inverse: 'FATHER_IN_LAW', to: 'prophet-muhammad', claims: legacyUnreviewed },
    { type: 'PATERNAL_COUSIN', inverse: 'PATERNAL_COUSIN', to: 'prophet-muhammad', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'SON', to: 'al-hasan-ibn-ali', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'SON', to: 'al-husayn-ibn-ali', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'umm-kulthum-bint-ali', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'zaynab-bint-ali', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'fatimah-bint-muhammad', claims: ['ali/husband-fatimah'] },
  ],
} satisfies CatalogPerson;

export default aliIbnAbiTalib;
