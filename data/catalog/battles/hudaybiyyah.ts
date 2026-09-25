import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

/**
 * Chapter eight reads it, so the three fields carried when the seeds were
 * retired come off the marker. نافع, قتادة, الزهري, ابن إسحاق and عروة all
 * give ذو القعدة سنة ست, which is as many chains as this batch has behind any
 * one date.
 *
 * علي بن مسهر's رمضان is left where it is. The chapter marks it تفرد, a single
 * narrator against those five, and it competes over a month the model does not
 * hold; the year the two readings share is what is recorded.
 *
 * The three companions stay on the marker. The chapter has the Prophet going
 * and says nothing that puts any of them there by name.
 */
const hudaybiyyah = {
  kind: 'BATTLE',
  slug: 'hudaybiyyah',
  name: 'صلح الحديبية',
  nameTransliterated: 'Treaty of Hudaybiyyah',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['hudaybiyyah/engagement'] },
    hijriYear: { value: 6, claims: ['hudaybiyyah/year'] },
    location: { value: 'الحديبية', claims: ['hudaybiyyah/location'] },
  },
  participants: [
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: ['prophet/hudaybiyyah'] },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'uthman-ibn-affan', isMuslim: true, claims: legacyUnreviewed },
    { person: 'saeed-ibn-zaid', isMuslim: true, claims: ['saeed/hudaybiyyah'] },
    { person: 'abu-jandal', isMuslim: true, claims: ['abu-jandal-siyar23/hudaybiyyah'] },
    // Quraysh's own negotiator; still not Muslim here (see fath-makkah.ts).
    {
      person: 'suhail-ibn-amr',
      isMuslim: false,
      summary: {
        value: 'لَمَّا أَقْبَلَ فِي شَأْنِ الصُّلْحِ: قَالَ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ-: (سَهُلَ أَمْرُكُم) .',
        claims: ['suhail-ibn-amr-siyar25/hudaybiyyah'],
      },
      claims: ['suhail-ibn-amr-siyar25/hudaybiyyah'],
    },
    {
      person: 'al-baraa-ibn-malik',
      isMuslim: true,
      summary: { value: 'وَبَايَعَ تَحْتَ الشَّجَرَةِ.', claims: ['al-baraa-ibn-malik-siyar26/hudaybiyyah'] },
      claims: ['al-baraa-ibn-malik-siyar26/hudaybiyyah'],
    },
  ],
} satisfies CatalogBattle;

export default hudaybiyyah;
