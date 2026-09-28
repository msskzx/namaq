import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * The Prophet's granddaughter (through Zaynab and Abu al-Ass above), famously
 * carried by him during prayer. The retired prisma/personSeedData7.ts entry
 * notes her own page says she did not narrate any hadith, but al-Dhahabi
 * still gives her a dedicated Companions-section entry -- a marginal-but-
 * book-gives-own-entry case, and the first female profile this pipeline
 * added.
 */
const umamahBintAbiAlAs = {
  kind: 'PERSON',
  slug: 'umamah-bint-abi-al-as',
  name: 'أمامة بنت أبي العاص',
  nameTransliterated: 'Umamah bint Abi al-As',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'أمامة بنت أبي العاص بن الربيع بن عبد العزى بن عبد شمس القرشي العبشمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-al-as-ibn-al-rabi', claims: legacyUnreviewed },
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'zaynab-bint-muhammad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default umamahBintAbiAlAs;
