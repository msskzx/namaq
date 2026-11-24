import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when the rows of the people who fought here were
// retired. The year is al-Dhahabi's sira's: the siege is told inside its chapter
// [ثم دخلت سنة ثمان من الهجرة:], marching from Hunayn في شوال (ADR 0024). The other
// values are still owed their evidence.
const taif = {
  kind: 'BATTLE',
  slug: 'taif',
  name: 'غزوة الطائف',
  place: 'taif',
  nameTransliterated: 'Siege of Taif',
  fields: {
    engagement: { value: 'GHAZWAH', claims: legacyUnreviewed },
    hijriYear: { value: 8, claims: ['taif/year'] },
    location: { value: 'الطائف', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'al-abbas-ibn-abd-al-muttalib', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'abu-sufyan-ibn-harb',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value: 'وَشَهِدَ قِتَالَ الطَّائِفِ، فَقُلِعَتْ عَيْنُهُ حِيْنَئِذٍ،',
        claims: ['abu-sufyan-ibn-harb-siyar13/taif'],
      },
      claims: ['abu-sufyan-ibn-harb-siyar13/taif'],
    },
  ],
} satisfies CatalogBattle;

export default taif;
