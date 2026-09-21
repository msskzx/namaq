import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry and its graph node are retired, so this module is
// the author; what they held and no batch cites is carried below with its
// evidence owed. أم المساكين is not a new title; the sira is
// simply where it is cited for her. She lived months after the marriage.
const zaynabBintKhuzaymah = {
  kind: 'PERSON',
  slug: 'zaynab-bint-khuzaymah',
  name: 'زينب بنت خزيمة',
  nameTransliterated: 'Zaynab bint Khuzaymah',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'زينب بنت خزيمة بن الحارث بن عبد الله الهلالية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'umm-al-masakeen', claims: ['zaynab-khuzaymah/umm-al-masakeen'] },
    // Carried from the retired seed entry; no batch cites these yet.
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'mother-of-believers', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData.ts, whose node declaration is retired
    // with the rest. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zaynabBintKhuzaymah;
