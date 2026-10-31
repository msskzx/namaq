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

export const LEAF_LEVELS: Record<number, { en: string; ar: string }> = {
  1: { en: "easy", ar: "سهل" },
  10: { en: "hard", ar: "صعب" },
};
