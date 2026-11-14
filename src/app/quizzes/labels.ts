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
  TUHFA_COMPLETE: { en: "Complete the verse", ar: "أكمل البيت" },
  TUHFA_NEXT: { en: "The next verse", ar: "البيت التالي" },
  TUHFA_RULE: { en: "A letter's rule", ar: "حكم الحرف" },
};

export const TOPIC_GROUPS: { en: string; ar: string; topics: QuizTopic[] }[] = [
  { en: "Quran", ar: "القرآن", topics: ["BRANCHES", "SURAH", "RECITE"] },
  { en: "Tuhfat al-Atfal", ar: "تحفة الأطفال", topics: ["TUHFA_COMPLETE", "TUHFA_NEXT", "TUHFA_RULE"] },
];

export const DIFFICULTY_LABELS: Record<Difficulty, { en: string; ar: string }> = {
  easy: { en: "Easy", ar: DIFFICULTY_NAMES.easy },
  medium: { en: "Medium", ar: DIFFICULTY_NAMES.medium },
  hard: { en: "Hard", ar: DIFFICULTY_NAMES.hard },
};
export { DIFFICULTY_NOTES } from "@shared/quiz/difficulty";
