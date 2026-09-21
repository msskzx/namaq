import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Married بأيام يسيرة after Umm Salamah, in the same year. The chapter gives
 * her the verse of al-Ahzab outright — وهي التي نزلت هذه الآية فيها — which is
 * the one Qur'an link in this chapter.
 *
 * Her name was برة before the Prophet changed it, which the model records
 * inside `fullName` rather than as a second name: nothing here holds a former
 * name on its own.
 */
const zaynabBintJahsh = {
  kind: 'PERSON',
  slug: 'zaynab-bint-jahsh',
  name: 'زينب بنت جحش',
  nameTransliterated: 'Zaynab bint Jahsh',
  hasProfile: true,
  fields: {
    fullName: { value: 'زينب بنت جحش بن رئاب الأسدي', claims: ['zaynab-jahsh/full-name'] },
    sex: { value: 'FEMALE', claims: ['zaynab-jahsh/sex'] },
  },
  titles: [
    // Carried from the seed rows. The chapter has her among the Prophet's
    // wives without calling her either name.
    { title: 'mother-of-believers', claims: legacyUnreviewed },
    { title: 'companion', claims: legacyUnreviewed },
  ],
  ayat: [{ surah: 33, ayah: 37, claims: ['zaynab-jahsh/ayah-al-ahzab'] }],
  relations: [
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: ['prophet/wife-zaynab-jahsh'] },
    {
      type: 'DAUGHTER',
      inverse: 'MOTHER',
      to: 'umaymah-bint-abd-al-muttalib',
      claims: ['zaynab-jahsh/mother-umaymah'],
    },
  ],
} satisfies CatalogPerson;

export default zaynabBintJahsh;
