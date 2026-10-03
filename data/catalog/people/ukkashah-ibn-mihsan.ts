import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const ukkashahIbnMihsan = {
  kind: 'PERSON',
  slug: 'ukkashah-ibn-mihsan',
  name: 'عُكَّاشَةُ بنُ مِحْصَنٍ',
  nameTransliterated: 'Ukkashah ibn Mihsan',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عُكَّاشَةُ بنُ مِحْصَنٍ أَبُو مِحْصَنٍ الأَسَدِيُّ حَلِيْفُ قُرَيْشٍ',
      claims: ['ukkashah-ibn-mihsan-siyar60/full-name'],
    },
    kunya: { value: 'أَبُو مِحْصَنٍ', claims: ['ukkashah-ibn-mihsan-siyar60/kunya'] },
    tribalAffiliation: {
      value: 'الأَسَدِيُّ، حَلِيْفُ قُرَيْشٍ',
      claims: ['ukkashah-ibn-mihsan-siyar60/tribal-affiliation'],
    },
    appearance: {
      value: 'مِنْ أَجْمَلِ الرِّجَالِ',
      claims: ['ukkashah-ibn-mihsan-siyar60/appearance'],
    },
    virtues: {
      value:
        'السَّعِيْدُ الشَّهِيْدُ، أَبُو مِحْصَنٍ الأَسَدِيُّ، حَلِيْفُ قُرَيْشٍ، مِنَ السَّابِقِيْنَ الأَوَّلِيْنَ، البَدْرِيِّيْنَ، أَهْلِ الجَنَّةِ. اسْتَعْمَلَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- عَلَى سَرِيَّةِ الغَمْرِ ، فَلَمْ يَلْقَوْا كَيْداً. وَقَدْ أَبْلَى عُكَّاشَةُ يَوْم بَدْرٍ بَلاَءً حَسَناً، وَانْكَسَرَ سَيْفُهُ فِي يَدِهِ، فَأَعْطَاهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- عُرْجُوْناً مِنْ نَخْلٍ، أَوْ عُوْداً، فَعَادَ بِإِذْنِ اللهِ فِي يَدِهِ سَيْفاً، فَقَاتَلَ بِهِ، وَشَهِدَ بِهِ المَشَاهِدَ',
      claims: ['ukkashah-ibn-mihsan-siyar60/virtues'],
    },
    deathYearHijri: { value: '11', claims: ['ukkashah-ibn-mihsan-siyar60/death-year-eleven'] },
    placeOfDeathArabic: { value: 'بُزَاخَةَ', claims: ['ukkashah-ibn-mihsan-siyar60/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['ukkashah-ibn-mihsan-siyar60/titles'],
    },
  ],
  relations: [],
} satisfies CatalogPerson;

export default ukkashahIbnMihsan;
