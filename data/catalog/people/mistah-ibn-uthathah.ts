import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/mistah-ibn-uthathah, entry 20,
// immediately after the fourth al-Bukayr brother. He is the Mistah named in
// the hadith of the slander (qissat al-ifk); the entry names that connection
// but the model has no Event node for it, so it stays in the source text.
const mistahIbnUthathah = {
  kind: 'PERSON',
  slug: 'mistah-ibn-uthathah',
  name: 'مسطح بن أثاثة',
  nameTransliterated: 'Mistah ibn Uthathah',
  hasProfile: true,
  fields: {
    fullName: { value: 'مسطح بن أثاثة بن عباد بن المطلب بن عبد مناف بن قصي، المطلبي.', claims: ['mistah-siyar20/full-name'] },
    appearance: { value: 'كان قصيرا، غائر العينين، شثن الأصابع.', claims: ['mistah-siyar20/appearance'] },
    deathYearHijri: { value: '34', claims: ['mistah-siyar20/death-year'] },
  },
  titles: [
    // Carried from the retired seed entry; this entry never calls him صحابي outright.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default mistahIbnUthathah;
