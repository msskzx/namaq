import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. data/history/batches/al-ashath-ibn-qais now cites every
 * value this entry states except `sex`, which the entry never states
 * plainly.
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
      claims: ['al-ashath-ibn-qais-siyar8/full-name'],
    },
    virtues: {
      value: 'كان جوادا: كفر عن يمينه بخمسة عشر ألفا، وقال وقد حلف على حق ورد على صاحبه ثلاثين ألفا: قبحك الله من مال.',
      claims: ['al-ashath-ibn-qais-siyar8/virtues'],
    },
    deathYearHijri: { value: '40 AH', claims: ['al-ashath-ibn-qais-siyar8/death-year'] },
    placeOfDeathArabic: { value: 'الكوفة', claims: ['al-ashath-ibn-qais-siyar8/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['al-ashath-ibn-qais-siyar8/companion'],
    },
  ],
  ayat: [{ surah: 3, ayah: 77, claims: ['al-ashath-ibn-qais-siyar8/ayah-al-imran'] }],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'qais-ibn-muadikarib-al-kindi',
      claims: ['al-ashath-ibn-qais-siyar8/father'],
    },
    {
      type: 'BROTHER',
      inverse: 'SISTER',
      to: 'qutaylah-bint-qais-al-kindiyyah',
      claims: ['qutaylah-siyar10/sister-ashath'],
    },
    {
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'farwah-bint-abi-quhafah',
      claims: ['al-ashath-ibn-qais-siyar8/wife-farwah'],
    },
  ],
} satisfies CatalogPerson;

export default alAshathIbnQais;
