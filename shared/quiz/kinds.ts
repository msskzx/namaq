// The multiple-choice question kinds a quiz can mix with the trees (choiceKinds.ts).
import type { ChoiceKind } from './choiceKinds';
import type { QuizTopic } from './settings';
import { compareQuiz } from './compareQuiz';
import { meaningQuiz } from './meaning';
import { termQuiz } from './balaghaTermQuiz';
import { balaghaQuiz, irabQuiz, qiraatQuiz, qiraatWhoQuiz, tafsirQuiz } from './ayahQuizzes';
import { ayahEnds, surahOpenings } from './pageKinds';
import { reciteSnippet } from './reciteSnippet';
import { siraQuiz } from './sira';
import { hadithBookQuiz, hadithChainQuiz, hadithCompleteQuiz, hadithNarratorQuiz } from './hadith';
import { sahihKitabQuiz } from './sahih';
import { prophetNamesQuiz, tarajimKunya, tarajimLaqab, tarajimNasab, tarajimTie, tarajimVirtue } from './tarajim';
import { tarajimLife } from './life';
import { tuhfaComplete, tuhfaNext, tuhfaRule } from './tuhfa';
import { whichSurah } from './whichSurah';
import { surahOrderQuiz } from './surahOrderQuiz';

export const CHOICE_KINDS: ChoiceKind[] = [compareQuiz, whichSurah, surahOrderQuiz, reciteSnippet, surahOpenings, ayahEnds, meaningQuiz, tafsirQuiz, balaghaQuiz, termQuiz, irabQuiz, qiraatQuiz, qiraatWhoQuiz, tuhfaComplete, tuhfaNext, tuhfaRule, tarajimNasab, tarajimVirtue, tarajimTie, tarajimLife, tarajimLaqab, tarajimKunya, prophetNamesQuiz, siraQuiz, hadithNarratorQuiz, hadithCompleteQuiz, hadithBookQuiz, hadithChainQuiz, sahihKitabQuiz];

export const choiceKind = (topic: QuizTopic) => CHOICE_KINDS.find(kind => kind.id === topic);
