import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Given name Hani' per the retired prisma/personSeedData8.ts entry --
 * "Abu Bardah" is the kunya-based name used as the book's entry title and
 * this profile's display name.
 */
const abuBardahIbnNiyar = {
  kind: 'PERSON',
  slug: 'abu-bardah-ibn-niyar',
  name: 'أبو بردة بن نيار',
  nameTransliterated: 'Abu Bardah ibn Niyar',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'هانئ بن نيار بن عمرو بن عبيد بن عمرو بن كلاب بن دهمان البلوي القضاعي حليف الأوس',
      claims: legacyUnreviewed,
    },
    kunya: {
      value: 'أَبُو بُرْدَةَ',
      claims: ['abu-bardah-ibn-niyar-siyar13/kunya'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'niyar-ibn-amr-al-balawi', claims: legacyUnreviewed },
    { type: 'MATERNAL_UNCLE', inverse: 'MATERNAL_NEPHEW', to: 'al-baraa-ibn-azib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuBardahIbnNiyar;
