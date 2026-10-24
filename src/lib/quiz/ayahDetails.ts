import { prisma } from '@/lib/prisma';

export type AyahDetails = Map<string, { text: string; reference: string }>;

// docs/quiz-ayah-revealed.md
export const askedAyah = (question: { family: string; attribute?: string | null }) =>
  question.family === 'AYAH_REVEALED_ABOUT' ? question.attribute ?? undefined : undefined;

export async function ayahDetails(
  questions: readonly { family: string; attribute?: string | null; choices: readonly { value: string }[] }[],
): Promise<AyahDetails> {
  const keys = [...new Set(questions.flatMap((question) => question.family === 'AYAH_LINK' ? question.choices.map((choice) => choice.value) : [askedAyah(question) ?? []].flat()))];
  const pairs = keys.flatMap((key) => {
    const [surah, number] = key.split(':').map(Number);
    return Number.isInteger(surah) && Number.isInteger(number) ? [{ surah, number }] : [];
  });
  if (pairs.length === 0) return new Map();
  const ayat = await prisma.ayah.findMany({
    where: { OR: pairs.map(({ surah, number }) => ({ number, surah: { number: surah } })) },
    include: { surah: { select: { number: true, name: true } } },
  });
  return new Map(ayat.map((ayah) => [
    `${ayah.surah.number}:${ayah.number}`,
    { text: ayah.text, reference: `${ayah.surah.name} ${ayah.surah.number}:${ayah.number}` },
  ]));
}
