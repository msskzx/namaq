import { DIFFICULTY_NAMES, type Difficulty } from "@shared/quiz/difficulty";
import type { QuizTopic } from "@/lib/quiz/types";

export const TOPIC_LABELS: Record<QuizTopic, { en: string; ar: string }> = {
  PEOPLE: { en: "People", ar: "أشخاص" },
  BATTLES: { en: "Battles", ar: "معارك" },
  RELATIONSHIPS: { en: "Relationships", ar: "علاقات" },
  AYAT: { en: "Revealed about whom", ar: "في من نزلت" },
  EVENTS: { en: "Events", ar: "أحداث" },
  PERSON_CIRCLE: { en: "A person's circle", ar: "دائرة شخص" },
  BRANCHES: { en: "Shared Quranic wording", ar: "متشابهات القرآن" },
  SURAH: { en: "Which surah?", ar: "في أي سورة؟" },
  ORDER: { en: "Order the surahs", ar: "رتّب السور" },
  ORDER_JUZ: { en: "Order a juz's surahs", ar: "رتّب سور الجزء" },
  RECITE: { en: "Recite the rest", ar: "سمّع بقية الآية" },
  COMPARE: { en: "Compare two places", ar: "قارن الموضعين" },
  OPENINGS: { en: "Surah openings", ar: "أوائل السور" },
  ENDS: { en: "Recite an ayah", ar: "سمّع الآية" },
  MEANING: { en: "What does it mean?", ar: "ما معنى؟" },
  TAFSIR: { en: "Which ayah is this tafsir on?", ar: "لأي آية هذا التفسير؟" },
  BALAGHA: { en: "Which style?", ar: "ما الأسلوب؟" },
  TERM: { en: "Which term?", ar: "ما المصطلح؟" },
  IRAB: { en: "What is its i'rab?", ar: "ما إعرابها؟" },
  QIRAAT: { en: "How does he read it?", ar: "كيف يقرؤها؟" },
  QIRAAT_WHO: { en: "Who reads it so?", ar: "مَن يقرأ هكذا؟" },
  TUHFA_COMPLETE: { en: "Complete the verse", ar: "أكمل البيت" },
  TUHFA_NEXT: { en: "The next verse", ar: "البيت التالي" },
  TUHFA_RULE: { en: "A letter's rule", ar: "حكم الحرف" },
  TARAJIM_NASAB: { en: "Where two lineages meet", ar: "أين يلتقي النسبان؟" },
  TARAJIM_NASAB_FILL: { en: "Complete the lineage", ar: "أكمل النسب" },
  TARAJIM_VIRTUE: { en: "Whose virtue?", ar: "صاحب المنقبة" },
  TARAJIM_TIE: { en: "How are they related?", ar: "ما صلته به؟" },
  TARAJIM_LIFE: { en: "In which year?", ar: "في أي سنة كان؟" },
  TARAJIM_LAQAB: { en: "What was he called?", ar: "بمَ لُقّب؟" },
  TARAJIM_KUNYA: { en: "What is his kunya?", ar: "ما كنيته؟" },
  PROPHET_NAMES: { en: "The Prophet's names", ar: "أسماء النبي ﷺ" },
  SIRA: { en: "Sira and battles", ar: "السيرة والغزوات" },
  HADITH_NARRATOR: { en: "Who narrated it?", ar: "من راوي الحديث؟" },
  HADITH_COMPLETE: { en: "Complete the hadith", ar: "أكمل الحديث" },
  HADITH_BOOK: { en: "Which books?", ar: "من أخرجه؟" },
  HADITH_CHAIN: { en: "Who is missing from the chain?", ar: "من حدّث به؟" },
  SAHIH_KITAB: { en: "Which kitab?", ar: "في أيّ كتاب؟" },
};

export const TOPIC_GROUPS: { en: string; ar: string; topics: QuizTopic[] }[] = [
  { en: "Quran", ar: "القرآن", topics: ["BRANCHES", "COMPARE", "SURAH", "ORDER", "ORDER_JUZ", "RECITE", "OPENINGS", "ENDS", "MEANING", "TAFSIR", "BALAGHA", "TERM", "IRAB", "QIRAAT", "QIRAAT_WHO"] },
  { en: "Tuhfat al-Atfal", ar: "تحفة الأطفال", topics: ["TUHFA_COMPLETE", "TUHFA_NEXT", "TUHFA_RULE"] },
  { en: "Tarajim", ar: "التراجم", topics: ["TARAJIM_NASAB", "TARAJIM_NASAB_FILL", "TARAJIM_VIRTUE", "TARAJIM_TIE", "TARAJIM_LIFE", "TARAJIM_LAQAB", "TARAJIM_KUNYA"] },
  { en: "Sira", ar: "السيرة", topics: ["SIRA", "PROPHET_NAMES"] },
  { en: "Hadith", ar: "الحديث", topics: ["HADITH_NARRATOR", "HADITH_COMPLETE", "HADITH_BOOK", "HADITH_CHAIN", "SAHIH_KITAB"] },
];

export const DIFFICULTY_LABELS: Record<Difficulty, { en: string; ar: string }> = {
  easy: { en: "Easy", ar: DIFFICULTY_NAMES.easy },
  medium: { en: "Medium", ar: DIFFICULTY_NAMES.medium },
  hard: { en: "Hard", ar: DIFFICULTY_NAMES.hard },
};
export { DIFFICULTY_NOTES } from "@shared/quiz/difficulty";
