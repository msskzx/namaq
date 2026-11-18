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
  TUHFA_COMPLETE: { en: "Complete the verse", ar: "أكمل البيت" },
  TUHFA_NEXT: { en: "The next verse", ar: "البيت التالي" },
  TUHFA_RULE: { en: "A letter's rule", ar: "حكم الحرف" },
  TARAJIM_NASAB: { en: "Where two lineages meet", ar: "أين يلتقي النسبان؟" },
  TARAJIM_VIRTUE: { en: "Whose virtue?", ar: "صاحب المنقبة" },
  TARAJIM_TIE: { en: "How are they related?", ar: "ما صلته به؟" },
  SIRA: { en: "Sira and battles", ar: "السيرة والغزوات" },
};

export const TOPIC_GROUPS: { en: string; ar: string; topics: QuizTopic[] }[] = [
  { en: "Quran", ar: "القرآن", topics: ["BRANCHES", "COMPARE", "SURAH", "RECITE", "OPENINGS", "ENDS", "MEANING", "TAFSIR", "BALAGHA", "TERM", "IRAB", "QIRAAT"] },
  { en: "Tuhfat al-Atfal", ar: "تحفة الأطفال", topics: ["TUHFA_COMPLETE", "TUHFA_NEXT", "TUHFA_RULE"] },
  { en: "Tarajim", ar: "التراجم", topics: ["TARAJIM_NASAB", "TARAJIM_VIRTUE", "TARAJIM_TIE"] },
  { en: "Sira", ar: "السيرة", topics: ["SIRA"] },
];

export const DIFFICULTY_LABELS: Record<Difficulty, { en: string; ar: string }> = {
  easy: { en: "Easy", ar: DIFFICULTY_NAMES.easy },
  medium: { en: "Medium", ar: DIFFICULTY_NAMES.medium },
  hard: { en: "Hard", ar: DIFFICULTY_NAMES.hard },
};
export { DIFFICULTY_NOTES } from "@shared/quiz/difficulty";
