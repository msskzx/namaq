import type { CatalogPerson } from '@/lib/catalog/types';

const alAlaIbnAlHadrami = {
  kind: 'PERSON',
  slug: 'al-ala-ibn-al-hadrami',
  name: 'العلاء بن الحضرمي',
  nameTransliterated: 'Al-Ala ibn al-Hadrami',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['al-ala-ibn-al-hadrami-siyar51/sex'] },
    fullName: {
      value: 'العَلاَءُ بنُ عَبْدِ اللهِ بنِ عِمَادِ بنِ أَكْبَرَ بنِ رَبِيْعَةَ بنِ مُقَنَّعِ بنِ حَضْرَمَوْتَ مِنْ حُلَفَاءِ بَنِي أُمَيَّةَ',
      claims: ['al-ala-ibn-al-hadrami-siyar51/full-name'],
    },
    deathYearHijri: { value: '21', claims: ['al-ala-ibn-al-hadrami-siyar51/death-year'] },
  },
  virtues: [
    {
      value:
        'وَلاَّهُ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- البَحْرَيْنِ، ثُمَّ وَلِيَهَا لأَبِي بَكْرٍ، وَعُمَرَ بَعَثَهُ -يَعْنِي: العَلاَءَ- أَبُو بَكْرٍ الصِّدِّيْقُ فِي جَيْشٍ قِبَلَ البَحْرَيْنِ، وَكَانُوا قَدِ ارْتَدُّوا، فَسَارَ إِلَيْهِم، وَبَيْنَهُ وَبَيْنَهُمُ البَحْرُ -يَعْنِي: الرَّقْرَاقُ- حَتَّى مَشَوْا فِيْهِ بِأَرْجُلِهِم، فَقَطَعُوا كَذَلِكَ مَكَاناً كَانَتْ تَجْرِي فِيْهِ السُّفُنُ - وَهِيَ اليَوْمَ تَجْرِي فِيْهِ أَيْضاً - فَقَاتَلَهُم، وَأَظْهَرَهُ اللهُ عَلَيْهِم، وَبَذَلُوا الزَّكَاةَ وَكَانَ أَبُو هُرَيْرَةَ يَقُوْلُ: رَأَيْتُ مِنَ العَلاَءِ ثَلاَثَةَ أَشْيَاءَ، لاَ أَزَالُ أُحِبُّهُ أَبَداً',
      claims: ['al-ala-ibn-al-hadrami-siyar51/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['al-ala-ibn-al-hadrami-siyar51/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abdullah-ibn-imad-al-hadrami',
      claims: ['al-ala-ibn-al-hadrami-siyar51/father'],
    },
  ],
} satisfies CatalogPerson;

export default alAlaIbnAlHadrami;
