"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Eye } from "lucide-react";
import Button from "@/components/common/Button";
import type { QuestionChoice, QuestionFamily, QuizTopic } from "@/lib/quiz/types";
import type { QuizReference } from "@/lib/quiz/quizReference";
import type { BranchAnswer, BranchQuestion } from "@shared/quiz/branchQuestions";
import type { Branch, Variant } from "@shared/quran/branches";
import type { Hints } from "@shared/quiz/hints";
import { FORGOT, RECITE_SNIPPET } from "@shared/quiz/choiceKinds";
import { markForgotten } from "@shared/ayahMarks";
import { mushafText } from "@shared/quran/mushafText";
import { branchesCorrect, emptyBranchAnswers } from "@shared/quiz/score";
import { BranchFeedback, BranchInputs } from "./BranchAnswers";
import { ChoiceAfter, ChoiceQuran, type ChoiceParts } from "./ChoiceParts";

export type QuizData = { questions: QuizQuestionView[]; surahNames?: Record<number, string> };

export interface QuizQuestionView {
  key: string;
  family: QuestionFamily | BranchQuestion["family"] | QuizTopic;
  promptArabic: string;
  choices: QuestionChoice[];
  phrase?: string;
  branches?: BranchAnswer[];
  tree?: Branch;
  variants?: Variant[];
  prefixes?: Variant[];
  asked?: number[];
  quran?: ChoiceParts["quran"];
  reveal?: ChoiceParts["reveal"];
  ayahKey?: string;
  alike?: ChoiceParts["alike"];
  note?: ChoiceParts["note"];
  ayah?: { text: string; reference: string } | null;
  choiceDetails: Record<string, { text: string; reference: string }>;
  correctAnswer: string;
  evidence: { reference: QuizReference | null };
}

function AskedAyah({ ayah }: { ayah: { text: string; reference: string } }) {
  return (
    <blockquote dir="rtl" lang="ar" className="mb-4 border-s-2 border-[var(--home-accent)] ps-4">
      <p className="font-quran text-xl leading-loose text-[var(--home-ink)]">{mushafText(ayah.text)}</p>
      <p className="text-sm text-[var(--home-muted)]">{ayah.reference}</p>
    </blockquote>
  );
}

const answerContent = (question: QuizQuestionView, value: string | undefined) => {
  const choice = question.choices.find((item) => item.value === value);
  if (!choice) return null;
  const detail = question.choiceDetails?.[choice.value];
  if (!detail) return choice.labelArabic;
  return <span><span className="block font-quran leading-relaxed">{mushafText(detail.text)}</span><span className="text-xs text-[var(--home-muted)]">{detail.reference}</span></span>;
};

/**
 * One question of the solo quiz and its answer: the asked ayah, a tree to complete or the choices, what follows the answer, and
 * «إظهار الإجابة». The quiz page and the home feed's question cards (owner, 2026-11-14) both draw a question with it.
 * `given` is the answer once given (a tree's: its correct answer when all is right, "" otherwise).
 */
export default function QuizAnswer({ question, given, typed, hints, revealed, names, ar, onReveal, onType, onHints, onAnswer }: {
  question: QuizQuestionView; given: string | undefined; typed: string[] | undefined; hints: Hints | undefined; revealed: boolean;
  names: Record<number, string>; ar: boolean;
  onReveal: () => void; onType: (value: string[]) => void; onHints: (value: Hints) => void; onAnswer: (value: string) => void;
}) {
  const locked = given !== undefined;
  const answers = typed ?? emptyBranchAnswers(question);
  return <>
    {question.ayah && <AskedAyah ayah={question.ayah} />}
    <ChoiceQuran question={question} given={given} revealed={revealed || locked} onReveal={onReveal} ar={ar} />
    {question.branches ? (
      locked ? (
        <BranchFeedback key={question.key} question={question} names={names} typed={answers} ar={ar} hints={hints} />
      ) : (
        <BranchInputs key={question.key} question={question} typed={answers} onChange={onType} hints={hints ?? {}} onHints={onHints}
          onCheck={() => onAnswer(branchesCorrect(question, answers) ? question.correctAnswer : "")} ar={ar} />
      )
    ) : question.reveal && !revealed && !locked ? null : <div className="flex flex-col gap-2">
      {question.choices.map((choice) => {
        const isAnswer = choice.value === question.correctAnswer;
        const isGiven = given === choice.value;
        return (
          <Button key={choice.value} variant="outline" active={isGiven}
            onClick={() => {
              if (locked) return;
              if (question.family === RECITE_SNIPPET && choice.value === FORGOT && question.ayahKey) markForgotten(question.ayahKey);
              onAnswer(choice.value);
            }}>
            <FontAwesomeIcon
              icon={locked && (isAnswer || isGiven) ? (isAnswer ? faCircleCheck : faCircleXmark) : isGiven ? faCircleCheck : faCircle}
              className={locked && isAnswer && !isGiven ? 'text-[var(--home-green)]' : undefined}
            />
            {answerContent(question, choice.value)}
            {locked && isAnswer ? <span className={`text-xs font-semibold ${isGiven ? '' : 'text-[var(--home-green)]'}`}>{ar ? 'صحيح' : 'Correct'}</span> : null}
            {locked && isGiven && !isAnswer ? <span className="text-xs font-semibold">{ar ? 'خطأ' : 'Incorrect'}</span> : null}
          </Button>
        );
      })}
    </div>}
    {locked && <ChoiceAfter question={question} given={given} ar={ar}
      surahName={(value) => question.choices.find((choice) => choice.value === value)?.labelArabic} />}
    {!locked && !question.reveal && <Button className="mt-3" size="sm" onClick={() => {
      if (question.tree) onType(emptyBranchAnswers(question));
      onAnswer("");
    }}><Eye size={16} aria-hidden />{ar ? "إظهار الإجابة" : "Show answer"}</Button>}
  </>;
}
