// The multiple-choice question kinds a quiz can mix with the trees (choiceKinds.ts).
import type { ChoiceKind } from './choiceKinds';
import type { QuizTopic } from './settings';
import { reciteSnippet } from './reciteSnippet';
import { whichSurah } from './whichSurah';

export const CHOICE_KINDS: ChoiceKind[] = [whichSurah, reciteSnippet];

export const choiceKind = (topic: QuizTopic) => CHOICE_KINDS.find(kind => kind.id === topic);
