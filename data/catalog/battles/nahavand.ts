import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. No batch has read this battle, so every value below is in use with
// its evidence owed.
const nahavand = {
  kind: 'BATTLE',
  slug: 'nahavand',
  name: 'معركة نهاوند',
  nameTransliterated: 'Battle of Nahavand',
  fields: {
    engagement: { value: 'BATTLE', claims: legacyUnreviewed },
    hijriYear: { value: 21, claims: legacyUnreviewed },
    location: { value: 'إيران', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    // Attendance is al-Dhahabi's transmitted report; the martyrdom rests on
    // the closing "قُلْتُ", his own voice, so the summary keeps that wording.
    {
      person: 'tulayhah-ibn-khuwaylid',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value: 'أَبْلَى يَوْمَ نَهَاوَنْدَ، ثُمَّ اسْتُشْهِدَ.',
        claims: ['tulayhah-ibn-khuwaylid-siyar62/death-place'],
      },
      claims: ['tulayhah-ibn-khuwaylid-siyar62/nahavand', 'tulayhah-ibn-khuwaylid-siyar62/death-place'],
    },
  ],
} satisfies CatalogBattle;

export default nahavand;
