import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const alHakamIbnAbiAlAs = {
  kind: 'PERSON',
  slug: 'al-hakam-ibn-abi-al-as',
  name: 'الحكم بن أبي العاص',
  nameTransliterated: 'Al-Hakam ibn Abi al-As',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'الحكم بن أبي العاص بن أمية بن عبد شمس القرشي الأموي',
      claims: legacyUnreviewed,
    },
    kunya: { value: 'أَبَا مَرْوَانَ', claims: ['al-hakam-ibn-abi-al-as-siyar14/kunya'] },
    deathYearHijri: { value: '31', claims: ['al-hakam-ibn-abi-al-as-siyar14/death-year'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['al-hakam-ibn-abi-al-as-siyar14/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abi-al-as-ibn-umayya',
      claims: ['al-hakam-ibn-abi-al-as-siyar14/father'],
    },
  ],
} satisfies CatalogPerson;

export default alHakamIbnAbiAlAs;
