import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

/**
 * Chapter eleven reads it. سار رسول الله صلى الله عليه وسلم إلى تبوك gives the
 * engagement and his own part in it, and both come off the legacy marker.
 *
 * Ali's absence is the one worth naming. It was carried here on the seeds'
 * word, and the graph held a contradictory PARTICIPATED_IN edge beside it that
 * had to be deleted by hand when the attendance flipped. The chapter now says
 * what happened: خلف رسول الله عليا في غزوة تبوك — he was left behind, and left
 * in charge, which is an absence the source remarks on rather than a gap in the
 * roster ([ADR 0013](../../../docs/adr/0013-separate-attendance-from-outcome.md)).
 *
 * The year stays on the marker. This chapter is headed السنة التاسعة and the
 * battle sits inside it, but the section never dates the march, and a heading
 * two pages up is not what the value cites.
 */
const tabuk = {
  kind: 'BATTLE',
  slug: 'tabuk',
  name: 'غزوة تبوك',
  nameTransliterated: 'Expedition of Tabuk',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['tabuk/engagement'] },
    hijriYear: { value: 9, claims: legacyUnreviewed },
    location: { value: 'تبوك', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: ['prophet/tabuk'] },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'uthman-ibn-affan', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'ali-ibn-abi-talib',
      isMuslim: true,
      relation: 'ABSENT_FROM',
      status: ['ABSENT_EXCUSED'],
      claims: ['ali/tabuk-absence'],
    },
  ],
} satisfies CatalogBattle;

export default tabuk;
