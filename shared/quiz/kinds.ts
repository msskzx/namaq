// The multiple-choice question kinds a quiz can mix with the trees (choiceKinds.ts).
import type { ChoiceKind } from './choiceKinds';
import type { QuizTopic } from './settings';
import { compareQuiz } from './compareQuiz';
import { meaningQuiz } from './meaning';
import { termQuiz } from './balaghaTermQuiz';
import { balaghaQuiz, irabQuiz, qiraatQuiz, tafsirQuiz } from './ayahQuizzes';
import { ayahEnds, surahOpenings } from './pageKinds';
import { reciteSnippet } from './reciteSnippet';
import { siraQuiz } from './sira';
import { tarajimNasab, tarajimVirtue } from './tarajim';
import { tuhfaComplete, tuhfaNext, tuhfaRule } from './tuhfa';
import { whichSurah } from './whichSurah';

export const CHOICE_KINDS: ChoiceKind[] = [compareQuiz, whichSurah, reciteSnippet, surahOpenings, ayahEnds, meaningQuiz, tafsirQuiz, balaghaQuiz, termQuiz, irabQuiz, qiraatQuiz, tuhfaComplete, tuhfaNext, tuhfaRule, tarajimNasab, tarajimVirtue, siraQuiz];

export const choiceKind = (topic: QuizTopic) => CHOICE_KINDS.find(kind => kind.id === topic);
