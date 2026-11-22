import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Umar guessed that a handsome man passing by had been the soothsayer of his people in the Jahiliyyah, and the man owned
 * it and told what his jinniyyah brought him in fright; Umar said he was right, and told of the cry he heard by their
 * idols over a slaughtered calf, «يا جليح، أمر نجيح», before they heard: this is a prophet. Told from Sahih al-Bukhari
 * 3866 (the chapter on Umar's islam), whole. The man is not named in the text, so no one is linked for him. Not tagged
 * ISLAM: it is what came before Umar's islam, not his islam.
 */
const umarAndTheKahin = {
  kind: 'EVENT',
  slug: 'umar-and-the-kahin',
  name: "عمر والكاهن",
  nameTransliterated: "Umar and the soothsayer",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }],
  reports: [
    {
      isnad: "حَدَّثَنَا يَحْيَى بْنُ سُلَيْمَانَ قَالَ: حَدَّثَنِي ابْنُ وَهْبٍ قَالَ: حَدَّثَنِي عُمَرُ: أَنَّ سَالِمًا حَدَّثَهُ، عَنْ عَبْدِ اللهِ بْنِ عُمَرَ",
      source: { slug: 'sahih-al-bukhari', hadith: 3866, url: 'https://sunnah.com/bukhari:3866' },
      moments: [
        { title: "«إلا كان كما يظن»", text: "قَالَ: «مَا سَمِعْتُ عُمَرَ لِشَيْءٍ قَطُّ يَقُولُ: إِنِّي لَأَظُنُّهُ كَذَا، إِلَّا كَانَ كَمَا يَظُنُّ،", people: ['umar-ibn-al-khattab'] },
        { title: "«أو لقد كان كاهنهم»", text: "بَيْنَمَا عُمَرُ جَالِسٌ، إِذْ مَرَّ بِهِ رَجُلٌ جَمِيلٌ، فَقَالَ: لَقَدْ أَخْطَأَ ظَنِّي، أَوْ إِنَّ هَذَا عَلَى دِينِهِ فِي الْجَاهِلِيَّةِ، أَوْ لَقَدْ كَانَ كَاهِنَهُمْ، عَلَيَّ الرَّجُلَ، فَدُعِيَ لَهُ،", people: ['umar-ibn-al-khattab'] },
        { title: "«كنت كاهنهم في الجاهلية»", text: "فَقَالَ لَهُ ذَلِكَ، فَقَالَ: مَا رَأَيْتُ كَالْيَوْمِ اسْتُقْبِلَ بِهِ رَجُلٌ مُسْلِمٌ، قَالَ: فَإِنِّي أَعْزِمُ عَلَيْكَ إِلَّا مَا أَخْبَرْتَنِي، قَالَ: كُنْتُ كَاهِنَهُمْ فِي الْجَاهِلِيَّةِ،", people: ['umar-ibn-al-khattab'] },
        { title: "ما جاءته به جنيته", text: "قَالَ: فَمَا أَعْجَبُ مَا جَاءَتْكَ بِهِ جِنِّيَّتُكَ، قَالَ: بَيْنَمَا أَنَا يَوْمًا فِي السُّوقِ، جَاءَتْنِي أَعْرِفُ فِيهَا الْفَزَعَ، فَقَالَتْ: أَلَمْ تَرَ الْجِنَّ وَإِبْلَاسَهَا، وَيَأْسَهَا مِنْ بَعْدِ إِنْكَاسِهَا، وَلُحُوقَهَا بِالْقِلَاصِ وَأَحْلَاسِهَا.", people: ['umar-ibn-al-khattab'] },
        { title: "«يا جليح، أمر نجيح»", text: "قَالَ عُمَرُ: صَدَقَ، بَيْنَمَا أَنَا عِنْدَ آلِهَتِهِمْ إِذْ جَاءَ رَجُلٌ بِعِجْلٍ فَذَبَحَهُ، فَصَرَخَ بِهِ صَارِخٌ، لَمْ أَسْمَعْ صَارِخًا قَطُّ أَشَدَّ صَوْتًا مِنْهُ يَقُولُ: يَا جَلِيحْ، أَمْرٌ نَجِيحْ، رَجُلٌ فَصِيحْ، يَقُولُ: لَا إِلَهَ إِلَّا أَنْتَ، فَوَثَبَ الْقَوْمُ، قُلْتُ: لَا أَبْرَحُ حَتَّى أَعْلَمَ مَا وَرَاءَ هَذَا، ثُمَّ نَادَى: يَا جَلِيحْ، أَمْرٌ نَجِيحْ، رَجُلٌ فَصِيحْ، يَقُولُ: لَا إِلَهَ إِلَّا اللهُ، فَقُمْتُ، فَمَا نَشِبْنَا أَنْ قِيلَ: هَذَا نَبِيٌّ.»", people: ['umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default umarAndTheKahin;
