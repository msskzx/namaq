import { type CatalogPerson } from '@/lib/catalog/types';

const saadIbnUbadah = {
  kind: 'PERSON',
  slug: 'saad-ibn-ubadah',
  name: 'سَعْدُ بنُ عُبَادَةَ',
  nameTransliterated: 'Saad ibn Ubadah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['saad-ibn-ubadah-siyar55/sex'] },
    fullName: {
      value: 'سَعْدُ بنُ عُبَادَةَ بنِ دُلَيْمِ بنِ حَارِثَةَ الأَنْصَارِيُّ بنِ أَبِي حَزِيْمَةَ بنِ ثَعْلَبَةَ بنِ طَرِيْفِ بنِ الخَزْرَجِ بنِ سَاعِدَةَ بنِ كَعْبِ بنِ الخَزْرَجِ',
      claims: ['saad-ibn-ubadah-siyar55/full-name'],
    },
    kunya: { value: 'أَبُو قَيْسٍ', claims: ['saad-ibn-ubadah-siyar55/kunya'] },
    deathYearHijri: { value: '16 AH', claims: ['saad-ibn-ubadah-siyar55/death-year'] },
    placeOfDeathArabic: { value: 'حَوْرَان', claims: ['saad-ibn-ubadah-siyar55/death-place'] },
  },
  virtues: [
    {
      value:
        'النَّقِيْبُ، سَيِّدُ الخَزْرَجِ عَقَبِيّاً، نَقِيْباً، سَيِّداً، جَوَاداً وَلِواءُ الأَنصَارِ مَعَ سَعْدِ بنِ عُبَادَةَ يَبْعَثُ إِلَيْهِ كُلَّ يَوْمٍ جَفْنَةً مِنْ ثَرِيْدِ اللَّحْمِ يَرْجِعُ كُلَّ لَيْلَةٍ إِلَى أَهْلِهِ بِثَمَانِيْنَ مِنْ أَهْلِ الصُّفَّةِ يُعَشِّيْهِم كَانَ سَعْدٌ يَكْتُبُ فِي الجَاهِلِيَّةِ، وَيُحْسِنُ العَوْمَ وَالرَّمْيَ',
      claims: [
        'saad-ibn-ubadah-siyar55/virtues-sayyid',
        'saad-ibn-ubadah-siyar55/virtues-badr',
        'saad-ibn-ubadah-siyar55/virtues-generosity',
        'saad-ibn-ubadah-siyar55/virtues-kamil',
      ],
    },
  ],

  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['saad-ibn-ubadah-siyar55/titles'] },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'ubadah-ibn-dulaym',
      claims: ['saad-ibn-ubadah-siyar55/father'],
    },
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'qais-ibn-saad',
      claims: ['saad-ibn-ubadah-siyar55/father-of-qays'],
    },
  ],
} satisfies CatalogPerson;

export default saadIbnUbadah;
