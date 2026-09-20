import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. أم المساكين is not a new title; the sira is
// simply where it is cited for her. She lived months after the marriage.
const zaynabBintKhuzaymah = {
  kind: 'PERSON',
  slug: 'zaynab-bint-khuzaymah',
  name: 'زينب بنت خزيمة',
  nameTransliterated: 'Zaynab bint Khuzaymah',
  hasProfile: true,
  fields: {},
  titles: [{ title: 'umm-al-masakeen', claims: ['zaynab-khuzaymah/umm-al-masakeen'] }],
  relations: [],
} satisfies CatalogPerson;

export default zaynabBintKhuzaymah;
