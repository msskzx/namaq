import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

/**
 * Another of the eleven modules created when the seeds were retired, and
 * chapter nine reads it: the year, the engagement and the location all come
 * off the marker.
 *
 * The year has a competing reading the model can hold, so it is recorded.
 * al-Zuhri puts the fighting in سنة ست, and al-Dhahabi marks the report شذ and
 * says outright وهذا لا يصح — a reading the book rejects is still a reading,
 * and dropping it would hide the rejection along with the claim.
 *
 * The three companions stay on the marker, as they do at al-Hudaybiyyah. The
 * chapter has the Prophet taking the forts one by one and names neither of
 * them among the men who did it.
 */
const khaybar = {
  kind: 'BATTLE',
  slug: 'khaybar',
  name: 'غزوة خيبر',
  nameTransliterated: 'Battle of Khaybar',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['khaybar/engagement'] },
    hijriYear: { value: 7, claims: ['khaybar/year'] },
    location: { value: 'خيبر', claims: ['khaybar/location'] },
  },
  participants: [
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: ['prophet/khaybar'] },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default khaybar;
