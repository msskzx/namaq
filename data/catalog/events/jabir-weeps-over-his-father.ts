import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When Jabir's father was killed he wept and uncovered his face; the companions forbade him, the Prophet ﷺ did not, and said
 * «ما زالت الملائكة تظله بأجنحتها حتى رفع». Told from Sahih al-Bukhari 4080 (al-Maghazi, the chapter on those killed at
 * Uhud), whole, drawn by speaker: the one lead names who speaks. His father is not named here and is not linked.
 */
const jabirWeepsOverHisFather = {
  kind: 'EVENT',
  slug: 'jabir-weeps-over-his-father',
  name: "بكاء جابر على أبيه",
  nameTransliterated: "Jabir weeps over his father",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'jabir-ibn-abdullah' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "وَقَالَ أَبُو الْوَلِيدِ عَنْ شُعْبَةَ، عَنِ ابْنِ الْمُنْكَدِرِ قَالَ: سَمِعْتُ جَابِرًا قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4080, url: 'https://sunnah.com/bukhari:4080' },
      moments: [
        {
          title: "جعلت أبكي",
          text: "«لَمَّا قُتِلَ أَبِي جَعَلْتُ أَبْكِي، وَأَكْشِفُ الثَّوْبَ عَنْ وَجْهِهِ، فَجَعَلَ أَصْحَابُ النَّبِيِّ ﷺ يَنْهَوْنِي وَالنَّبِيُّ ﷺ لَمْ يَنْهَ،",
          people: ['jabir-ibn-abdullah', 'prophet-muhammad'],
          turns: [
            { text: "«لَمَّا قُتِلَ أَبِي جَعَلْتُ أَبْكِي، وَأَكْشِفُ الثَّوْبَ عَنْ وَجْهِهِ، فَجَعَلَ أَصْحَابُ النَّبِيِّ ﷺ يَنْهَوْنِي وَالنَّبِيُّ ﷺ لَمْ يَنْهَ،" },
          ],
        },
        {
          title: "«ما زالت الملائكة تظله بأجنحتها»",
          text: "وَقَالَ النَّبِيُّ ﷺ: لَا تَبْكِيهِ أو مَا تَبْكِيهِ مَا زَالَتِ الْمَلَائِكَةُ تُظِلُّهُ بِأَجْنِحَتِهَا حَتَّى رُفِعَ».",
          people: ['prophet-muhammad'],
          turns: [
            { text: "وَقَالَ النَّبِيُّ ﷺ: لَا تَبْكِيهِ أو مَا تَبْكِيهِ مَا زَالَتِ الْمَلَائِكَةُ تُظِلُّهُ بِأَجْنِحَتِهَا حَتَّى رُفِعَ».", speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: "وَقَالَ النَّبِيُّ ﷺ:" },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jabirWeepsOverHisFather;
