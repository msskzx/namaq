import sharedAyat from '@/app/quran/branches/ayat.json';
import musaAyat from '@/app/quran/prophets/ayat/musa.json';
import bank from '../../data/quiz/questions.json';
import { branch, startingWith, type BranchAyah } from '@/lib/quran/branches';
import { ayahWords } from '@/lib/quran/normalize';
import { pairOf, wordTokens } from '@/lib/quran/compare';
import wordKeys from '@/app/quran/compare/wordKeys.json';
import { MUSA } from '@/lib/quran/prophets/musa';
import { loadUnitView } from '@/lib/modelUnits';

const MUSA_EVENT_EN = [
  'Musa’s mother and the chest in the river', 'Leaving Egypt after killing the Egyptian',
  'Madyan: the two women and the agreed term', 'The call from Mount Tur',
  'Going to Pharaoh with the signs', 'The magicians believe', 'The signs and the threat to kill Musa',
  'The believer from Pharaoh’s family', 'Belief among the descendants and the prayer against Pharaoh',
  'The drowning of Pharaoh and his army', 'Pharaoh among the nations that denied',
  'After deliverance: the request for a god', 'God’s favor and covenant with the Children of Israel',
  'Manna, quails and water', 'The appointed meeting and the request to see God',
  'The calf and the Samiri', 'The tablets, the seventy and the raised mountain',
  'The Holy Land and the wandering', 'Entering the town and asking forgiveness',
  'The cow', 'Qarun from Musa’s people', 'His people’s harm and his vindication',
  'Musa and the righteous servant', 'His name among the prophets and nations', 'The book given to Musa',
];
const MUSA_PHASE_EN = ['Early life', 'The mission', 'The exodus', 'The Children of Israel', 'Knowledge and scripture'];

export async function getHomePreviews() {
  const group = startingWith(sharedAyat as BranchAyah[], 'ان المتقين');
  const comparisons = Array.from({ length: 5 }, (_, index) => {
    const a = ayahWords(musaAyat.ayat[`26:${41 + index}` as keyof typeof musaAyat.ayat], false);
    const b = ayahWords(musaAyat.ayat[`7:${113 + index}` as keyof typeof musaAyat.ayat], false);
    const pair = pairOf(41 + index, 113 + index, wordTokens(a.norm, wordKeys.surahs[25][40 + index]), wordTokens(b.norm, wordKeys.surahs[6][112 + index]), a.norm, b.norm);
    return { a: { ...a, number: 41 + index }, b: { ...b, number: 113 + index }, different: { a: pair.marksA, b: pair.marksB }, rooted: { a: pair.rootsA, b: pair.rootsB } };
  });
  const view = await loadUnitView('muslim-jibril');
  const question = bank.questions.find(question => question.status === 'APPROVED' && question.key === 'VIRTUE_HOLDER:PERSON:talhah-ibn-ubaydullah:virtues:talhah-ibn-ubaydullah');

  return {
    branches: { tree: branch(group), pages: Object.fromEntries(group.map(ayah => [ayah.key, ayah.page])) },
    comparisons,
    timeline: MUSA.events.map((event, index) => ({
      n: index + 1, surahCount: new Set(event.segments.map(segment => segment.surah)).size, title: event.title, titleEn: MUSA_EVENT_EN[index], phase: MUSA.phases[event.phase], phaseEn: MUSA_PHASE_EN[event.phase],
    })),
    hadith: view,
    question: question ? {
      prompt: question.promptArabicOverride ?? question.promptArabic,
      choices: question.choices, answer: question.correctAnswer,
      profile: `/people/${question.subject!.slug}`,
    } : null,
  };
}

export type HomePreviews = Awaited<ReturnType<typeof getHomePreviews>>;
