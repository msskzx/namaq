// The multiple-choice question kinds a quiz can mix with the trees (choiceKinds.ts).
import type { ChoiceKind } from './choiceKinds';
import type { QuizTopic } from './settings';
import { compareQuiz } from './compareQuiz';
import { ayahEnds, surahOpenings } from './pageKinds';
import { reciteSnippet } from './reciteSnippet';
import { tuhfaComplete, tuhfaNext, tuhfaRule } from './tuhfa';
import { whichSurah } from './whichSurah';

export const CHOICE_KINDS: ChoiceKind[] = [compareQuiz, whichSurah, reciteSnippet, surahOpenings, ayahEnds, tuhfaComplete, tuhfaNext, tuhfaRule];

export const choiceKind = (topic: QuizTopic) => CHOICE_KINDS.find(kind => kind.id === topic);
