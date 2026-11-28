import type { Bi } from './sources';


export const ABOUT_INTRO: Bi = {
  ar: 'نَمَق إطار يجمع الكتب الكبرى في علوم الشريعة لطلاب العلم ولكل مسلم يريد أن يتعلم دينه من مصادره، والعربية لغته. يعرض نصوصها بصريًا، ومعها أدوات تعين على الفهم والحفظ، وكل ما فيه منسوب إلى كتابه وصفحته.',
  en: 'Namaq is a framework built on the great books of the Islamic sciences, for students of knowledge and every Muslim who wants to learn the religion from its sources, Arabic first. It shows their texts visually, with tools that help understanding and memorisation, and everything in it points to its book and page.',
};

export const ABOUT_CONTENTS: { title: Bi; body: Bi }[] = [
  {
    title: { ar: 'القرآن', en: 'Quran' },
    body: {
      ar: 'المصحف برواية حفص، ومعه التفسير، ومعاني الكلمات، والإعراب، والبلاغة، والقراءات، والمتشابه اللفظي، وتناسب الآيات والسور، والاستماع إلى التلاوة، وما يعين على الحفظ.',
      en: 'The mushaf in the riwaya of Hafs, with tafsir, word meanings, i‘rab, balagha, the qira’at, verbal mutashabih, the coherence of ayat and surahs, recitations to listen to, and help with memorising.',
    },
  },
  {
    title: { ar: 'الحديث', en: 'Hadith' },
    body: {
      ar: 'الصحيحان كاملين بكتبهما وأبوابهما، والأربعون النووية ورواياتها في كتب الحديث، وشرح ابن رجب عليها.',
      en: 'The two Sahihs whole, with their kitabs and babs, and al-Nawawi’s Forty with their records in the hadith books and Ibn Rajab’s commentary.',
    },
  },
  {
    title: { ar: 'التراجم', en: 'Biographies' },
    body: {
      ar: 'الصحابة من «سير أعلام النبلاء» للذهبي، بأنسابهم وصلاتهم وما شهدوه.',
      en: 'The Companions from al-Dhahabi’s Siyar A‘lam al-Nubala’, with their lineages, ties and what they witnessed.',
    },
  },
  {
    title: { ar: 'السيرة', en: 'Sira' },
    body: {
      ar: 'قصص من الصحيحين يحكيها أصحابها، والغزوات على الخريطة، ومشاهد تصوّر آيات بأقوال المفسرين.',
      en: 'Stories from the two Sahihs told by the people in them, the battles on a map, and scenes that picture ayat through what the mufassirun said.',
    },
  },
  {
    title: { ar: 'الأذكار والصلاة', en: 'Adhkar and prayer' },
    body: {
      ar: 'الأذكار من كتاب النووي مع تخريج ابن حجر، ومواقيت الصلاة والقبلة والتاريخ الهجري.',
      en: 'The adhkar from al-Nawawi’s book with Ibn Hajar’s takhrij, prayer times, the qibla and the Hijri date.',
    },
  },
  {
    title: { ar: 'الاختبارات', en: 'Quizzes' },
    body: {
      ar: 'اختبارات في كل علم منها، وحدك أو مع غيرك، ومع كل جواب مرجعه.',
      en: 'Quizzes in each of these sciences, alone or with others, and every answer carries its reference.',
    },
  },
];

export const ABOUT_REFERENCES: Bi[] = [
  {
    ar: 'نعرض الثابت المشهور عند أهل العلم، والأصح أولًا. وما اختلفوا فيه يُنسب كل قول فيه إلى قائله مع مرجعه.',
    en: 'We show what is well established among the scholars, the most authentic first. Where they differ, each view is attributed to whoever held it, with its reference.',
  },
  {
    ar: 'لا نحكم على حديث من عندنا: الأحكام منسوبة إلى أصحابها. ولا نصحّح نصًا إلا من مصدر مسمّى.',
    en: 'We grade no hadith ourselves: every grading is attributed to the scholar who gave it. We correct a text only from a named source.',
  },
  {
    ar: 'كل بطاقة وصفحة تحمل مرجعها. اضغط اسم الكتاب لترى الجزء والصفحة ورابط الطبعة التي نقلنا منها.',
    en: 'Every card and page carries its reference. Tap the book’s name to see the volume, page and a link to the edition it was taken from.',
  },
];

type NameEntry = { title: string; definition: string; forms: string[] };

export const NAMAQ_NAME: { ar: { verb: NameEntry; noun: NameEntry }; en: { verb: NameEntry; noun: NameEntry } } = {
  ar: {
    verb: {
      title: 'نَمَّقَ (فعل)',
      definition: 'نمَّقَ ينمِّق ، تنميقًا ، فهو مُنمِّق ، والمفعول مُنمَّق',
      forms: ['نمَّق الكتابَ :جوَّد كتابتَه وحسَّنها', 'نمَّق جلْدًا: زخرفه ونقشَه وزيَّنه', 'نمَّق القولَ: جوّده وصاغَه بأنواعٍ من البديع'],
    },
    noun: { title: 'نَمَق (اسم)', definition: 'النَّمَقُ : الكِتابُ الذي يُكْتَب فيه', forms: ['النَّمَقُ : الكِتابُ الذي يُكْتَب فيه'] },
  },
  en: {
    verb: {
      title: 'Namaq (Verb)',
      definition: 'To beautify or embellish; he beautifies, beautifying; he is a beautifier; the thing beautified.',
      forms: ['He beautified the book: improved and refined its writing.', 'He decorated leather: adorned and embellished it.', 'He beautified speech: refined it, perfected it with eloquence, improved and adorned it.'],
    },
    noun: { title: 'Namaq (Noun)', definition: 'Namaq: The book in which one writes.', forms: ['Namaq: The book in which one writes.'] },
  },
};

export const NAMAQ_FORMS = ['نَمَق', 'يَنمُق', 'نَمْقًا', 'نامِق', 'مَنْموق', 'نَمَّقَ', 'ينمِّق', 'تنميقًا', 'مُنمِّق', 'نَمْق', 'نَمَق'];

export const ATTRIBUTIONS_INTRO: Bi = {
  ar: 'الكتب والبيانات والخطوط والمكتبات التي يعتمد عليها نمق، ولمن يعود كل منها، والطبعة التي ننقل منها، وبأي ترخيص، وأين تُستعمل.',
  en: 'The books, data, fonts and libraries Namaq relies on, whom each one belongs to, the edition we quote, under what licence, and where each is used.',
};

export const SOURCE_EXTRAS: Record<string, { links?: { label: Bi; url: string; prefix: Bi }[][]; notes: Bi[] }> = {
  siyar: {
    links: [
      [{ prefix: { ar: 'النسخة المصورة: ', en: 'Scanned edition: ' }, label: { ar: 'Archive.org، الطبعة الثالثة، ١٤٠٥/١٩٨٥', en: 'Archive.org, third edition, 1405/1985' }, url: 'https://archive.org/details/sanbz' }],
      [
        { prefix: { ar: 'نص OCR للبحث: ', en: 'Searchable OCR text: ' }, label: { ar: 'السيرة النبوية، المجلد الأول', en: 'Prophet’s Sira, volume 1' }, url: 'https://archive.org/download/sanbz/sansera1_djvu.txt' },
        { prefix: { ar: '', en: '' }, label: { ar: 'السيرة النبوية، المجلد الثاني', en: 'Prophet’s Sira, volume 2' }, url: 'https://archive.org/download/sanbz/sansera2_djvu.txt' },
      ],
    ],
    notes: [{
      ar: 'ملفات النص ناتجة عن التعرف الضوئي على الحروف، وهي للبحث والمقارنة. تُراجع الحواشي على صفحات النسخة المصورة.',
      en: 'The text files are OCR aids for searching and comparison. Check footnotes against the scanned pages.',
    }],
  },
  'quranic-arabic-corpus': {
    notes: [
      {
        ar: 'تُعدّ الكلمة بمدخلها المعجمي كما حلّلتها المدوّنة القرآنية العربية (Quranic Arabic Corpus، الإصدار ٠٫٤)، فـ«والله» و«بالله» و«لله» كلها تحت «ٱللَّه»، ويُعدّ كل جزء من الكلمة له مدخل على حدة، فـ«مما» مرة لـ«مِن» ومرة لـ«مَا». التحليل من المدوّنة لا منّا، ولم يراجعه أحد من أهل العلم. لا مدخل في المدوّنة لـ٣٣٠٧ كلمة: الضمائر المنفصلة، وحروف الجر المتصلة بضمير مثل «لهم»، والحروف المقطّعة. والمداخل التي تتفق في الرسم تحمل رقمها في المدوّنة، فـ«صَٰلِح ١» صفة الصلاح و«صَٰلِح ٢» اسم النبي صالح.',
        en: 'Each word is counted under its lemma as the Quranic Arabic Corpus (version 0.4) analyses it, so «والله», «بالله» and «لله» all count under «ٱللَّه». Each part of a word that has its own lemma counts separately, so «مما» counts once for «مِن» and once for «مَا». The analysis is the corpus’s, not ours, and no scholar has reviewed it. The corpus gives no lemma to 3,307 words: separate pronouns, prepositions joined to a pronoun such as «لهم», and the disjoined letters. Lemmas that share a spelling carry the corpus’s number, so «صَٰلِح ١», the word for righteous, and «صَٰلِح ٢», the prophet Salih, count apart.',
      },
      {
        ar: 'وتُعدّ الكلمات المتقابلة بالطريقة نفسها، كل طرف بمدخله، إلا «الآخرة»: مدخلها «آخِر» يشمل «آخر» و«آخرين» أيضًا، فيُعدّ ذلك الطرف بصيغة «الآخرة» وحدها. والأزواج من اختيارنا.',
        en: 'The opposite words count each side the same way, under its lemma, except «الآخرة». Its lemma «آخِر» also covers «آخر» and «آخرين», so that side counts the form «الآخرة» alone. We chose the pairs.',
      },
    ],
  },
};

export const CONTACT_EMAIL = 'msskzx@gmail.com';

export const APP_PRIVACY: { title: string; body: string }[] = [
  { title: 'ما يحفظه التطبيق', body: 'إعداداتك، والمحفوظات، وتأملاتك، وما تحفظه من القرآن، وموضع قراءتك، واختياراتك في الرئيسية، والكتب والتلاوات التي تنزّلها: كلها على هاتفك وحده، ولا تُرسل إلى أحد. تُمحى إذا حذفت التطبيق.' },
  { title: 'الحسابات والتحليلات', body: 'لا حسابات ولا تسجيل دخول، ولا تحليلات ولا تتبّع ولا إعلانات، ولا يجمع التطبيق أي معلومات شخصية.' },
  { title: 'الموقع والبوصلة', body: 'يُطلب موقعك وأنت تستعمل التطبيق لمواقيت الصلاة واتجاه القبلة فقط، وتُقرأ البوصلة لاتجاه القبلة. يُحسب ذلك كله على الهاتف، ويُحفظ الموقع عليه وحده مقرّبًا إلى نحو كيلومتر، ولا يُرسل إلى أحد. ويعمل التطبيق كله إن رفضت.' },
  { title: 'التنبيهات', body: 'تذكير الأذكار والأذان يُجدول على هاتفك نفسه، لا من خادم، ويُوقف من صفحته متى شئت.' },
  { title: 'المشاركة والصور', body: 'المشاركة تصنع الصورة أو المقطع أو النص على هاتفك، ثم تفتح قائمة المشاركة في جهازك، فلا يذهب شيء إلا إلى من تختاره. وإن اخترت حفظ الصورة، طلب التطبيق إذن الإضافة إلى مكتبة الصور وحده، ولا يقرأ صورك.' },
  { title: 'الإنترنت', body: 'يعمل التطبيق بلا إنترنت، ويتصل في هذه الحالات وحدها: عند فتحه يسأل خوادم Expo عن تحديث له؛ وتنزيل الكتب يجلبها من مستودع نمق على GitHub؛ والاستماع إلى التلاوات يجلبها من Quran Foundation (verses.quran.com) ومن quranicaudio.com، ويسأل موقع نمق عن ملفات التلاوة حين تنزّلها لتبقى محدّثة؛ والاختبار الجماعي يرسل الاسم الذي تكتبه ورقمًا عشوائيًا للاعب إلى خادم نمق لتلك الجولة؛ والروابط الخارجية تفتح في المتصفح. ولا يُرسل مع شيء من ذلك ما حفظته على هاتفك.' },
  { title: 'اتصل بنا', body: `لأي أسئلة حول هذه السياسة، راسلنا على ${CONTACT_EMAIL}` },
  { title: 'تحديثات هذه السياسة', body: 'إذا أضفنا ميزة تغيّر ما نحفظه أو ما يُرسل، تُحدَّث هذه الصفحة في التغيير نفسه.' },
];
