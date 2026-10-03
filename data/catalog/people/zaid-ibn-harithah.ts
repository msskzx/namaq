import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const zaidIbnHarithah = {
  kind: 'PERSON',
  slug: 'zaid-ibn-harithah',
  name: 'زيد بن حارثة',
  nameTransliterated: 'Zaid ibn Harithah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value:
        'زيد بن حارثة بن شراحيل بن كعب بن عبد العزى بن يزيد بن امرئ القيس بن عامر بن النعمان الكلبي',
      claims: ['zaid-ibn-harithah-siyar36/full-name'],
    },
    kunya: { value: 'أَبُو أُسَامَةَ', claims: ['zaid-ibn-harithah-siyar36/kunya'] },
    appearance: {
      value: 'وَكَانَ قَصِيْراً، شَدِيْدَ الأُدْمَةِ، أَفْطَسَ',
      claims: ['zaid-ibn-harithah-siyar36/appearance'],
    },
    virtues: {
      value:
        'المُسَمَّى فِي سُوْرَةِ الأَحْزَابِ سَيِّدُ المَوَالِي، وَأَسْبَقُهُم إِلَى الإِسْلاَمِ، وَحِبُّ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَوَّلُ مَنْ أَسْلَمَ: زَيْدُ بنُ حَارِثَةَ خَرَجَ زَيْدُ بنُ حَارِثَةَ أَمِيْراً سَبْعَ سَرَايَا أَنْتَ مَوْلاَيَ، وَمِنِّي، وَإِلَيَّ، وَأَحَبُّ القَوْمِ إِلَيَّ لَوْ أَنَّ زَيْداً كَانَ حَيّاً لاَسْتَخْلَفَهُ رَسُوْلُ اللهِ مَا بَعَثَ رَسُوْلُ اللهِ زَيْداً فِي جَيْشٍ قَطُّ إِلاَّ أَمَّرَهُ عَلَيْهِم، وَلَوْ بَقِيَ بَعْدَهُ اسْتَخْلَفَهُ اسْتَغْفِرُوا لأَخِيْكُم، قَدْ دَخَلَ الجَنَّةَ وَهُوَ يَسْعَى دَخَلْتُ الجَنَّةَ، فَاسْتَقْبَلَتْنِي جَارِيَةٌ شَابَّةٌ',
      claims: ['zaid-ibn-harithah-siyar36/virtues'],
    },
    deathYearHijri: { value: '8', claims: ['zaid-ibn-harithah-siyar36/death-year'] },
    placeOfDeathArabic: { value: 'مُؤْتَةَ', claims: ['zaid-ibn-harithah-siyar36/death-place'] },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'usamah-ibn-zaid',
      claims: ['zaid-ibn-harithah-siyar36/usamah-son'],
    },
  ],
} satisfies CatalogPerson;

export default zaidIbnHarithah;
