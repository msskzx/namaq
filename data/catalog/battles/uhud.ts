import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

const uhud = {
  kind: 'BATTLE',
  slug: 'uhud',
  name: 'غزوة أحد',
  nameTransliterated: 'Battle of Uhud',
  /*
   * Both values came off the legacy marker when chapter five was read. The
   * chapter is headed سنة ثلاث من الهجرة and غزوة أحد: وكانت في شوال, and
   * Qatadah dates the fighting to Saturday the eleventh of Shawwal. Ibn Ishaq
   * says للنصف من شوال instead; the model holds no day, so that disagreement
   * is `sira/uhud-date-alt`, DISPUTED, and stays in the description.
   */
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/uhud'] },
    hijriYear: { value: 3, claims: ['sira/uhud'] },

    /*
     * The Muslim seven hundred is not a choice between readings: Urwah's ألف
     * counts before Abd Allah ibn Ubayy turned back with three hundred, and
     * the chapter says so in the same sentence, so Qatadah, al-Zuhri and Urwah
     * all land on seven hundred in the field.
     *
     * The Meccan three thousand is al-Zuhri's and Urwah's; Qatadah's ألفين,
     * which he hedges with أو ما شاء الله من ذلك, is
     * `sira/uhud-quraysh-force-other`, DISPUTED.
     *
     * Seventy dead is where chapter five left an argument on the page for want
     * of a column. al-Dhahabi settles it himself: قول من قال سبعين أصح, and the
     * smaller counts of the maghazi writers are counts of the named.
     */
    muslimForceCount: { value: 700, claims: ['sira/uhud-muslim-force'] },
    nonMuslimForceCount: { value: 3000, claims: ['sira/uhud-quraysh-force'] },
    muslimDeathCount: { value: 70, claims: ['sira/uhud-muslim-dead'] },
  },
  participants: [
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'uthman-ibn-affan', isMuslim: true, claims: legacyUnreviewed },
    { person: 'saeed-ibn-zaid', isMuslim: true, claims: ['saeed/uhud'] },
    {
      person: 'saad-ibn-abi-waqqas',
      isMuslim: true,
      summary: {
        value:
          'أَنَّهُ رَمَى يَوْمَ أُحُدٍ، قَالَ: فَلَقَدْ رَأَيْتُ رَسُوْلَ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- يُنَاوِلُنِي النَّبْلَ وَيَقُوْلُ: (ارْمِ فِدَاكَ أَبِي وَأُمِّي) ، حَتَّى إِنَّهُ لَيُنَاوِلُنِي السَّهْمَ مَا لَهُ مِنْ نَصْلٍ، فَأَرْمِي بِهِ.',
        claims: ['saad/uhud'],
      },
      claims: ['saad/uhud'],
    },
    {
      person: 'abdur-rahman-ibn-awf',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value:
          'كَانَ أُصِيْبَ يَوْمَ أُحُدٍ فُهُتِمَ، وَجُرِحَ عِشْرِيْنَ جِرَاحَةً، بَعْضُهَا فِي رِجْلِهِ فَعَرَجَ.',
        claims: ['awf/uhud'],
      },
      claims: ['awf/uhud'],
    },
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/uhud'] },
    {
      person: 'talhah-ibn-ubaydullah',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value: 'فَقَاتَلَ طَلْحَةُ قِتَالَ الأَحَد عَشَر، حَتَّى قُطِعَتْ أَصَابِعُهُ.',
        claims: ['talhah/uhud'],
      },
      claims: ['talhah/uhud'],
    },
    { person: 'qudamah-ibn-mazun', isMuslim: true, claims: ['qudamah-mazun-siyar10/uhud'] },
    { person: 'abdullah-ibn-mazun-al-jumahi', isMuslim: true, claims: ['abdullah-mazun-siyar11/uhud'] },
    { person: 'khalid-ibn-al-bukayr', isMuslim: true, claims: ['khalid-bukayr-siyar17/uhud'] },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      summary: {
        value:
          'فَانْتُدِبَ أَبُو بَكْرٍ وَالزُّبَيْرُ فِي سَبْعِيْنَ، فَخَرَجُوا فِي آثَارِ المُشْرِكِيْنَ، فَسَمِعُوا بِهِم، فَانْصَرَفُوا.',
        claims: ['zubayr/uhud'],
      },
      claims: ['zubayr/uhud'],
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
        claims: ['salman/uhud'],
      },
      claims: ['salman/uhud'],
    },
    {
      person: 'prophet-muhammad',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value: 'جرح وجهه وكسرت رباعيته وهشمت البيضة على رأسه، فكانت فاطمة تغسل الدم وعلي يسكب الماء.',
        claims: ['sira/uhud-wounds'],
      },
      claims: ['sira/uhud'],
    },
    {
      person: 'hamzah-ibn-abd-al-muttalib',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'قاتل بسيفين يقول: أنا أسد الله، فقتله وحشي بحربته ومثل به.', claims: ['hamzah/uhud'] },
      claims: ['hamzah/uhud'],
    },
    {
      person: 'musab-ibn-umayr',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value: 'قاتل دون رسول الله صلى الله عليه وسلم حتى قتل، قتله ابن قميئة وهو يظنه رسول الله صلى الله عليه وسلم.',
        claims: ['musab/uhud'],
      },
      claims: ['musab/uhud'],
    },
    {
      person: 'abu-dujanah-al-ansari',
      isMuslim: true,
      summary: {
        value: 'أخذ سيف رسول الله صلى الله عليه وسلم بحقه، ثم ترس دونه بنفسه حتى كثر النبل في ظهره.',
        claims: ['abu-dujanah/uhud'],
      },
      claims: ['abu-dujanah/uhud'],
    },
    {
      person: 'abdullah-ibn-jubayr',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'أمير الرماة الخمسين، أمرهم أن لا يبرحوا فثبت مكانه حتى قتل.', claims: ['ibn-jubayr/uhud'] },
      claims: ['ibn-jubayr/uhud'],
    },
    {
      person: 'hanzalah-ibn-abi-amir',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'خرج جنبا حين سمع الهيعة فقتل، فقال صلى الله عليه وسلم: إن صاحبكم لتغسله الملائكة.', claims: ['hanzalah/uhud'] },
      claims: ['hanzalah/uhud'],
    },
    {
      person: 'anas-ibn-an-nadr',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value: 'قال: إني لأجد ريح الجنة دون أحد، فقاتل حتى قتل، ووجد به بضع وثمانون جراحة فعرفته أخته ببنانه.',
        claims: ['anas-nadr/uhud'],
      },
      claims: ['anas-nadr/uhud'],
    },
    {
      person: 'saad-ibn-al-rabi',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'وجد وبه سبعون ضربة، فقال: أجد ريح الجنة، وأوصى الأنصار.', claims: ['saad-rabi/uhud'] },
      claims: ['saad-rabi/uhud'],
    },
    {
      person: 'amr-ibn-al-jumuh',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'كان أعرج فسأل أيمشي برجله صحيحة في الجنة فقيل له: نعم، فقتل.', claims: ['amr-jumuh/uhud'] },
      claims: ['amr-jumuh/uhud'],
    },
    {
      person: 'abdullah-ibn-amr-ibn-haram',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'دفن مع عمرو بن الجموح في قبر واحد، فإنهما كانا متصافيين في الدنيا.', claims: ['ibn-haram/uhud'] },
      claims: ['ibn-haram/uhud'],
    },
    {
      person: 'qatadah-ibn-al-numan',
      isMuslim: true,
      status: ['INJURED'],
      summary: { value: 'أصيبت عينه حتى وقعت على وجنته، فردها رسول الله صلى الله عليه وسلم بيده.', claims: ['qatadah/uhud'] },
      claims: ['qatadah/uhud'],
    },
    {
      person: 'abu-ubaydah-ibn-al-jarrah',
      isMuslim: true,
      summary: {
        value: 'نزع حلقتي المغفر من وجه النبي صلى الله عليه وسلم بفيه فسقطت ثنيتاه، فكان من أحسن الناس هتما.',
        claims: ['abu-ubaydah/uhud-rings'],
      },
      claims: ['abu-ubaydah/uhud-rings'],
    },
    {
      person: 'ali-ibn-abi-talib',
      isMuslim: true,
      summary: { value: 'دفع إليه اللواء بعد مقتل مصعب بن عمير.', claims: ['ali/uhud'] },
      claims: ['ali/uhud'],
    },
    {
      person: 'kaab-ibn-malik',
      isMuslim: true,
      summary: { value: 'أول من عرف رسول الله صلى الله عليه وسلم بعد الهزيمة، عرف عينيه من تحت المغفر.', claims: ['kaab-malik/uhud'] },
      claims: ['kaab-malik/uhud'],
    },
    {
      person: 'hudhayfah-ibn-al-yaman',
      isMuslim: true,
      summary: { value: 'قتل المسلمون أباه اليمان وهم لا يعرفونه، فتصدق بدمه عليهم.', claims: ['hudhayfah/uhud'] },
      claims: ['hudhayfah/uhud'],
    },
    {
      person: 'umm-sulaym-al-ghumaysa',
      isMuslim: true,
      summary: { value: 'كانت تنقل القرب على متنها وتفرغها في أفواه القوم.', claims: ['umm-sulaym/uhud'] },
      claims: ['umm-sulaym/uhud'],
    },
    { person: 'al-baraa-ibn-malik', isMuslim: true, claims: ['al-baraa-ibn-malik-siyar26/uhud'] },
  ],
} satisfies CatalogBattle;

export default uhud;
