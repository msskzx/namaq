import type { CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. أحد أحد is what
// the chapter records of him, and it records it in the middle of the roster
// of the seven rather than in an entry of his own.
//
// data/history/batches/bilal-ibn-rabah, entry 76.
const bilalIbnRabah = {
  kind: 'PERSON',
  slug: 'bilal-ibn-rabah',
  name: 'بلال بن رباح',
  nameTransliterated: 'Bilal ibn Rabah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['bilal-ibn-rabah-siyar76/sex'] },
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'بلال بن رباح', claims: ['bilal-ibn-rabah-siyar76/full-name'] },
    kunya: {
      value: 'أبو عبد الكريم، وأبو عبد الله، وأبو عمرو',
      claims: ['bilal-ibn-rabah-siyar76/kunya'],
    },
    appearance: {
      value:
        'رجل آدم شديد الأدمة، نحيف طوال أجنأ، له شعر كثير وخفيف العارضين، به شمط كثير، وكان لا يغير.',
      claims: ['bilal-ibn-rabah-siyar76/appearance'],
    },
    virtues: {
      value:
        'هانت عليه نفسه في الله، فكان يعذب في شعاب مكة وهو يقول: أحد أحد. مُؤَذِّنُ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ-؛ أَذَّنَ فَوْقَ الكَعْبَةِ وَقْتَ الفَتْحِ، وَهُوَ أَوَّلُ مَنْ أَذَّنَ. مِنَ السَّابِقِيْنَ الأَوَّلِيْنَ الَّذِيْنَ عُذِّبُوا فِي اللهِ، وَأَوَّلُ مَنْ أَظْهَرَ إِسْلاَمَهُ مَعَ السَّبْعَةِ. سَمِعَ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- خَشْخَشَةَ نَعْلَيْهِ فِي الجَنَّةِ، وَشَهِدَ لَهُ عَلَى التَّعْيِيْنِ بِالجَنَّةِ. اشْتَرَاهُ أَبُو بَكْرٍ فَأَعْتَقَهُ (أَبُو بَكْرٍ سَيِّدُنَا أَعْتَقَ بِلاَلاً سَيِّدَنَا). بِلاَلٌ سَابِقُ الحَبَشَةِ، سَيِّدُ المُؤَذِّنِيْنَ يَوْمَ القِيَامَةِ. جَاءَ عَنْهُ أَرْبَعَةٌ وَأَرْبَعُوْنَ حَدِيْثاً، مِنْهَا فِي الصَّحِيْحَيْنِ أَرْبَعَةٌ.',
      claims: ['bilal/ahad', 'bilal/persecution', 'bilal-ibn-rabah-siyar76/virtues'],
    },
    deathYearHijri: { value: '20', claims: ['bilal-ibn-rabah-siyar76/death-year'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['bilal-ibn-rabah-siyar76/titles'],
    },
  ],
  relations: [],
} satisfies CatalogPerson;

export default bilalIbnRabah;
