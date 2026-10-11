// docs/plans/quran-qiraat.md
import type { Variant } from '@/lib/quran/qiraat';

const TABARI = 'الطبري، جامع البيان';
const pedia = (s: number, a: number) => `https://quranpedia.net/ayahs/${s}/${a}`;

export const variants: Variant[] = [
  {
    surah: 1, ayah: 4, hafsWord: 'ملك',
    readings: [
      { readers: ['asim', 'kisai', 'yaqub', 'khalaf'] },
      { text: 'مَلِكِ', readers: ['nafi', 'ibn-kathir', 'abu-amr', 'ibn-amir', 'hamza', 'abu-jafar'] },
    ],
    note: 'قائمة القرّاء هنا على مستوى القارئ، وكل رواته يأخذون بقراءته، لأن الموسوعة تنقلها في حاشية عن «النشر» و«الإتحاف» دون جدول رواة.',
    meaning: {
      kind: 'quote',
      quotes: ['وقد رجح كلا من القراءتين مرجحون من حيث المعنى، وكلاهما صحيحة حسنة'],
      source: 'ابن كثير',
      url: 'https://quran.ksu.edu.sa/tafseer/ibn-katheer-baghawy-qortobi/sura1-aya4.html',
    },
  },
  {
    surah: 2, ayah: 9, hafsWord: 'يخدعون', occurrence: 1,
    readings: [
      { readers: ['ibn-amir', 'asim', 'hamza', 'kisai', 'abu-jafar', 'yaqub', 'khalaf'] },
      { text: 'يُخَادِعُونَ', readers: ['nafi', 'ibn-kathir', 'abu-amr'] },
    ],
    meaning: { kind: 'unsourced', text: 'الأولى من الفعل المجرد «خَدَع»، والثانية على صيغة المفاعلة «خادَع» كالفعل الأول في الآية.' },
  },
  {
    surah: 2, ayah: 132, hafsWord: 'ووصى',
    readings: [
      { readers: ['ibn-kathir', 'abu-amr', 'asim', 'hamza', 'kisai', 'yaqub', 'khalaf'] },
      { text: 'وَأَوۡصَىٰ', readers: ['nafi', 'ibn-amir', 'abu-jafar'] },
    ],
    meaning: { kind: 'unsourced', text: 'فعلان من مادة واحدة، الأول بتشديد الصاد والثاني بهمزة قبلها.' },
  },
  {
    surah: 2, ayah: 259, hafsWord: 'ننشزها',
    readings: [
      { readers: ['ibn-amir', 'asim', 'hamza', 'kisai', 'khalaf'] },
      { text: 'نُنشِرُهَا', readers: ['nafi', 'ibn-kathir', 'abu-amr', 'abu-jafar', 'yaqub'] },
    ],
    meaning: {
      kind: 'quote',
      quotes: ['فهما وإن اختلفا في اللفظ، فمتقاربا المعنى'],
      source: TABARI,
      url: pedia(2, 259),
    },
  },
  {
    surah: 3, ayah: 146, hafsWord: 'قتل',
    readings: [
      { readers: ['ibn-amir', 'asim', 'hamza', 'kisai', 'abu-jafar', 'khalaf'] },
      { text: 'قُتِلَ', readers: ['nafi', 'ibn-kathir', 'abu-amr', 'yaqub'] },
    ],
    meaning: {
      kind: 'quote',
      quotes: [
        'فأما من قرأ ﴿قَاتَلَ﴾ فإنه اختار ذلك لأنه قال: لو قتلوا لم يكن لقوله: ﴿فمَا وهَنُوا﴾ وجه معروف',
        'وأما الذين قرأوا ذلك: قتل، فإنهم قالوا: إنما عنى بالقتل النبيّ وبعض من معه من الربيين دون جميعهم',
      ],
      source: TABARI,
      url: pedia(3, 146),
    },
  },
  {
    surah: 5, ayah: 6, hafsWord: 'وأرجلكم',
    readings: [
      { readers: ['nafi', 'ibn-amir', 'kisai', 'yaqub'], riwayat: ['hafs'] },
      { text: 'وَأَرۡجُلِكُمۡ', readers: ['ibn-kathir', 'abu-amr', 'hamza', 'abu-jafar', 'khalaf'], riwayat: ['shuba'] },
    ],
    meaning: { kind: 'withheld', text: 'لا يُعرض شرح هنا لأنه موضع خلاف فقهي' },
  },
  {
    surah: 9, ayah: 100, hafsWord: 'تحتها',
    readings: [
      { readers: ['nafi', 'abu-amr', 'ibn-amir', 'asim', 'hamza', 'kisai', 'abu-jafar', 'yaqub', 'khalaf'] },
      { text: 'مِن تَحۡتِهَا', readers: ['ibn-kathir'] },
    ],
    meaning: { kind: 'unsourced', text: 'القراءة الثانية تزيد «مِن» قبل «تحتها».' },
  },
  {
    surah: 17, ayah: 93, hafsWord: 'قل',
    readings: [
      { readers: ['nafi', 'abu-amr', 'asim', 'hamza', 'kisai', 'abu-jafar', 'yaqub', 'khalaf'] },
      { text: 'قَالَ', readers: ['ibn-kathir', 'ibn-amir'] },
    ],
    meaning: { kind: 'unsourced', text: '«قُلۡ» أمر للنبي بأن يقول، و«قَالَ» إخبار عن قوله.' },
  },
  {
    surah: 18, ayah: 86, hafsWord: 'حمئة',
    readings: [{}, { text: 'حَامِيَةٍ' }],
    note: 'لا يرد هذا الموضع في جدول القراءات بالموسوعة، فلم تُنسب القراءتان إلى أحد، وكل الرواة غير مؤكدين.',
    meaning: {
      kind: 'quote',
      quotes: ['والحمئة: الحمأة السوداء', 'وقال آخرون: بل هي تغيب في عين حارّة'],
      source: TABARI,
      url: pedia(18, 86),
    },
  },
  {
    surah: 36, ayah: 35, hafsWord: 'عملته',
    readings: [
      { readers: ['nafi', 'ibn-kathir', 'abu-amr', 'ibn-amir', 'abu-jafar', 'yaqub'], riwayat: ['hafs'] },
      { text: 'عَمِلَتۡ', readers: ['hamza', 'kisai', 'khalaf'], riwayat: ['shuba'] },
    ],
    meaning: {
      kind: 'quote',
      quotes: [
        'ولو قيل: «ما» بمعنى المصدر كان مذهبًا، فيكون معنى الكلام: ومن عمل أيديهم',
        'ولو قيل: إنها بمعنى الجحد ولا موضع لها كان أيضًا مذهبا، فيكون معنى الكلام: ليأكلوا من ثمره ولم تعمله أيديهم',
      ],
      source: TABARI,
      url: pedia(36, 35),
    },
  },
  {
    surah: 40, ayah: 26, hafsWord: 'أو أن يظهر',
    readings: [
      { riwayat: ['hafs', 'ruways', 'rawh'] },
      { text: 'أَوۡ أَن یَظۡهَرَ', riwayat: ['shuba', 'khalaf-hamza', 'khallad', 'abu-al-harith', 'duri-kisai', 'ishaq', 'idris'] },
      { text: 'وَأَن یُظۡهِرَ', riwayat: ['qalun', 'warsh', 'duri-abu-amr', 'susi', 'ibn-wardan', 'ibn-jammaz'] },
      { text: 'وَأَن یَظۡهَرَ', riwayat: ['bazzi', 'qunbul', 'hisham', 'ibn-dhakwan'] },
    ],
    note: 'موضعان في العبارة: «أَوۡ أَن» أو «وَأَن»، و«یُظۡهِرَ» أو «یَظۡهَرَ». القراءة الرابعة وحدها تجمع «وَأَن» و«یَظۡهَرَ». وقوائم الرواة هنا على مستوى الراوي كما تسردها الموسوعة، ولا تسمّي الكتاب الذي نقلت عنه. وتُقرأ «الفسادُ» بالرفع مع «یَظۡهَرَ»، و«الفسادَ» بالنصب مع «یُظۡهِرَ».',
    meaning: { kind: 'unsourced', text: '«أَوۡ» للتخيير و«وَ» للجمع. و«یُظۡهِرَ» من «أظهر» ومفعولها «الفساد»، و«یَظۡهَرَ» من «ظهر» وفاعلها «الفساد».' },
  },
  {
    surah: 43, ayah: 19, hafsWord: 'عبد',
    readings: [
      { readers: ['abu-amr', 'asim', 'hamza', 'kisai', 'khalaf'] },
      { text: 'عِندَ', readers: ['nafi', 'ibn-kathir', 'ibn-amir', 'abu-jafar', 'yaqub'] },
    ],
    meaning: { kind: 'unsourced', text: '«عِبَادُ» جمع عبد، و«عِندَ» ظرف مكان.' },
  },
  {
    surah: 49, ayah: 6, hafsWord: 'فتبينوا',
    readings: [
      { readers: ['nafi', 'ibn-kathir', 'abu-amr', 'ibn-amir', 'asim', 'abu-jafar', 'yaqub'] },
      { text: 'فَتَثَبَّتُوا', readers: ['hamza', 'kisai', 'khalaf'] },
    ],
    meaning: {
      kind: 'quote',
      quotes: [
        'بمعنى: أمهلوا حتى تعرفوا صحته، لا تعجلوا بقبوله',
        'أنهما قراءتان معروفتان متقاربتا المعنى، فبأيتهما قرأ القارئ فمصيب',
      ],
      source: TABARI,
      url: pedia(49, 6),
    },
  },
  {
    surah: 78, ayah: 37, hafsWord: 'رب السموت والارض وما بينهما الرحمن',
    readings: [
      { riwayat: ['ruways', 'rawh', 'hisham', 'ibn-dhakwan', 'shuba', 'hafs'] },
      { text: "رَّبِّ ٱلسَّمَـٰوَٰ⁠تِ وَٱلۡأَرۡضِ وَمَا بَیۡنَهُمَا ٱلرَّحۡمَـٰنُۖ", riwayat: ['idris', 'khallad', 'ishaq', 'duri-kisai', 'abu-al-harith', 'khalaf-hamza'] },
      { text: "رَّبُّ ٱلسَّمَـٰوَٰ⁠تِ وَٱلۡأَرۡضِ وَمَا بَیۡنَهُمَا ٱلرَّحۡمَـٰنُۖ", riwayat: ['ibn-jammaz', 'ibn-wardan', 'qalun', 'warsh', 'bazzi', 'qunbul', 'susi', 'duri-abu-amr'] },
    ],
    meaning: {
      kind: 'quote',
      quotes: [
        'الخفض في الربّ، لقربه من قوله جَزَاءً مِنْ رَبّكَ : أعجب إليّ',
        'وأما الرّحْمَنُ بالرفع، فإنه أحسن، لبعده من ذلك.',
      ],
      source: TABARI,
      url: 'https://quranpedia.net/tafsir/an-naba/37/al-tabari',
    },
  },
  {
    surah: 79, ayah: 10, hafsWord: 'اءنا',
    readings: [
      { riwayat: ['qalun', 'warsh', 'bazzi', 'qunbul', 'duri-abu-amr', 'susi', 'hisham', 'ibn-dhakwan', 'shuba', 'hafs', 'khalaf-hamza', 'khallad', 'abu-al-harith', 'duri-kisai', 'ruways', 'rawh', 'ishaq', 'idris'] },
      { text: "إِنَّا", riwayat: ['ibn-wardan', 'ibn-jammaz'] },
    ],
  },
  {
    surah: 79, ayah: 11, hafsWord: 'اءذا',
    readings: [
      { riwayat: ['bazzi', 'qunbul', 'duri-abu-amr', 'susi', 'shuba', 'hafs', 'khalaf-hamza', 'khallad', 'ibn-wardan', 'ibn-jammaz', 'ishaq', 'idris'] },
      { text: "إِذَا", riwayat: ['qalun', 'warsh', 'hisham', 'ibn-dhakwan', 'abu-al-harith', 'duri-kisai', 'ruways', 'rawh'] },
    ],
  },
  {
    surah: 80, ayah: 4, hafsWord: 'فتنفعه',
    readings: [
      { riwayat: ['hafs', 'shuba'] },
      { text: "فَتَنفَعُهُ", riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'rawh', 'ruways', 'ibn-jammaz', 'ibn-wardan', 'duri-kisai', 'abu-al-harith', 'khallad', 'qalun', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh'] },
    ],
  },
  {
    surah: 80, ayah: 25, hafsWord: 'انا',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'ruways', 'duri-kisai', 'abu-al-harith', 'khallad', 'hafs', 'shuba'] },
      { text: "إِنَّا", riwayat: ['ibn-dhakwan', 'qalun', 'hisham', 'susi', 'duri-abu-amr', 'ibn-wardan', 'ibn-jammaz', 'qunbul', 'rawh', 'bazzi', 'warsh'] },
    ],
  },
  {
    surah: 81, ayah: 9, hafsWord: 'قتلت',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'rawh', 'ruways', 'duri-kisai', 'abu-al-harith', 'khallad', 'qalun', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh'] },
      { text: "قُتِّلَتۡ", riwayat: ['ibn-wardan', 'ibn-jammaz'] },
    ],
  },
  {
    surah: 82, ayah: 7, hafsWord: 'فعدلك',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'duri-kisai', 'abu-al-harith', 'khallad', 'hafs', 'shuba'] },
      { text: "فَعَدَّلَكَ", riwayat: ['ibn-dhakwan', 'hisham', 'qalun', 'susi', 'duri-abu-amr', 'qunbul', 'ibn-wardan', 'ibn-jammaz', 'ruways', 'rawh', 'bazzi', 'warsh'] },
    ],
  },
  {
    surah: 82, ayah: 19, hafsWord: 'يوم',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'ibn-jammaz', 'ibn-wardan', 'duri-kisai', 'abu-al-harith', 'khallad', 'qalun', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'warsh'] },
      { text: "یَوۡمُ", riwayat: ['bazzi', 'qunbul', 'duri-abu-amr', 'susi', 'rawh', 'ruways'] },
    ],
  },
  {
    surah: 83, ayah: 24, hafsWord: 'نضره',
    readings: [
      { riwayat: ['ishaq', 'duri-kisai', 'idris', 'abu-al-harith', 'khallad', 'khalaf-hamza', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh', 'qalun'] },
      { text: "نَضۡرَةُ", riwayat: ['ruways', 'rawh', 'ibn-jammaz', 'ibn-wardan'] },
    ],
  },
  {
    surah: 83, ayah: 31, hafsWord: 'فكهين',
    readings: [
      { riwayat: ['hafs', 'ibn-wardan', 'ibn-jammaz'] },
      { text: "فَاكِهِینَ", riwayat: ['ruways', 'idris', 'rawh', 'ishaq', 'duri-kisai', 'abu-al-harith', 'khallad', 'khalaf-hamza', 'shuba', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh', 'qalun'] },
    ],
  },
  {
    surah: 84, ayah: 19, hafsWord: 'لتركبن',
    readings: [
      { riwayat: ['warsh', 'qalun', 'duri-abu-amr', 'susi', 'hisham', 'ibn-dhakwan', 'shuba', 'hafs', 'rawh', 'ruways', 'ibn-jammaz', 'ibn-wardan'] },
      { text: "لَتَرۡكَبَنَّ", riwayat: ['idris', 'ishaq', 'duri-kisai', 'abu-al-harith', 'khallad', 'khalaf-hamza', 'qunbul', 'bazzi'] },
    ],
  },
  {
    surah: 85, ayah: 15, hafsWord: 'المجيد',
    readings: [
      { riwayat: ['qalun', 'ibn-wardan', 'ibn-jammaz', 'hafs', 'ruways', 'shuba', 'ibn-dhakwan', 'rawh', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'warsh', 'bazzi'] },
      { text: "الۡمَجیدِ", riwayat: ['idris', 'duri-kisai', 'abu-al-harith', 'khallad', 'khalaf-hamza', 'ishaq'] },
    ],
  },
  {
    surah: 85, ayah: 22, hafsWord: 'محفوظ',
    readings: [
      { riwayat: ['idris', 'ishaq', 'rawh', 'ruways', 'ibn-jammaz', 'ibn-wardan', 'duri-kisai', 'abu-al-harith', 'khallad', 'khalaf-hamza', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi'] },
      { text: "مَحۡفوظٌ", riwayat: ['warsh', 'qalun'] },
    ],
  },
  {
    surah: 86, ayah: 4, hafsWord: 'لما',
    readings: [
      { riwayat: ['ibn-dhakwan', 'shuba', 'hafs', 'khalaf-hamza', 'khallad', 'hisham', 'ibn-wardan', 'ibn-jammaz'] },
      { text: "لَمَا", riwayat: ['warsh', 'idris', 'ishaq', 'rawh', 'ruways', 'duri-kisai', 'abu-al-harith', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'qalun'] },
    ],
  },
  {
    surah: 87, ayah: 3, hafsWord: 'قدر',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'rawh', 'ruways', 'ibn-jammaz', 'ibn-wardan', 'khallad', 'qalun', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh'] },
      { text: "قَدَرَ", riwayat: ['duri-kisai', 'abu-al-harith'] },
    ],
  },
  {
    surah: 89, ayah: 3, hafsWord: 'والوتر',
    readings: [
      { riwayat: ['warsh', 'bazzi', 'qunbul', 'duri-abu-amr', 'susi', 'hisham', 'ibn-dhakwan', 'shuba', 'hafs', 'qalun', 'rawh', 'ruways', 'ibn-wardan', 'ibn-jammaz'] },
      { text: "وَالوِتۡرِ", riwayat: ['idris', 'ishaq', 'duri-kisai', 'abu-al-harith', 'khallad', 'khalaf-hamza'] },
    ],
  },
  {
    surah: 89, ayah: 4, hafsWord: 'يسر',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'duri-kisai', 'abu-al-harith', 'khallad', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham'] },
      { text: "یَسۡرِی", riwayat: ['qalun', 'susi', 'duri-abu-amr', 'qunbul', 'ibn-wardan', 'ibn-jammaz', 'ruways', 'rawh', 'bazzi', 'warsh'] },
    ],
  },
  {
    surah: 89, ayah: 9, hafsWord: 'بالواد',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'ibn-jammaz', 'ibn-wardan', 'duri-kisai', 'abu-al-harith', 'khallad', 'qalun', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr'] },
      { text: "بِالۡوَادِی", riwayat: ['qunbul', 'ruways', 'rawh', 'bazzi', 'warsh'] },
    ],
  },
  {
    surah: 89, ayah: 16, hafsWord: 'فقدر',
    readings: [
      { riwayat: ['khallad', 'qalun', 'ruways', 'khalaf-hamza', 'abu-al-harith', 'duri-kisai', 'hafs', 'shuba', 'idris', 'warsh', 'bazzi', 'ishaq', 'qunbul', 'duri-abu-amr', 'susi', 'rawh'] },
      { text: "فَقَدَّرَ", riwayat: ['hisham', 'ibn-jammaz', 'ibn-dhakwan', 'ibn-wardan'] },
    ],
  },
  {
    surah: 89, ayah: 17, hafsWord: 'تكرمون',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'ibn-jammaz', 'ibn-wardan', 'duri-kisai', 'abu-al-harith', 'khallad', 'qalun', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'qunbul', 'bazzi', 'warsh'] },
      { text: "یُكۡرِمُونَ", riwayat: ['susi', 'duri-abu-amr', 'ruways', 'rawh'] },
    ],
  },
  {
    surah: 89, ayah: 25, hafsWord: 'يعذب',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'ibn-jammaz', 'ibn-wardan', 'khallad', 'qalun', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh'] },
      { text: "یُعَذَّبُ", riwayat: ['rawh', 'ruways', 'duri-kisai', 'abu-al-harith'] },
    ],
  },
  {
    surah: 89, ayah: 26, hafsWord: 'يوثق',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'ibn-jammaz', 'ibn-wardan', 'khallad', 'qalun', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh'] },
      { text: "یُوثَقُ", riwayat: ['rawh', 'ruways', 'duri-kisai', 'abu-al-harith'] },
    ],
  },
  {
    surah: 91, ayah: 15, hafsWord: 'ولا',
    readings: [
      { riwayat: ['idris', 'ishaq', 'rawh', 'ruways', 'duri-kisai', 'abu-al-harith', 'khallad', 'khalaf-hamza', 'hafs', 'shuba', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi'] },
      { text: "فَلاَ", riwayat: ['warsh', 'qalun', 'hisham', 'ibn-dhakwan', 'ibn-jammaz', 'ibn-wardan'] },
    ],
  },
  {
    surah: 97, ayah: 5, hafsWord: 'مطلع',
    readings: [
      { riwayat: ['warsh', 'rawh', 'ruways', 'ibn-jammaz', 'ibn-wardan', 'khallad', 'khalaf-hamza', 'hafs', 'shuba', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'qalun'] },
      { text: "مَطۡلِعِ", riwayat: ['abu-al-harith', 'duri-kisai', 'ishaq', 'idris'] },
    ],
  },
  {
    surah: 102, ayah: 6, hafsWord: 'لترون',
    readings: [
      { riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'rawh', 'ruways', 'ibn-jammaz', 'ibn-wardan', 'khallad', 'qalun', 'hafs', 'shuba', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh'] },
      { text: "لَتُرَوُنَّ", riwayat: ['hisham', 'ibn-dhakwan', 'duri-kisai', 'abu-al-harith'] },
    ],
  },
  {
    surah: 104, ayah: 2, hafsWord: 'جمع',
    readings: [
      { riwayat: ['warsh', 'bazzi', 'qunbul', 'duri-abu-amr', 'susi', 'qalun', 'shuba', 'hafs', 'ruways'] },
      { text: "جَمَّعَ", riwayat: ['idris', 'ishaq', 'rawh', 'ibn-jammaz', 'ibn-wardan', 'duri-kisai', 'abu-al-harith', 'khallad', 'khalaf-hamza', 'ibn-dhakwan', 'hisham'] },
    ],
  },
  {
    surah: 104, ayah: 3, hafsWord: 'يحسب',
    readings: [
      { riwayat: ['ibn-jammaz', 'hisham', 'ibn-dhakwan', 'shuba', 'hafs', 'khalaf-hamza', 'khallad', 'ibn-wardan'] },
      { text: "یَحۡسِبُ", riwayat: ['idris', 'qalun', 'ishaq', 'rawh', 'ruways', 'duri-kisai', 'abu-al-harith', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh'] },
    ],
  },
  {
    surah: 104, ayah: 9, hafsWord: 'عمد',
    readings: [
      { riwayat: ['ibn-dhakwan', 'hisham', 'hafs', 'qalun', 'susi', 'duri-abu-amr', 'qunbul', 'ibn-wardan', 'ibn-jammaz', 'ruways', 'rawh', 'bazzi', 'warsh'] },
      { text: "عُمُدٍ", riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'duri-kisai', 'abu-al-harith', 'khallad', 'shuba'] },
    ],
  },
  {
    surah: 109, ayah: 6, hafsWord: 'دين',
    readings: [
      { riwayat: ['hisham', 'abu-al-harith', 'duri-kisai', 'khallad', 'khalaf-hamza', 'qalun', 'hafs', 'ibn-wardan', 'shuba', 'ibn-dhakwan', 'ishaq', 'ibn-jammaz', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'idris', 'warsh'] },
      { text: "دِینی", riwayat: ['ruways', 'rawh'] },
    ],
  },
  {
    surah: 111, ayah: 4, hafsWord: 'حماله',
    readings: [
      { riwayat: ['hafs', 'shuba'] },
      { text: "حَمَّالَةُ", riwayat: ['khalaf-hamza', 'idris', 'ishaq', 'rawh', 'ruways', 'ibn-jammaz', 'ibn-wardan', 'duri-kisai', 'abu-al-harith', 'khallad', 'qalun', 'ibn-dhakwan', 'hisham', 'susi', 'duri-abu-amr', 'qunbul', 'bazzi', 'warsh'] },
    ],
  },
];
