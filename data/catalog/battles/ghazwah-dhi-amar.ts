import type { CatalogBattle } from '@/lib/catalog/types';

// Muharram of year three, against Ghatafan at Najd. The chapter says outright
// رجع من غير حرب, which is why the roster carries no status: an engagement
// with no fighting is still a غزوة, and that is what `engagement` records.
const ghazwahDhiAmar = {
  kind: 'BATTLE',
  slug: 'ghazwah-dhi-amar',
  name: 'غزوة ذي أمر',
  nameTransliterated: 'The Expedition of Dhi Amar',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/dhi-amar'] },
    hijriYear: { value: 3, claims: ['sira/dhi-amar'] },
    location: { value: 'نجد', claims: ['sira/dhi-amar'] },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/dhi-amar'] },
    {
      person: 'uthman-ibn-affan',
      isMuslim: true,
      summary: { value: 'استعمله النبي صلى الله عليه وسلم على المدينة.', claims: ['uthman/dhi-amar'] },
      claims: ['uthman/dhi-amar'],
    },
  ],
} satisfies CatalogBattle;

export default ghazwahDhiAmar;
