import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the Siyar entry of his son Abu Dharr (5/46-p5), whose nasab
 * names him. Every relation touching him is already cited from the other
 * side; this restates the same evidence from his own file so his node has
 * an author too.
 */
const junadahIbnSufyanAlGhifari = {
  kind: 'PERSON',
  slug: 'junadah-ibn-sufyan-al-ghifari',
  name: 'جنادة بن سفيان الغفاري',
  nameTransliterated: 'Junadah ibn Sufyan al-Ghifari',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'abu-dharr-al-ghifari', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default junadahIbnSufyanAlGhifari;
