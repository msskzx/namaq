import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// data/history/batches/umayr-ibn-saad-al-ansari, entry 12.
const umayrIbnSaadAlAnsari = {
  kind: 'PERSON',
  slug: 'umayr-ibn-saad-al-ansari',
  name: 'عُمَيْرُ بنُ سَعْدٍ الأَنْصَارِيُّ',
  nameTransliterated: 'Umayr ibn Saad al-Ansari',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عُمَيْرُ بنُ سَعْدِ بنِ شُهَيْدٍ الأَنْصَارِيُّ الأَوْسِيُّ',
      claims: ['umayr-ibn-saad-al-ansari-siyar/full-name'],
    },
  },
  virtues: [
    {
      value:
        'الزَّاهِدُ نَسيجُ وَحْدِهِ. لَهُ حَدِيْثٌ وَاحِدٌ. شَهِدَ فَتْحَ الشَّامِ، وَوَلِيَ دِمَشْقَ وَحِمْصَ لِعُمَرَ. صَحِبَ عُمَيْرُ بنُ سَعْدِ بنِ شُهَيْدٍ النَّبِيَّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- وَلَمْ يَشْهَدْ شَيْئاً مِنَ المَشَاهِدِ. وَهُوَ الَّذِي رَفَعَ إِلَى النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- كَلاَمَ الجُلاَسِ بنِ سُوَيْدٍ، وَكَانَ يَتِيْماً فِي حَجْرِهِ. وَاسْتَعْمَلَهُ عُمَرُ عَلَى حِمْصَ، وَكَانَ مِنَ الزُّهَّادِ. وَقَالَ عَبْدُ الصَّمَدِ بنُ سَعِيْدٍ: كَانَت وَلاَيَتُهُ حِمْصَ بَعْدَ ابْنِ حِذْيَمٍ. فَكَانَ عَلَى الشَّامِ هُوَ وَمُعَاوِيَةُ حَتَّى قُتِلَ عُمَرُ. ثُمَّ جَمَعَ عُثْمَانُ الشَّامَ لِمُعَاوِيَةَ، وَنَزَعَ عُمَيْراً. قَالَ لِي ابْنُ عُمَرَ: مَا كَانَ مِنَ المُسْلِمِيْنَ رَجُلٌ مِنَ الصَّحَابَةِ أَفْضَلَ مِنْ أَبِيْكَ يُسَمِّيْهِ: نَسِيْجَ وَحْدِهِ، وَبَعَثَهُ مَرَّةً عَلَى جَيْشٍ. قَالَ المُفَضَّلُ الغَلاَبِيُّ: زُهَّادُ الأَنْصَارِ ثَلاَثَةٌ: أَبُو الدَّرْدَاءِ، وَشَدَّادُ بنُ أَوْسٍ، وَعُمَيْرُ بنُ سَعْدٍ',
      claims: ['umayr-ibn-saad-al-ansari-siyar/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['umayr-ibn-saad-al-ansari-siyar/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'saad-ibn-shahid-al-awsi',
      claims: ['umayr-ibn-saad-al-ansari-siyar/father'],
    },
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'abd-al-rahman-ibn-umayr-ibn-saad',
      claims: ['umayr-ibn-saad-al-ansari-siyar/son-abd-al-rahman'],
    },
  ],
} satisfies CatalogPerson;

export default umayrIbnSaadAlAnsari;
