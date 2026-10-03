import type { CatalogPerson } from '@/lib/catalog/types';

// data/history/batches/at-tufayl-ibn-amr-ad-dawsi, entry 75.
const atTufaylIbnAmrAdDawsi = {
  kind: 'PERSON',
  slug: 'at-tufayl-ibn-amr-ad-dawsi',
  name: 'الطفيل بن عمرو الدوسي',
  nameTransliterated: 'At-Tufayl ibn Amr ad-Dawsi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/sex'] },
    fullName: {
      value: 'الطُّفَيْلُ بنُ عَمْرِو بنِ طَرِيْفٍ الدَّوْسِيُّ',
      claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/full-name'],
    },
    tribalAffiliation: {
      value: 'الدَّوْسِيُّ مِنَ الأَزْدِ',
      claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/tribal-affiliation'],
    },
    virtues: {
      value:
        'كَانَ سَيِّداً مُطَاعاً مِنْ أَشْرَافِ العَرَبِ. وَدَوْسٌ بَطْنٌ مِنَ الأَزْدِ. وَكَانَ الطُّفَيْلُ يُلَقَّبُ: ذَا النُّوْرِ ، أَسْلَمَ قَبْلَ الهِجْرَةِ بِمَكَّةَ. كُنْتُ رَجُلاً شَاعِراً، سَيِّداً فِي قَوْمِي فَعَمَدْتُ إِلَى أُذُنَيَّ، فَحَشَوْتُهَا كُرْسُفاً وَقَدْ وَقَعَ فِي نَفْسِي أَنَّهُ حَقٌّ وَضَعَ اللهُ بَيْنَ عَيْنَيَّ نُوْراً كَالشِّهَابِ يَتَرَاءاهُ الحَاضِرُ فِي ظُلْمَةِ اللَّيْلِ دِيْنِي دِيْنُكَ، وَكَذَلِكَ أُمِّي، فَأَسْلَمَا. ثُمَّ دَعَوْتُ دَوْساً إِلَى الإِسْلاَمِ، فَأَبَتْ عَلَيَّ، وَتَعَاصَتْ. ثُمَّ رَجَعْتُ إِلَيْهِم، وَهَاجَرَ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- فَأَقَمْتُ مِنْ ظَهْرَانِيْهِم أَدْعُوْهُم إِلَى الإِسْلاَمِ، حَتَّى اسْتَجَابَ مِنْهُم مَنِ اسْتجَابَ ثُمَّ قَدِمْتُ بِثَمَانِيْنَ أَوْ تِسْعِيْنَ أَهْلِ بَيْتٍ مِنْ دَوْسٍ، فَكُنْتُ مَعَ النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- حَتَّى فَتَحَ مَكَّةَ. ابْعَثْنِي إِلَى ذِي الكَّفَيْنِ، صَنَمِ عَمْرِو بنِ حُمَمَةَ حَتَّى أُحْرِقَهُ. فَأَقَمْتُ مَعَهُ حَتَّى قُبِضَ، ثُمَّ خَرَجَتْ إِلَى بَعْثِ مُسَيْلِمَةَ وَمَعِي ابْنَيْ عَمْرٍو، حَتَّى إِذَا كُنْتُ بِبَعْضِ الطَّرِيْقِ، رَأَيْتُ رُؤْيَا، رَأَيْتُ كَأَنَّ رَأْسِي حُلِقَ، وَخَرَجَ مِنْ فَمِي طَائِرٌ، أَمَّا حَلْقُ رَأْسِي: فَقَطْعُهُ. وَأَمَّا الطَّائِرُ: فَرُوْحِي. فَقَدْ رُوِّعْتُ أَنْ أُقْتَلَ شَهِيْداً فَقُتِلَ الطُّفَيْلُ يَوْمَ اليَمَامَةِ، وَجُرِحَ ابْنُهُ، ثُمَّ قُتِلَ يَوْمَ اليَرْمُوْكِ بَعْدُ',
      claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/virtues'],
    },
    placeOfDeathArabic: { value: 'اليَمَامَةِ', claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'amr-ibn-tarif',
      claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/father'],
    },
  ],
} satisfies CatalogPerson;

export default atTufaylIbnAmrAdDawsi;
