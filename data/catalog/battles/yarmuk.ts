import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

const yarmuk = {
  kind: 'BATTLE',
  slug: 'yarmuk',
  name: 'معركة اليرموك',
  nameTransliterated: 'Battle of Yarmuk',
  // Carried from the old seed, which an earlier agent extracted from this same
  // work without citations. The entry does not date it, so the evidence is
  // still owed (AGENTS.md, "Historical evidence data").
  fields: {
    engagement: { value: 'BATTLE', claims: legacyUnreviewed },
    hijriYear: { value: 15, claims: legacyUnreviewed },
    // Carried from the retired prisma/battleSeedData.ts entry, uncited.
    location: { value: 'الأردن', claims: legacyUnreviewed },
  },
  participants: [
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    {
      person: 'yazid-ibn-abi-sufyan',
      isMuslim: true,
      summary: {
        value: 'كَانَ يَزِيْدُ بنُ أَبِي سُفْيَانَ عَلَى رُبُعٍ، وَأَبُو عُبَيْدَةَ عَلَى رُبُعٍ، وَعَمْرُو بنُ العَاصِ عَلَى رُبُعٍ، وَشُرَحْبِيْلُ بنُ حَسَنَةَ عَلَى رُبُعٍ -يَعْنِي: يَوْمَ اليَرْمُوْكِ- وَلَمْ يَكُنْ يَوْمَئِذٍ عَلَيْهِم أَمِيْرٌ.',
        claims: ['yazid-ibn-abi-sufyan-siyar68/yarmuk'],
      },
      claims: ['yazid-ibn-abi-sufyan-siyar68/yarmuk'],
    },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/yarmuk'] },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      status: ['INJURED'],
      summary: { value: 'كَانَ فِي الزُّبَيْرِ ثَلاَثُ ضَرَبَاتٍ بِالسَّيْفِ: إِحْدَاهُنَّ فِي عَاتِقِهِ، إِنْ كُنْتُ لأُدْخِلُ أَصَابِعِي فِيْهَا، ضُرِب ثِنْتَيْنِ يَوْمَ بَدْرٍ، وَوَاحِدَةً يَوْمَ اليَرْمُوْكِ.', claims: ['zubayr/yarmuk'] },
      claims: ['zubayr/yarmuk'],
    },
    // Commanded a division here. His own entry disagrees with itself on
    // whether he died here or later, in the Amwas plague (see
    // data/catalog/people/suhail-ibn-amr.ts and
    // suhail-ibn-amr-siyar25/death-place-alt); status is left unset rather
    // than asserting the disputed reading.
    {
      person: 'suhail-ibn-amr',
      isMuslim: true,
      summary: { value: 'وَكَانَ أَمِيْراً عَلَى كُرْدُوْسٍ يَوْم اليَرْمُوْكِ.', claims: ['suhail-ibn-amr-siyar25/yarmuk'] },
      claims: ['suhail-ibn-amr-siyar25/yarmuk'],
    },
    // The entry gives Ajnadayn as the alternative battle for the same death
    // (amr-ibn-said-al-umawi-siyar50/ajnadayn, marked disputed).
    {
      person: 'amr-ibn-said-al-umawi',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value: 'اسْتُشْهِدَ يَوْمَ اليَرْمُوْكِ - وَيُقَالُ: يَوْم أَجْنَادِيْنَ - مَعَ أَخَوَيْهِ',
        claims: ['amr-ibn-said-al-umawi-siyar50/yarmuk'],
      },
      claims: ['amr-ibn-said-al-umawi-siyar50/yarmuk'],
    },
    {
      person: 'abu-sufyan-ibn-harb',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value:
          'ثُمَّ قُلِعَتِ الأُخْرَى يَوْمَ اليَرْمُوْكِ، وَكَانَ يَوْمَئِذٍ قَدْ حَسُنَ - إِنْ شَاءَ اللهُ - إِيْمَانُهُ، فَإِنَّهُ كَانَ يَوْمَئِذٍ يُحَرِّضُ عَلَى الجِهَادِ. وَكَانَ تَحْتَ رَايَةِ وَلَدِهِ يَزِيْدَ، فَكَانَ يَصِيْحُ: يَا نَصْرَ اللهِ اقْتَرِبْ',
        claims: ['abu-sufyan-ibn-harb-siyar13/yarmuk'],
      },
      claims: ['abu-sufyan-ibn-harb-siyar13/yarmuk'],
    },
    {
      person: 'al-ashath-ibn-qais',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value: 'وَأُصِيْبَتْ عَيْنُهُ يَوْمَ اليَرْمُوْكِ.',
        claims: ['al-ashath-ibn-qais-siyar8/yarmuk'],
      },
      claims: ['al-ashath-ibn-qais-siyar8/yarmuk'],
    },
  ],
} satisfies CatalogBattle;

export default yarmuk;
