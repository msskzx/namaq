import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * A genuinely complex case per the retired prisma/personSeedData8.ts entry:
 * fought against the Muslims pre-Islam, later apostatized with part of
 * Kindah during the Ridda wars, was besieged, and secured amnesty from Abu
 * Bakr by re-embracing Islam. His own page explicitly credits him with
 * companion status ("له صحبة، ورواية") despite this history -- kept as a
 * companion per the book's own framing, same precedent as
 * tulayhah-ibn-khuwaylid.
 */
const alAshathIbnQais = {
  kind: 'PERSON',
  slug: 'al-ashath-ibn-qais',
  name: 'الأشعث بن قيس',
  nameTransliterated: 'Al-Ashath ibn Qais',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'الأشعث بن قيس بن معدي كرب بن معاوية بن جبلة بن عدي بن ربيعة بن معاوية الأكرمين بن الحارث بن معاوية بن ثور بن مرتع بن كندة',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'qais-ibn-muadikarib-al-kindi', claims: legacyUnreviewed },
    {
      type: 'BROTHER',
      inverse: 'SISTER',
      to: 'qutaylah-bint-qais-al-kindiyyah',
      claims: ['qutaylah-siyar10/sister-ashath'],
    },
  ],
} satisfies CatalogPerson;

export default alAshathIbnQais;
