import type { Bi } from './sources';

/**
 * The text of the about, privacy and attributions pages, read by the website (src/app/about, src/app/attributions) and
 * by the app's own pages (mobile/src/screens/info.tsx), so the two never drift (owner, 2026-11-18: no page lives on the
 * website alone except the question review).
 */

export const ABOUT_INTRO: Bi = {
  ar: 'نَمَق تطبيق تعليمي موجّه للمسلمين وطلاب العلم، والعربية لغته الأساسية. يعين على دراسة القرآن الكريم والحديث النبوي وتاريخ صدر الإسلام من خلال نصوص المصادر والمقارنة بينها، واستكشاف الشخصيات والعلاقات بينها بصريًا.',
  en: 'Namaq is an Arabic-first learning application for Muslims and students of Islamic knowledge. It helps readers study the Quran, Hadith, and early Islamic history through source texts, comparisons, and visual exploration of people and their relationships.',
};

/** The references section. No review labels anywhere (owner, 2026-11-17), so it says how values are checked, not that each carries a status. */
export const ABOUT_REFERENCES: Bi[] = [
  {
    ar: 'المصادر التي اعتمدنا عليها في بناء نمق ومحتواه التاريخي. نستمد الشخصيات والأحداث من كتاب «سير أعلام النبلاء» للذهبي، ونحفظ نص كل ترجمة صفحةً صفحةً من نسخ رقمية منشورة، فيُحال كل ما يُعرض في الصفحة الشخصية إلى الصفحة التي أُخذ منها.',
    en: 'The sources used to build Namaq and its historical content. People and events are drawn from Siyar A‘lam al-Nubala’ by al-Dhahabi. The text of each entry is kept page by page from published digital editions, and every fact on a profile points to the page it was taken from.',
  },
  {
    ar: 'تُضاف المعلومات على دفعات، ولا تُنشر الدفعة إلا بعد اعتمادها. وبعض القيم جاءت من ملاحظات سابقة بلا إحالات، وتُطابَق مع نص الكتاب كلما بلغتها دفعة جديدة.',
    en: 'Information is added in batches, and a batch is published only after it is approved. Some values came from earlier notes with no citations; they are checked against the book as new batches reach them.',
  },
];

type NameEntry = { title: string; definition: string; forms: string[] };

/** The two dictionary entries for the name, as the website's about page has always shown them. */
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
  ar: 'الأعمال والبيانات التي اعتمد عليها نمق، ولمن يعود كل منها، وبأي ترخيص.',
  en: 'The works and data Namaq relies on, whom each one belongs to, and under what licence.',
};

/** What a source adds beyond its card: Siyar's scans and OCR text, the corpus's counting notes. */
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

/**
 * The app's privacy policy: what the phone keeps and what ever leaves it. The website's page (src/app/privacy) covers the
 * website, which has a cookie and analytics; the app has neither.
 */
export const APP_PRIVACY: { title: string; body: string }[] = [
  { title: 'ما يحفظه التطبيق', body: 'الإعدادات، والمحفوظات، وتأملاتك، وما نسيته، وما تحفظه من القرآن: كلها على هاتفك وحده، ولا تُرسل إلى أحد. تُمحى إذا حذفت التطبيق.' },
  { title: 'الموقع', body: 'يُطلب موقعك لمواقيت الصلاة واتجاه القبلة فقط، ويُحسب كل ذلك على الهاتف، ولا يُرسل الموقع إلى أحد. يعمل التطبيق كله إن رفضت.' },
  { title: 'التنبيهات', body: 'تذكير الأذكار والأذان يُجدول على هاتفك، ويُوقف من صفحته متى شئت.' },
  { title: 'الإنترنت', body: 'يعمل التطبيق بلا إنترنت، ويتصل في هذه الحالات وحدها: عند فتحه يسأل خوادم Expo عن تحديث له؛ والاختبار الجماعي يرسل الاسم الذي تكتبه ورقمًا عشوائيًا للاعب إلى خادم نمق لتلك الجولة؛ وتنزيل الكتب يجلبها من موقع نمق؛ والاستماع إلى التلاوات يجلبها من Quran Foundation (verses.quran.com) ومن quranicaudio.com، ويسأل موقع نمق عن ملفات التلاوة حين تنزّلها لتبقى محدّثة؛ والروابط الخارجية تفتح في المتصفح. ولا يُرسل مع شيء من ذلك ما حفظته على هاتفك.' },
  { title: 'التحليلات والحسابات', body: 'لا تحليلات ولا تتبّع في التطبيق، ولا حسابات ولا تسجيل دخول، ولا يجمع أي معلومات شخصية.' },
  { title: 'اتصل بنا', body: `لأي أسئلة حول هذه السياسة، راسلنا على ${CONTACT_EMAIL}` },
  { title: 'تحديثات هذه السياسة', body: 'إذا أضفنا ميزة تغيّر ما نحفظه أو ما يُرسل، تُحدَّث هذه الصفحة في التغيير نفسه.' },
];
