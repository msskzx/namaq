// What a tafsir says of how the readings of an ayah differ in meaning: quoted, with its source, kept from the first demo of
// this page (docs/plans/quran-qiraat.md); the demo's unsourced meaning lines were dropped (owner, 2026-11-19: every
// claim from a named source).
export type QiraatMeaning = { quotes: string[]; source: string; url: string };

export const QIRAAT_MEANINGS: Record<string, QiraatMeaning> = {
  '1:4': {
    quotes: [
      "وقد رجح كلا من القراءتين مرجحون من حيث المعنى، وكلاهما صحيحة حسنة"
    ],
    source: "ابن كثير",
    url: "https://quran.ksu.edu.sa/tafseer/ibn-katheer-baghawy-qortobi/sura1-aya4.html"
  },
  '2:259': {
    quotes: [
      "فهما وإن اختلفا في اللفظ، فمتقاربا المعنى"
    ],
    source: "الطبري، جامع البيان",
    url: "https://quranpedia.net/ayahs/2/259"
  },
  '3:146': {
    quotes: [
      "فأما من قرأ ﴿قَاتَلَ﴾ فإنه اختار ذلك لأنه قال: لو قتلوا لم يكن لقوله: ﴿فمَا وهَنُوا﴾ وجه معروف",
      "وأما الذين قرأوا ذلك: قتل، فإنهم قالوا: إنما عنى بالقتل النبيّ وبعض من معه من الربيين دون جميعهم"
    ],
    source: "الطبري، جامع البيان",
    url: "https://quranpedia.net/ayahs/3/146"
  },
  '18:86': {
    quotes: [
      "والحمئة: الحمأة السوداء",
      "وقال آخرون: بل هي تغيب في عين حارّة"
    ],
    source: "الطبري، جامع البيان",
    url: "https://quranpedia.net/ayahs/18/86"
  },
  '36:35': {
    quotes: [
      "ولو قيل: «ما» بمعنى المصدر كان مذهبًا، فيكون معنى الكلام: ومن عمل أيديهم",
      "ولو قيل: إنها بمعنى الجحد ولا موضع لها كان أيضًا مذهبا، فيكون معنى الكلام: ليأكلوا من ثمره ولم تعمله أيديهم"
    ],
    source: "الطبري، جامع البيان",
    url: "https://quranpedia.net/ayahs/36/35"
  },
  '49:6': {
    quotes: [
      "بمعنى: أمهلوا حتى تعرفوا صحته، لا تعجلوا بقبوله",
      "أنهما قراءتان معروفتان متقاربتا المعنى، فبأيتهما قرأ القارئ فمصيب"
    ],
    source: "الطبري، جامع البيان",
    url: "https://quranpedia.net/ayahs/49/6"
  },
  '78:37': {
    quotes: [
      "الخفض في الربّ، لقربه من قوله جَزَاءً مِنْ رَبّكَ : أعجب إليّ",
      "وأما الرّحْمَنُ بالرفع، فإنه أحسن، لبعده من ذلك."
    ],
    source: "الطبري، جامع البيان",
    url: "https://quranpedia.net/tafsir/an-naba/37/al-tabari"
  }
};
