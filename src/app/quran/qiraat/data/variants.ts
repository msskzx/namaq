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
];
