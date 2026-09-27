import { legacyUnreviewed, type CatalogEvent } from '@/lib/catalog/types';

/** Carried from the retired prisma/eventSeedData.ts entry, uncited. */
const passingOfTheProphetMuhammad = {
  kind: 'EVENT',
  slug: 'passing-of-the-prophet-muhammad',
  name: 'وفاة النبي محمد ﷺ',
  nameTransliterated: 'Passing of the Prophet Muhammad (PBUH)',
  type: 'DEATH',
  fields: {
    hijriYear: { value: 11, claims: legacyUnreviewed },
    location: { value: 'المدينة المنورة', claims: legacyUnreviewed },
    description: { value: 'وفاة النبي محمد صلى الله عليه وسلم', claims: legacyUnreviewed },
  },
  people: [
    { person: 'prophet-muhammad', claims: legacyUnreviewed },
    { person: 'aisha-bint-abi-bakr', claims: legacyUnreviewed },
    { person: 'fatimah-bint-muhammad', claims: legacyUnreviewed },
    { person: 'ali-ibn-abi-talib', claims: legacyUnreviewed },
  ],
} satisfies CatalogEvent;

export default passingOfTheProphetMuhammad;
