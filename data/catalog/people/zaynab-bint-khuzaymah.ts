import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Chapter six is her obituary, and it is where four of the values this module
 * carried on the legacy marker get their evidence: the nasab, أم المؤمنين, the
 * marriage to the Prophet, and the fuller reading of her name. أم المساكين was
 * already cited from chapter five; the obituary gives the reason for it,
 * لإحسانها إليهم, which the earlier citation does not.
 *
 * `companion` stays on the marker. The chapter calls her أم المؤمنين and never
 * صحابية, and borrowing one for the other would be the seed's assignment
 * wearing a citation it did not earn.
 */
const zaynabBintKhuzaymah = {
  kind: 'PERSON',
  slug: 'zaynab-bint-khuzaymah',
  name: 'زينب بنت خزيمة',
  nameTransliterated: 'Zaynab bint Khuzaymah',
  hasProfile: true,
  fields: {
    // The obituary's nasab runs further than the retired seed's did, so the
    // carried value is replaced rather than merely cited.
    fullName: {
      value:
        'زينب بنت خزيمة بن الحارث بن عبد الله بن عمرو بن عبد مناف بن هلال بن عامر بن صعصعة القيسية الهوازنية العامرية الهلالية',
      claims: ['zaynab-khuzaymah/full-name'],
    },
    // وفيها توفيت: the year is the chapter's own heading rather than a date in
    // the sentence, and آخر ربيع الآخر is the month within it.
    deathYearHijri: { value: '4 AH', claims: ['zaynab-khuzaymah/death-year'] },
    placeOfDeathArabic: { value: 'البَقِيْع', claims: ['zaynab-khuzaymah/burial-baqi'] },
  },
  titles: [
    { title: 'umm-al-masakeen', claims: ['zaynab-khuzaymah/umm-al-masakeen'] },
    { title: 'mother-of-believers', claims: ['zaynab-khuzaymah/umm-al-mumineen'] },
    // Carried from the retired seed entry; no batch cites it yet.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: ['zaynab-khuzaymah/wife-prophet'] },
    // Her second marriage. الطفيل, the first husband who divorced her, has no
    // subject in the app, so only the tie the model can hold is recorded.
    { type: 'WIFE', inverse: 'HUSBAND', to: 'ubaydah-ibn-al-harith', claims: ['zaynab-khuzaymah/wife-ubaydah'] },
  ],
} satisfies CatalogPerson;

export default zaynabBintKhuzaymah;
