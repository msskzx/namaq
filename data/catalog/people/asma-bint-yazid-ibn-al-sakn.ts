import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Father named, no deeper chain given, so no separate ancestor node. Cousin
 * of the companion Muadh ibn Jabal per the retired
 * prisma/personSeedData10.ts entry, which describes her as daughter of his
 * paternal aunt. Killed nine Byzantine soldiers with a tent pole at the
 * Battle of Yarmouk, per her own entry.
 */
const asmaBintYazidIbnAlSakn = {
  kind: 'PERSON',
  slug: 'asma-bint-yazid-ibn-al-sakn',
  name: 'أسماء بنت يزيد بن السكن',
  nameTransliterated: 'Asma bint Yazid ibn al-Sakn',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'أسماء بنت يزيد بن السكن الأنصارية الأشهلية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'PATERNAL_COUSIN', inverse: 'PATERNAL_COUSIN', to: 'muadh-ibn-jabal', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default asmaBintYazidIbnAlSakn;
