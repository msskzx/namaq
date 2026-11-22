import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Al-Tufayl ibn Amr came and said Daws had disobeyed and refused, «فادع الله عليهم», and the Prophet ﷺ said «اللهم اهد
 * دوسا وأت بهم». Told from Sahih al-Bukhari 4392 (al-Maghazi, the story of Daws and al-Tufayl), whole; this is the sound
 * part of al-Tufayl's story left out before.
 */
const thePrayerForDaws = {
  kind: 'EVENT',
  slug: 'the-prayer-for-daws',
  name: "دعاؤه ﷺ لدوس",
  nameTransliterated: "The prayer for Daws",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'at-tufayl-ibn-amr-ad-dawsi' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو نُعَيْمٍ: حَدَّثَنَا سُفْيَانُ، عَنِ ابْنِ ذَكْوَانَ، عَنْ عَبْدِ الرَّحْمَنِ الْأَعْرَجِ، عَنْ أَبِي هُرَيْرَةَ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4392, url: 'https://sunnah.com/bukhari:4392' },
      moments: [
        { title: "«اللهم اهد دوسا وأت بهم»", text: "«جَاءَ الطُّفَيْلُ بْنُ عَمْرٍو إِلَى النَّبِيِّ ﷺ، فَقَالَ: إِنَّ دَوْسًا قَدْ هَلَكَتْ، عَصَتْ، وَأَبَتْ، فَادْعُ اللهَ عَلَيْهِمْ، فَقَالَ: اللَّهُمَّ اهْدِ دَوْسًا وَأْتِ بِهِمْ.»", people: ['at-tufayl-ibn-amr-ad-dawsi', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thePrayerForDaws;
