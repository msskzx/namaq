import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. The muezzin
 * of the Sacred Mosque. His own page gives a second candidate identity
 * ("Sumayr ibn Umayr ibn Lawdhan ibn Wahb ibn Sad ibn Jumah") -- the
 * header name is used. Mother from Khuzaah, no further chain given. Son
 * Abd al-Malik, a narrator from him, is not yet in this pipeline.
 */
const abuMahdhurahAlJumahi = {
  kind: 'PERSON',
  slug: 'abu-mahdhurah-al-jumahi',
  name: 'أبو محذورة الجمحي',
  nameTransliterated: 'Abu Mahdhurah al-Jumahi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'أوس بن معير بن لوذان بن ربيعة بن سعد بن جمح القرشي الجمحي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuMahdhurahAlJumahi;
