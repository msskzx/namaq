import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

const uhud = {
  kind: 'BATTLE',
  slug: 'uhud',
  // Carried from the old seed, which an earlier agent extracted from this same
  // work without citations. The entry does not date it, so the evidence is
  // still owed (AGENTS.md, "Historical evidence data").
  fields: { hijriYear: { value: 3, claims: legacyUnreviewed } },
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/uhud'] },
    {
      person: 'talhah-ibn-ubaydullah',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value: 'فَقَاتَلَ طَلْحَةُ قِتَالَ الأَحَد عَشَر، حَتَّى قُطِعَتْ أَصَابِعُهُ.',
        claims: ['talhah/uhud'],
      },
      claims: ['talhah/uhud'],
    },
    // Carried from his retired seed rows. The entry has him among the seventy
    // who went out after Uhud, which is not evidence that he fought it.
    { person: 'az-zubayr-ibn-al-awwam', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default uhud;
