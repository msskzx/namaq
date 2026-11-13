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
};

export const TOPIC_GROUPS: { en: string; ar: string; topics: QuizTopic[] }[] = [
  { en: "Quran", ar: "القرآن", topics: ["BRANCHES"] },
];

export const DIFFICULTY_LABELS: Record<Difficulty, { en: string; ar: string }> = {
  easy: { en: "Easy", ar: DIFFICULTY_NAMES.easy },
  medium: { en: "Medium", ar: DIFFICULTY_NAMES.medium },
  hard: { en: "Hard", ar: DIFFICULTY_NAMES.hard },
};
export const DIFFICULTY_NOTE = {
  ar: "سهل: آيات تفترق سريعًا. صعب: آيات تكاد تتطابق إلا كلمة أو كلمتين.",
  en: "Easy: ayat that part soon. Hard: ayat alike but for a word or two.",
};
