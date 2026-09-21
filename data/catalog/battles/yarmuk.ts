import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

const yarmuk = {
  kind: 'BATTLE',
  slug: 'yarmuk',
  name: 'معركة اليرموك',
  nameTransliterated: 'Battle of Yarmuk',
  // Carried from the old seed, which an earlier agent extracted from this same
  // work without citations. The entry does not date it, so the evidence is
  // still owed (AGENTS.md, "Historical evidence data").
  fields: { engagement: { value: 'BATTLE', claims: legacyUnreviewed }, hijriYear: { value: 15, claims: legacyUnreviewed } },
  participants: [
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/yarmuk'] },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      status: ['INJURED'],
      summary: { value: 'ضُرِبَ ضَرْبَةً بِالسَّيْفِ يَوْمَ اليَرْمُوْكِ.', claims: ['zubayr/yarmuk'] },
      claims: ['zubayr/yarmuk'],
    },
  ],
} satisfies CatalogBattle;

export default yarmuk;
