import type { QuizTopic } from "@/lib/quiz/types";

export const TOPIC_LABELS: Record<QuizTopic, { en: string; ar: string }> = {
  PEOPLE: { en: "People", ar: "أشخاص" },
  BATTLES: { en: "Battles", ar: "معارك" },
  RELATIONSHIPS: { en: "Relationships", ar: "علاقات" },
  AYAT: { en: "Revealed about whom", ar: "في من نزلت" },
  EVENTS: { en: "Events", ar: "أحداث" },
  PERSON_CIRCLE: { en: "A person's circle", ar: "دائرة شخص" },
  BRANCHES: { en: "Phrase trees", ar: "أشجار العبارات" },
};

export const TOPIC_GROUPS: { en: string; ar: string; topics: QuizTopic[] }[] = [
  { en: "Quran", ar: "القرآن", topics: ["BRANCHES", "AYAT"] },
  { en: "Seerah and biographies", ar: "السيرة والتراجم", topics: ["PEOPLE", "BATTLES", "RELATIONSHIPS", "EVENTS", "PERSON_CIRCLE"] },
];

export const LEAF_LEVELS: Record<number, { en: string; ar: string }> = {
  3: { en: "easy", ar: "سهل" },
  6: { en: "hard", ar: "صعب" },
};
