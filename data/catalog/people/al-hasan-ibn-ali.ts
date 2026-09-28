import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName, appearance, virtues,
 * titles and the ayat below are carried from the retired
 * prisma/personSeedData.ts entry, uncited.
 */
const alHasanIbnAli = {
  kind: 'PERSON',
  slug: 'al-hasan-ibn-ali',
  name: 'الحسن بن علي',
  nameTransliterated: 'Al-Hasan ibn Ali',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'الحسن بن علي بن أبي طالب الهاشمي القرشي', claims: legacyUnreviewed },
    appearance: {
      value: 'كان يشبه النبي صلى الله عليه وسلم في ملامحه.',
      claims: legacyUnreviewed,
    },
    virtues: {
      value: 'سبط النبي وريحانته، سيد شباب أهل الجنة، خامس الخلفاء الراشدين، تنازل عن الخلافة حقناً لدماء المسلمين.',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'sayyid-shabab-ahl-al-jannah', name: 'سيد شباب أهل الجنة', nameTransliterated: 'Master of the Youth of Paradise', claims: legacyUnreviewed },
    { title: 'caliph', name: 'خليفة', nameTransliterated: 'Caliph', claims: legacyUnreviewed },
  ],
  ayat: [
    { surah: 76, ayah: 8, claims: legacyUnreviewed },
    { surah: 33, ayah: 33, claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'MOTHER', to: 'fatimah-bint-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHasanIbnAli;
