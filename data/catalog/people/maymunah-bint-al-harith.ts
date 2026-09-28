import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. Per the retired
 * prisma/personSeedData9.ts entry, her own page notes she was maternal aunt
 * of Khalid ibn al-Walid and of Ibn Abbas -- neither relative is an existing
 * catalog slug, so no relation was added for either; worth a second look.
 */
const maymunahBintAlHarith = {
  kind: 'PERSON',
  slug: 'maymunah-bint-al-harith',
  name: 'ميمونة بنت الحارث',
  nameTransliterated: 'Maymunah bint al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'ميمونة بنت الحارث بن حزن بن بجير بن الهزم بن رويبة بن عبد الله بن هلال بن عامر بن صعصعة الهلالية',
      claims: legacyUnreviewed,
    },
    // Carried from the retired prisma/personSeedData.ts entry, uncited.
    virtues: { value: 'أم المؤمنين، آخر من تزوجها النبي، عرفت بورعها وصلة رحمها.', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'mother-of-believers', name: 'أم المؤمنين', nameTransliterated: 'Mother of the Believers', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'al-harith-ibn-hazn-al-hilali', claims: legacyUnreviewed },
    { type: 'SISTER', inverse: 'SISTER', to: 'umm-al-fadl-bint-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default maymunahBintAlHarith;
