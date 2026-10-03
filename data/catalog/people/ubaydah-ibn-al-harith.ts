import type { CatalogPerson } from '@/lib/catalog/types';

const ubaydahIbnAlHarith = {
  kind: 'PERSON',
  slug: 'ubaydah-ibn-al-harith',
  name: 'عُبَيْدَةُ بنُ الحَارِثِ',
  nameTransliterated: 'Ubaydah ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['ubaydah-ibn-al-harith-siyar45/sex'] },
    fullName: {
      value: 'عُبَيْدَةُ بنُ الحَارِثِ بنِ المُطَّلِبِ بنِ عَبْدِ مَنَافٍ بنِ قُصَيٍّ القُرَشِيُّ المُطَّلِبِيُّ',
      claims: ['ubaydah-ibn-al-harith-siyar45/fullName'],
    },
    appearance: {
      value: 'رَبْعَةً مِنَ الرِّجَالِ، مَلِيْحاً',
      claims: ['ubaydah-ibn-al-harith-siyar45/appearance'],
    },
    virtues: {
      value:
        'أَحَدَ السَّابِقِيْنَ الأَوَّلِيْنَ كَبِيْرَ المَنْزِلَةِ عِنْدَ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بَارَزَ رَأْسَ المُشْرِكِيْنَ يَوْمَ بَدْرٍ، فَاخْتَلَفَا ضَرْبَتَيْنِ، فَأَثْبَتَ كُلٌّ مِنْهُمَا الآخَرَ، وَشَدَّ عَلِيٌّ وَحَمْزَةُ عَلَى عُتْبَةَ فَقَتَلاَهُ، وَاحْتَملاَ عُبَيْدَةَ وَبِهِ رَمَقٌ، ثُمَّ تُوُفِّيَ بِالصَّفْرَاءِ أَمَّرَهُ عَلَى سِتِّيْنَ رَاكِباً مِنَ المُهَاجِرِيْنَ، وَعَقَدَ لَهُ لِوَاءً، فَكَانَ أَوَّلَ لِوَاءٍ عُقِدَ فِي الإِسْلاَمِ',
      claims: ['ubaydah-ibn-al-harith-siyar45/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['ubaydah-ibn-al-harith-siyar45/companion'] },
  ],
  relations: [
    { type: 'HUSBAND', inverse: 'WIFE', to: 'zaynab-bint-khuzaymah', claims: ['zaynab-khuzaymah/wife-ubaydah'] },
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-al-muttalib', claims: ['ubaydah-ibn-al-harith-siyar45/father'] },
  ],
} satisfies CatalogPerson;

export default ubaydahIbnAlHarith;
