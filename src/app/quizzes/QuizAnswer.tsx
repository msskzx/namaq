"use client";

import { UnderCard, useCardRow } from "@/components/common/UnderCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Eye } from "lucide-react";
import Button from "@/components/common/Button";
import type { QuestionChoice, QuestionFamily, QuizTopic } from "@/lib/quiz/types";
import type { QuizReference } from "@/lib/quiz/quizReference";
import type { BranchAnswer, BranchQuestion } from "@shared/quiz/branchQuestions";
import type { Branch, Variant } from "@shared/quran/branches";
import type { Hints } from "@shared/quiz/hints";
import { FORGOT, recited } from "@shared/quiz/choiceKinds";
import { markForgotten } from "@shared/ayahMarks";
import { mushafText } from "@shared/quran/mushafText";
import { branchesCorrect, emptyBranchAnswers } from "@shared/quiz/score";
import { BranchFeedback, BranchInputs } from "./BranchAnswers";
import { CompareFeedback, CompareInputs } from "./CompareAnswers";
import { comparePoints, emptyCompareAnswers, type CompareAsk } from "@shared/quiz/compareAnswers";
import { ChoiceAfter, ChoiceLabel, ChoiceQuran, type ChoiceParts } from "./ChoiceParts";
import type { ChoiceQuestion } from "@shared/quiz/choiceKinds";
import { canLook, LookButton, LookView } from "@/components/quiz/QuizLook";

export type QuizData = { questions: QuizQuestionView[]; surahNames?: Record<number, string> };

export interface QuizQuestionView {
  key: string;
  family: QuestionFamily | BranchQuestion["family"] | QuizTopic;
  promptArabic: string;
  /** The asked ayah's number («في أي سورة؟»). */
  number?: number;
  choices: QuestionChoice[];
  phrase?: string;
  branches?: BranchAnswer[];
  tree?: Branch;
  variants?: Variant[];
  prefixes?: Variant[];
  asked?: number[];
  compare?: CompareAsk;
  quran?: ChoiceParts["quran"];
  reveal?: ChoiceParts["reveal"];
  page?: ChoiceParts["page"];
  ayahKey?: string;
  alike?: ChoiceParts["alike"];
  marked?: ChoiceParts["marked"];
  explains?: ChoiceParts["explains"];
  passage?: ChoiceParts["passage"];
  quranChoices?: ChoiceParts["quranChoices"];
  whereOf?: ChoiceParts["whereOf"];
  note?: ChoiceParts["note"];
  /** What «ابحث عن الجواب» opens, and after the answer what shows under it (shared/quiz/choiceKinds.ts). */
  look?: ChoiceQuestion["look"];
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

const answerContent = (question: QuizQuestionView, value: string | undefined, answered: boolean) => {
  const choice = question.choices.find((item) => item.value === value);
  if (!choice) return null;
  const detail = question.choiceDetails?.[choice.value];
  if (!detail) return <ChoiceLabel question={question} value={choice.value} label={choice.labelArabic} answered={answered} />;
  return <span><span className="block font-quran leading-relaxed">{mushafText(detail.text)}</span><span className="text-xs text-[var(--home-muted)]">{detail.reference}</span></span>;
};

/**
 * One question of the solo quiz and its answer: the asked ayah, a tree to complete or the choices, what follows the answer, and
 * «إظهار الإجابة». The quiz page and the home feed's question cards (owner, 2026-11-14) both draw a question with it.
 * `given` is the answer once given (a tree's: its correct answer when all is right, "" otherwise).
 */
export default function QuizAnswer({ question, given, typed, hints, revealed, names, ar, onReveal, onType, onHints, onAnswer, mushaf = true }: {
  /** The mushaf button after a choice is answered (ChoiceAfter); a home card has it in its own row. */
  mushaf?: boolean;
  question: QuizQuestionView; given: string | undefined; typed: string[] | undefined; hints: Hints | undefined; revealed: boolean;
  names: Record<number, string>; ar: boolean;
  onReveal: () => void; onType: (value: string[]) => void; onHints: (value: Hints) => void; onAnswer: (value: string) => void;
}) {
  const inRow = useCardRow();
  const locked = given !== undefined;
  const answers = typed ?? (question.compare ? emptyCompareAnswers(question) : emptyBranchAnswers(question));
  return <>
    {question.ayah && <AskedAyah ayah={question.ayah} />}
    <ChoiceQuran question={question} given={given} revealed={revealed || locked} onReveal={onReveal} ar={ar} onAnswer={value => {
      if (value === FORGOT && question.ayahKey) markForgotten(question.ayahKey);
      onAnswer(value);
    }} />
    {question.compare ? (
      locked ? (
        <CompareFeedback key={question.key} question={question} typed={answers} ar={ar} hints={hints} />
      ) : (
        <CompareInputs key={question.key} question={question} typed={answers} onChange={onType} hints={hints ?? {}} onHints={onHints}
          onCheck={() => { const { earned, total } = comparePoints(question, answers); onAnswer(earned === total ? question.correctAnswer : ""); }} ar={ar} />
      )
    ) : question.branches ? (
      locked ? (
        <BranchFeedback key={question.key} question={question} names={names} typed={answers} ar={ar} hints={hints} />
      ) : (
        <BranchInputs key={question.key} question={question} typed={answers} onChange={onType} hints={hints ?? {}} onHints={onHints}
          onCheck={() => onAnswer(branchesCorrect(question, answers) ? question.correctAnswer : "")} ar={ar} />
      )
    ) : recited(question) && !revealed && !locked ? null : <div className="flex flex-col gap-2">
      {question.choices.map((choice) => {
        const isAnswer = choice.value === question.correctAnswer;
        const isGiven = given === choice.value;
        return (
          // As the app's choices (QuizChoice): ink on a quiet border until answered, then the right answer green and a wrong
          // pick accent (owner, 2026-11-15: a correct pick was filled with the accent, and every choice was accent before any).
          <Button key={choice.value} variant="outline" aria-pressed={isGiven}
            style={{ borderColor: locked && isAnswer ? 'var(--home-green)' : locked && isGiven ? 'var(--home-accent)' : 'var(--home-rule)',
              color: locked && isAnswer ? 'var(--home-green)' : locked && isGiven ? 'var(--home-accent)' : 'var(--home-ink)' }}
            onClick={() => {
              if (locked) return;
              if (recited(question) && choice.value === FORGOT && question.ayahKey) markForgotten(question.ayahKey);
              onAnswer(choice.value);
            }}>
            {/* No empty circle before a choice (owner, 2026-11-15): the mark comes only with the answer, as in the app. */}
            {locked && (isAnswer || isGiven) && <FontAwesomeIcon icon={isAnswer ? faCircleCheck : faCircleXmark} />}
            {answerContent(question, choice.value, locked)}
            {locked && isAnswer ? <span className="text-xs font-semibold">{ar ? 'صحيح' : 'Correct'}</span> : null}
            {locked && isGiven && !isAnswer ? <span className="text-xs font-semibold">{ar ? 'خطأ' : 'Incorrect'}</span> : null}
          </Button>
        );
      })}
    </div>}
    {!locked && canLook(question.look) && <LookButton look={question.look} />}
    {locked && <ChoiceAfter question={question} given={given} ar={ar} mushaf={mushaf}
      surahName={(value) => question.choices.find((choice) => choice.value === value)?.labelArabic} />}
    {/* After the answer, the view it was looked up in, so everyone learns from it (owner, 2026-11-19; the app's QuizChoice). */}
    {locked && canLook(question.look) && <div className="mt-4"><LookView look={question.look} shown /></div>}
    {/* In a feed card it joins the row of icons under the card (owner, 2026-11-19: no buttons in a card). */}
    {!locked && !recited(question) && <UnderCard><Button className={inRow ? undefined : "mt-3"} size={inRow ? "lg" : "sm"} variant={inRow ? "muted" : undefined}
      aria-label={inRow ? (ar ? "إظهار الإجابة" : "Show answer") : undefined} title={inRow ? (ar ? "إظهار الإجابة" : "Show answer") : undefined} onClick={() => {
      if (question.tree) onType(emptyBranchAnswers(question));
      if (question.compare) onType(emptyCompareAnswers(question));
      onAnswer("");
    }}><Eye size={inRow ? undefined : 16} aria-hidden />{!inRow && (ar ? "إظهار الإجابة" : "Show answer")}</Button></UnderCard>}
  </>;
}
