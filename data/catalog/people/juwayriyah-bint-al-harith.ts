import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const juwayriyahBintAlHarith = {
  kind: 'PERSON',
  slug: 'juwayriyah-bint-al-harith',
  name: 'جويرية بنت الحارث',
  nameTransliterated: 'Juwayriyah bint al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'جويرية بنت الحارث بن أبي ضرار المصطلقية', claims: legacyUnreviewed },
    // Carried from the retired prisma/personSeedData.ts entry, uncited.
    appearance: { value: 'وصفت بأنها كانت ذات جمال فاتن.', claims: legacyUnreviewed },
    virtues: {
      value: 'أم المؤمنين، من سبايا غزوة بني المصطلق، أسلمت وتزوجها النبي، كان زواجها سببًا في إعتاق مئات الأسرى من قومها.',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'mother-of-believers', name: 'أم المؤمنين', nameTransliterated: 'Mother of the Believers', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'al-harith-ibn-abi-dirar-al-mustaliqi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default juwayriyahBintAlHarith;
