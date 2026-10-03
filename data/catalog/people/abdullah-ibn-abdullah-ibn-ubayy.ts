import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read in full from data/history/batches/abdullah-ibn-abdullah-ibn-ubayy
 * (Siyar entry 65, vol. 4 pp. 321-323). `sex` stays on the legacy marker: the
 * entry uses masculine grammar throughout but never states his sex as a fact.
 * The gold nose and tooth, the shirt the Prophet put on him, and the intended
 * kingship stay in the source text -- the catalog has no field for them.
 */
const abdullahIbnAbdullahIbnUbayy = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-abdullah-ibn-ubayy',
  name: 'عبد الله بن عبد الله بن أبي',
  nameTransliterated: 'Abdullah ibn Abdullah ibn Ubayy',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عَبْدُ اللهِ بنُ عَبْدِ اللهِ بنِ أُبَيِّ بنِ مَالِكٍ بنِ الحَارِثِ بنِ عُبَيْدِ بنِ مَالِكِ بنِ سَالِمِ - وَسَالِمٌ هُوَ الَّذِي يُقَالُ لَهُ الحُبْلَى، لِعِظَمِ بَطْنِهِ - بنِ غَنْمِ بنِ عَوْفِ بنِ الخَزْرَجِ الأَنْصَارِيُّ، الخَزْرَجِيُّ',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/full-name'],
    },
    tribalAffiliation: {
      value: 'الأَنْصَارِيُّ، الخَزْرَجِيُّ',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/tribal-affiliation'],
    },
  },
  virtues: [
    {
      value:
        'وَكَانَ اسْمُهُ الحُبَابُ، وَبِهِ كَانَ أَبُوْهُ يُكْنَى، فَغَيَّرَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- وَسَمَّاهُ: عَبْدَ اللهِ أَنَّ أَنْفَهُ أُصِيْبَ يَوْمَ أُحُدٍ، فَأَمَرَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَنْ يَتَّخِذَ أَنْفاً مِنْ ذَهَبٍ نَدَرَتْ ثَنِيَّتِي، فَأَمَرنِي رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَنْ أَتَّخِذَ ثَنِيَّةً مِنْ ذَهَبٍ اسْتُشْهِدَ عَبْدُ اللهِ يَوْمَ اليَمَامَةِ، وَقَدْ مَاتَ أَبُوْهُ سَنَةَ تِسْعٍ، فَأَلْبَسَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- قَمِيْصَهُ، وَصَلَّى عَلَيْهِ، وَاسْتَغْفَرَ لَهُ إِكْرَاماً لِوَلَدِهِ وَقَدْ كَانَ رَئِيْساً مُطَاعاً، عَزَمَ أَهْلُ المَدِيْنَةِ قَبْلَ أَنْ يُهَاجِرَ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- عَلَى أَنْ يُمَلِّكُوْهُ عَلَيْهِم، فَانْحَلَّ أَمْرُهُ، وَلاَ حَصَّلَ دُنْيَا وَلاَ آخِرَةً - نَسْأَلُ اللهَ العَافِيَةَ -',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abdullah-ibn-ubayy',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/father'],
    },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAbdullahIbnUbayy;
