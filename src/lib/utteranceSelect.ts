/**
 * What every route needs of an utterance, in one place so a person, a battle
 * and an event all return the same shape. See src/types/utterance.ts.
 */
const named = { select: { slug: true, name: true, nameTransliterated: true } } as const;
const person = { select: { id: true, slug: true, name: true, nameTransliterated: true } } as const;

export const utteranceSelect = {
  id: true,
  slug: true,
  kind: true,
  textArabic: true,
  speakerName: true,
  grading: true,
  occasion: true,
  speaker: person,
  subject: person,
  event: named,
  battle: named,
} as const;
