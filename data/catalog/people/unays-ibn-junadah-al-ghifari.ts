import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the Siyar entry of his brother Abu Dharr (5/50-p6), who
 * names him alongside their shared mother. Every relation touching him is
 * already cited from the other side; this restates the same evidence from
 * his own file so his node has an author too.
 */
const unaysIbnJunadahAlGhifari = {
  kind: 'PERSON',
  slug: 'unays-ibn-junadah-al-ghifari',
  name: 'أنيس بن جنادة الغفاري',
  nameTransliterated: 'Unays ibn Junadah al-Ghifari',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'BROTHER', inverse: 'BROTHER', to: 'abu-dharr-al-ghifari', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default unaysIbnJunadahAlGhifari;
