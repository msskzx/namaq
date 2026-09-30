import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * The Prophet's granddaughter (through Zaynab and Abu al-As above), famously
 * carried by him during prayer. The Siyar entry (batch umamah-bint-abi-al-as)
 * cites her name, sex, the carrying virtue, and both parent edges, and adds
 * a WIFE edge to Ali ibn Abi Talib. The companion title stays legacy: the
 * entry sits in the Companions section but does not itself state the word.
 */
const umamahBintAbiAlAs = {
  kind: 'PERSON',
  slug: 'umamah-bint-abi-al-as',
  name: 'أمامة بنت أبي العاص',
  nameTransliterated: 'Umamah bint Abi al-As',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['umamah-bint-abi-al-as/sex'] },
    fullName: {
      value: 'أمامة بنت أبي العاص',
      claims: ['umamah-bint-abi-al-as/fullName'],
    },
    virtues: {
      value: 'الَّتِي كَانَ رَسُوْلُ اللهِ يَحْمِلُهَا فِي صَلاَتِهِ',
      claims: ['umamah-bint-abi-al-as/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-al-as-ibn-al-rabi', claims: ['umamah-bint-abi-al-as/father'] },
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'zaynab-bint-muhammad', claims: ['umamah-bint-abi-al-as/mother'] },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'ali-ibn-abi-talib', claims: ['umamah-bint-abi-al-as/husband-ali'] },
  ],
} satisfies CatalogPerson;

export default umamahBintAbiAlAs;
