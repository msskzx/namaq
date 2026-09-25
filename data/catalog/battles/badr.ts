import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

/**
 * He killed his own father here, so the SON relation is not in tension with
 * this.
 *
 * The year is no longer owed. It was carried from the old seed with no
 * citation until the sira's chapter four was read: that chapter is headed
 * سنة اثنتين من الهجرة, and al-Dhahabi dates the battle itself to the Friday
 * morning of the seventeenth of Ramadan. `sira/badr` cites both, so the value
 * moves off the legacy marker to a cited claim.
 */
const badr = {
  kind: 'BATTLE',
  slug: 'badr',
  name: 'غزوة بدر',
  nameTransliterated: 'Battle of Badr',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/badr-ghazwah'] },
    hijriYear: { value: 2, claims: ['sira/badr'] },

    /*
     * Four counts, and the chapter competes with itself over all four.
     *
     * The Muslim force is 313 here because that is the figure the chapter
     * narrates twice, once as Abu Ayyub's own count and once in al-Dhahabi's
     * telling, and al-Bara's ثلاثمائة وبضعة عشر agrees with it. Umar's 319 and
     * Ibn Amr's 315 are `sira/badr-muslim-force-other`, DISPUTED.
     *
     * Quraysh's 950 comes from Musa ibn Uqbah's maghazi, which this chapter
     * introduces as فإنها من أصح المغازي and which counts the horses too. The
     * round ألف that Umar gives, and that the Prophet inferred from ten camels
     * slaughtered a day, is `sira/badr-quraysh-force-other`.
     *
     * The dead are the Sahihayn's seventy killed and seventy captured against
     * Ibn Ishaq's بضعة وأربعون, and fourteen Muslims (al-Waqidi and Ibn Uqbah)
     * against his eleven. Chapter four's roster names fourteen, which is what
     * settles it here.
     */
    muslimForceCount: { value: 313, claims: ['sira/badr-muslim-force'] },
    nonMuslimForceCount: { value: 950, claims: ['sira/badr-quraysh-force'] },
    muslimDeathCount: { value: 14, claims: ['sira/badr-muslim-dead'] },
    nonMuslimDeathCount: { value: 70, claims: ['sira/badr-quraysh-dead'] },
  },
  participants: [
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'saad-ibn-abi-waqqas',
      isMuslim: true,
      status: ['CAPTURED'],
      summary: {
        value:
          'لَقَدْ رَأَيْتُ سَعْداً يُقَاتِلُ يَوْمَ بَدْرٍ قِتَالَ الفَارِسِ فِي الرِّجَالِ. اشْتَرَكْتُ أَنَا، وَسَعْدٌ، وَعَمَّارٌ، يَوْمَ بَدْرٍ فِيْمَا أَصَبْنَا مِنَ الغَنِيْمَةِ، فَجَاءَ سَعْدٌ بِأَسِيْرَيْنِ، وَلَمْ أَجِئْ أَنَا وَعَمَّارٌ بِشَيْءٍ.',
        claims: ['saad/badr'],
      },
      claims: ['saad/badr'],
    },
    {
      person: 'abdur-rahman-ibn-awf',
      isMuslim: true,
      summary: {
        value:
          'وَمِنْ مَنَاقِبِهِ: أَنَّ النَّبِيَّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- شَهِدَ لَهُ بِالجَنَّةِ، وَأَنَّهُ مِنْ أَهْلِ بَدْرٍ الَّذِيْنَ قِيْلَ لَهُم: (اعْمَلُوا مَا شِئْتُم) .',
        claims: ['awf/badr'],
      },
      claims: ['awf/badr'],
    },
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/badr'] },
    // Ibn Sa'd names three narrators for this (Ibn Ishaq, Abu Ma'shar,
    // al-Waqidi) against Ibn Uqbah's silence, and rejects Hisham ibn
    // al-Kalbi's rival account naming a different man, "as-Saib ibn Maz'un,"
    // as a mistake -- see data/history/batches/as-saib-ibn-uthman/summary.md.
    { person: 'as-saib-ibn-uthman', isMuslim: true, claims: ['saib-uthman-siyar12/badr'] },
    // His own entry names him البدري outright, then has him challenge his
    // father, Utbah ibn Rabiah, to single combat there (see
    // data/history/batches/abu-hudhayfah).
    { person: 'abu-hudhayfah', isMuslim: true, claims: ['abu-hudhayfah-siyar13/badr'] },
    // His own entry names him البدري outright too (see
    // data/history/batches/salim-mawla-abi-hudhayfah).
    { person: 'salim-mawla-abi-hudhayfah', isMuslim: true, claims: ['salim-siyar14/badr'] },
    // The old seed had him present here with no status at all. He was away
    // trading in Syria, and given the share and the reward all the same.
    {
      person: 'talhah-ibn-ubaydullah',
      isMuslim: true,
      relation: 'ABSENT_FROM',
      status: ['ABSENT_EXCUSED'],
      summary: {
        value:
          'غَابَ عَنْ وَقْعَة بَدْرٍ فِي تِجَارَةٍ لَهُ بِالشَّامِ، وَتَأَلَّمَ لِغَيْبَتِهِ، فَضَرَبَ لَهُ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِسَهْمِهِ، وَأَجره.',
        claims: ['talhah/badr'],
      },
      claims: ['talhah/badr'],
    },
    { person: 'qudamah-ibn-mazun', isMuslim: true, claims: ['qudamah-mazun-siyar10/badr'] },
    { person: 'abdullah-ibn-mazun-al-jumahi', isMuslim: true, claims: ['abdullah-mazun-siyar11/badr'] },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value:
          'كَانَ يَوْمَ بَدْرٍ مَعَ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- فَارِسَانِ: الزُّبَيْرُ عَلَى فَرَسٍ، عَلَى المَيْمَنَةِ، وَالمِقْدَادُ بنُ الأَسْوَدِ عَلَى فَرَسٍ، عَلَى المَيْسَرَةِ.',
        claims: ['zubayr/badr'],
      },
      claims: ['zubayr/badr'],
    },
    // One sentence of his own account settles all three: the enslavement that
    // kept him from Badr and Uhud, and the Khandaq he did reach.
    {
      person: 'salman-al-farisi',
      isMuslim: true,
      relation: 'ABSENT_FROM',
      status: ['ABSENT_EXCUSED'],
      summary: {
        value: 'وحبسني الرق حتى فاتتني بدر وأحد.',
        claims: ['salman/badr'],
      },
      claims: ['salman/badr'],
    },
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/badr'] },
    {
      person: 'abu-bakr-as-siddiq',
      isMuslim: true,
      summary: { value: 'كان في العريش ومعه رسول الله صلى الله عليه وسلم، ليس معهما غيرهما.', claims: ['abu-bakr/badr'] },
      claims: ['abu-bakr/badr'],
    },
    {
      person: 'saad-ibn-muadh',
      isMuslim: true,
      summary: {
        value: 'هو الذي أشار ببناء العريش، وقام على بابه بالسيف في نفر من الأنصار يخافون على رسول الله صلى الله عليه وسلم كرة العدو.',
        claims: ['saad-muadh/badr'],
      },
      claims: ['saad-muadh/badr'],
    },
    {
      person: 'hamzah-ibn-abd-al-muttalib',
      isMuslim: true,
      summary: { value: 'قتل الأسود بن عبد الأسد عند الحوض، وكان أحد الثلاثة الذين برزوا.', claims: ['hamzah/badr'] },
      claims: ['hamzah/badr'],
    },
    {
      person: 'ali-ibn-abi-talib',
      isMuslim: true,
      summary: { value: 'أحد الثلاثة الذين برزوا يوم بدر، وفيهم نزلت: {هَذَانِ خَصْمَانِ اخْتَصَمُوا فِي رَبِّهِمْ} .', claims: ['ali/badr'] },
      claims: ['ali/badr'],
    },
    // He is the one martyr of the fourteen whose death the chapter narrates
    // rather than only listing: Utbah took his leg and he died two days later.
    {
      person: 'ubaydah-ibn-al-harith',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'بارز عتبة بن ربيعة فاختلفا ضربتين، وقطع عتبة رجله، فمات بعد يومين بالصفراء.', claims: ['ubaydah/badr'] },
      claims: ['ubaydah/badr'],
    },
    {
      person: 'al-miqdad-ibn-amr',
      isMuslim: true,
      summary: {
        value: 'قال: لا نقول لك كما قال قوم موسى لموسى، ولكن نقاتل عن يمينك وعن شمالك، فأشرق لذلك وجه رسول الله صلى الله عليه وسلم. ولم يكن يومئذ فارس غيره.',
        claims: ['miqdad/badr'],
      },
      claims: ['miqdad/badr'],
    },
    {
      person: 'abdullah-ibn-masud',
      isMuslim: true,
      summary: { value: 'أجهز على أبي جهل واحتز رأسه، فقال صلى الله عليه وسلم: هذا فرعون هذه الأمة.', claims: ['ibn-masud/badr'] },
      claims: ['ibn-masud/badr'],
    },
    {
      person: 'musab-ibn-umayr',
      isMuslim: true,
      summary: { value: 'دفع إليه رسول الله صلى الله عليه وسلم اللواء يوم بدر.', claims: ['musab/badr'] },
      claims: ['musab/badr'],
    },
    {
      person: 'ukkashah-ibn-mihsan',
      isMuslim: true,
      summary: { value: 'انقطع سيفه فأعطاه رسول الله صلى الله عليه وسلم عودا فعاد سيفا في يده، فقاتل به.', claims: ['ukkashah/badr'] },
      claims: ['ukkashah/badr'],
    },
    {
      person: 'bilal-ibn-rabah',
      isMuslim: true,
      summary: { value: 'صرخ: يا أنصار الله، رأس الكفر أمية بن خلف، لا نجوت إن نجا.', claims: ['bilal/badr'] },
      claims: ['bilal/badr'],
    },
    {
      person: 'ubadah-ibn-al-samit',
      isMuslim: true,
      summary: { value: 'قال: فينا أهل بدر نزلت الأنفال حين تنازعنا في الغنيمة، فقسمه صلى الله عليه وسلم بين المسلمين على السواء.', claims: ['ubadah/badr'] },
      claims: ['ubadah/badr'],
    },
    // All fourteen the chapter names. Ten of them had no subject in the app
    // until this batch reached the roster, and the catalog now creates them.
    {
      person: 'aqil-ibn-al-bukayr',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'قَتَلَهُ مَالِكُ بنُ زُهَيْرٍ الجُشَمِيُّ.', claims: ['aqil-bukayr-siyar16/badr-summary'] },
      claims: ['aqil-bukayr/badr', 'aqil-bukayr-siyar16/badr-summary'],
    },
    { person: 'safwan-ibn-bayda', isMuslim: true, status: ['MARTYRED'], claims: ['safwan-bayda/badr'] },
    { person: 'saad-ibn-khaythamah', isMuslim: true, status: ['MARTYRED'], claims: ['saad-khaythamah/badr'] },
    {
      person: 'mihja-mawla-umar',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'رمي بسهم فكان أول قتيل في سبيل الله.', claims: ['mihja/badr'] },
      claims: ['mihja/badr'],
    },
    {
      person: 'harithah-ibn-suraqah',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'رمي بسهم وهو يشرب من الحوض فقتل.', claims: ['harithah/badr'] },
      claims: ['harithah/badr'],
    },
    {
      person: 'umayr-ibn-al-humam',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'قال: بخ بخ! ثم ألقى تمرات كانت معه وقاتل حتى قتل.', claims: ['umayr-humam/badr'] },
      claims: ['umayr-humam/badr'],
    },
    { person: 'awf-ibn-afra', isMuslim: true, status: ['MARTYRED'], claims: ['awf-afra/badr'] },
    {
      person: 'muawwidh-ibn-afra',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'ضرب أبا جهل حتى أثبته ثم قاتل حتى قتل.', claims: ['muawwidh-afra/badr'] },
      claims: ['muawwidh-afra/badr'],
    },
    { person: 'dhu-ash-shimalayn', isMuslim: true, status: ['MARTYRED'], claims: ['dhu-ash-shimalayn/badr'] },
    { person: 'umayr-ibn-abi-waqqas', isMuslim: true, status: ['MARTYRED'], claims: ['umayr-waqqas/badr'] },
    { person: 'yazid-ibn-al-harith', isMuslim: true, status: ['MARTYRED'], claims: ['yazid-harith/badr'] },
    { person: 'rafi-ibn-al-mualla', isMuslim: true, status: ['MARTYRED'], claims: ['rafi-mualla/badr'] },
    { person: 'mubashshir-ibn-abd-al-mundhir', isMuslim: true, status: ['MARTYRED'], claims: ['mubashshir/badr'] },
    // Aqil's brother; survived Badr, unlike Aqil.
    { person: 'khalid-ibn-al-bukayr', isMuslim: true, claims: ['khalid-bukayr-siyar17/badr'] },
    // Third of the four al-Bukayr brothers; also survived Badr.
    { person: 'iyas-ibn-al-bukayr', isMuslim: true, claims: ['iyas-bukayr-siyar18/badr'] },
    // Fourth and last of the al-Bukayr brothers; survived Badr, martyred later at Yamama.
    { person: 'amir-ibn-al-bukayr', isMuslim: true, claims: ['amir-bukayr-siyar19/badr'] },
    { person: 'mistah-ibn-uthathah', isMuslim: true, claims: ['mistah-siyar20/badr'] },
    { person: 'abu-abs', isMuslim: true, claims: ['abu-abs-siyar21/badr'] },
    { person: 'abu-al-haytham-ibn-at-tayyihan', isMuslim: true, claims: ['abu-al-haytham-siyar22/badr'] },
    // Entry 24, Abu Jandal's half-brother; went out with his father Suhail
    // ibn Amr concealing his faith, then switched sides once the armies met.
    {
      person: 'abdullah-ibn-suhail',
      isMuslim: true,
      summary: {
        value: 'خرج مع أبيه إلى بدر يكتم إيمانه، فلما التقى الجمعان، تحول إلى المسلمين، وقاتل، وعد بدريا.',
        claims: ['abdullah-ibn-suhail-siyar24/badr'],
      },
      claims: ['abdullah-ibn-suhail-siyar24/badr'],
    },
    // Two absences the source remarks on, and gives the Prophet's ruling for.
    {
      person: 'uthman-ibn-affan',
      isMuslim: true,
      relation: 'ABSENT_FROM',
      status: ['ABSENT_EXCUSED'],
      summary: { value: 'تخلف يمرض زوجته رقية بنت رسول الله صلى الله عليه وسلم، فضرب له النبي صلى الله عليه وسلم بسهمه وأجره.', claims: ['uthman/badr-absent'] },
      claims: ['uthman/badr-absent'],
    },
    {
      person: 'saeed-ibn-zaid',
      isMuslim: true,
      relation: 'ABSENT_FROM',
      status: ['ABSENT_EXCUSED'],
      summary: { value: 'كان بالشام فقدم بعد بدر، فأسهم له النبي صلى الله عليه وسلم.', claims: ['saeed-ibn-zaid/badr-absent'] },
      claims: ['saeed-ibn-zaid/badr-absent'],
    },
  ],
} satisfies CatalogBattle;

export default badr;
