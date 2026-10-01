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
      value: 'الطفيل بن عمرو بن طريف الدوسي',
      claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/full-name'],
    },
    tribalAffiliation: {
      value: 'الدوسي، الأزدي',
      claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/tribal-affiliation'],
    },
    virtues: {
      value:
        'كَانَ سَيِّداً مُطَاعاً مِنْ أَشْرَافِ العَرَبِ، شَاعِراً سَيِّداً فِي قَوْمِهِ. لُقِّبَ ذَا النُّوْرِ؛ جَعَلَ اللهُ لَهُ نُوْراً بَيْنَ عَيْنَيْهِ يَتَرَاءَاهُ الحَاضِرُ فِي ظُلْمَةِ اللَّيْلِ، فَتَحَوَّلَ إِلَى طَرَفِ سَوْطِهِ كَأَنَّهُ قِنْدِيْلٌ مُعَلَّقٌ. أَسْلَمَ قَبْلَ الهِجْرَةِ بِمَكَّةَ بَعْدَمَا سَدَّ أُذُنَيْهِ بِالكُرْسُفِ حَذَرَ قُرَيْشٍ، فَسَمِعَ القُرْآنَ فَوَقَعَ فِي نَفْسِهِ أَنَّهُ حَقٌّ. رَجَعَ إِلَى دَوْسٍ فَأَسْلَمَ أَبُوْهُ وَأُمُّهُ، وَدَعَا دَوْساً فَأَبَتْ وَتَعَاصَتْ، ثُمَّ اسْتَجَابَ مِنْهُم مَنِ اسْتَجَابَ. قَدِمَ بِثَمَانِيْنَ أَوْ تِسْعِيْنَ أَهْلِ بَيْتٍ مِنْ دَوْسٍ، وَكَانَ مَعَ النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- حَتَّى فَتَحَ مَكَّةَ، فَبَعَثَهُ إِلَى ذِي الكَفَّيْنِ صَنَمِ عَمْرِو بنِ حُمَمَةَ فَأَحْرَقَهُ. أَقَامَ مَعَهُ حَتَّى قُبِضَ، ثُمَّ خَرَجَ إِلَى بَعْثِ مُسَيْلِمَةَ، فَرَأَى أَنَّ رَأْسَهُ حُلِقَ وَخَرَجَ مِنْ فَمِهِ طَائِرٌ، فَأَوَّلَهَا قَطْعَ رَأْسِهِ وَخُرُوْجَ رُوْحِهِ، وَرُوِّعَ أَنْ يُقْتَلَ شَهِيْداً. فَقُتِلَ يَوْمَ اليَمَامَةِ، وَجُرِحَ ابْنُهُ ثُمَّ قُتِلَ يَوْمَ اليَرْمُوْكِ.',
      claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/virtues'],
    },
    placeOfDeathArabic: { value: 'اليمامة', claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/death-place'] },
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
