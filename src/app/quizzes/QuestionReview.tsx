"use client";

import type { Hints } from "@shared/quiz/hints";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import Button from "@/components/common/Button";
import QuizSources from "@/components/quiz/QuizSources";
import OrderRows from "@/components/common/OrderRows";
import OrderTray from "@/components/common/OrderTray";
import type { QuestionChoice } from "@/lib/quiz/types";
import { emptyBranchAnswers, type QuestionAnswer, type ScoredQuestion } from "@shared/quiz/score";
import { num } from "@shared/quran/arabicNumber";
import { BranchFeedback } from "./BranchAnswers";
import { CompareFeedback } from "./CompareAnswers";
import { canLook, LookView } from "@/components/quiz/QuizLook";
import type { QuizLook } from "@shared/quiz/choiceKinds";
import AyahFlow, { AyahWords } from "@/components/quran/text/AyahFlow";
import { ChoiceAfter, ChoiceLabel, ChoiceQuran, type ChoiceParts } from "./ChoiceParts";
import { PICKS, picksOf, ticks } from "@shared/quiz/choiceKinds";

type ReviewQuestion = ScoredQuestion & ChoiceParts & {
  key: string;
  tray?: boolean;
  promptArabic: string;
  choices: QuestionChoice[];
  choiceDetails?: Record<string, { text: string; reference: string }>;
  ayah?: { text: string; reference: string } | null;
  look?: QuizLook;
};

export type ReviewEntry = { question: ReviewQuestion; answer: QuestionAnswer | null; result: { earned: number; total: number }; hints?: Hints };

export default function QuestionReview({ entries, names, ar }: { entries: ReviewEntry[]; names: Record<number, string>; ar: boolean }) {
  const [index, setIndex] = useState(0);
  const entry = entries[index];
  if (!entry) return null;
  const { question, answer, result } = entry;
  // Several right choices: the ticks joined (PICKS), each named, «، » between.
  const choiceText = (value: string): React.ReactNode => value.includes(PICKS) ? picksOf(value).map(one => question.choices.find(item => item.value === one)?.labelArabic ?? one).join("، ") : oneChoice(value);
  const oneChoice = (value: string) => {
    const choice = question.choices.find(item => item.value === value);
    const detail = question.choiceDetails?.[value];
    return detail ? <span className="w-full"><AyahFlow><AyahWords>{detail.text}</AyahWords></AyahFlow><span className="block text-sm text-[var(--home-muted)]">{detail.reference}</span></span>
      : choice && <ChoiceLabel question={question} value={value} label={choice.labelArabic} answered />;
  };
  const correct = result.earned === result.total;
  const Back = ar ? ArrowRight : ArrowLeft;
  const Forward = ar ? ArrowLeft : ArrowRight;
  return <section className="flex flex-col gap-3" aria-label={ar ? "مراجعة الأسئلة" : "Question review"}>
    <nav className="flex flex-wrap gap-2" aria-label={ar ? "أسئلة المراجعة" : "Review questions"}>
      {entries.map((item, at) => <Button key={item.question.key} size="sm" active={at === index} aria-current={at === index ? "step" : undefined}
        aria-label={ar ? `مراجعة السؤال ${num(at + 1)}` : `Review question ${at + 1}`} onClick={() => setIndex(at)}>
        {item.result.earned === item.result.total ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}{ar ? num(at + 1) : at + 1}
      </Button>)}
    </nav>
    <p className="text-sm text-[var(--home-muted)]" aria-live="polite">{ar ? `السؤال ${num(index + 1)} من ${num(entries.length)}` : `Question ${index + 1} of ${entries.length}`}</p>
    <p dir="rtl" lang="ar">{question.promptArabic}</p>
    <p>{question.compare
      ? (ar ? `${num(result.earned)} من ${num(result.total)} فراغات` : `${result.earned} of ${result.total} blanks`)
      : question.tree
      ? (ar ? `${num(result.earned)} من ${num(result.total)} أطراف` : `${result.earned} of ${result.total} leaves`)
      : question.write
      ? (ar ? `${num(result.earned)} من ${num(result.total)} كلمات` : `${result.earned} of ${result.total} words`)
      : question.order && !correct
      ? (ar ? `${num(result.earned)} من ${num(result.total)} في مكانها` : `${result.earned} of ${result.total} in place`)
      : ticks(question) && !correct
      ? (ar ? `${num(result.earned)} من ${num(result.total)} صحيحة` : `${result.earned} of ${result.total} right`)
      : (ar ? (correct ? "صحيح" : "خطأ") : correct ? "Correct" : "Incorrect")}</p>
    {question.ayah && <blockquote dir="rtl" lang="ar"><AyahFlow><AyahWords>{question.ayah.text}</AyahWords></AyahFlow><p className="text-sm text-[var(--home-muted)]">{question.ayah.reference}</p></blockquote>}
    <ChoiceQuran question={question} given={typeof answer === "string" ? answer : undefined} revealed ar={ar} written={Array.isArray(answer) ? answer : null} />
    {question.compare ? <CompareFeedback key={question.key} question={question} typed={Array.isArray(answer) ? answer : []} ar={ar} hints={entries[index].hints} /> : question.tree ? <BranchFeedback key={question.key} question={question} typed={Array.isArray(answer) ? answer : emptyBranchAnswers(question)} names={names} ar={ar} hints={entries[index].hints} /> : question.write ? <QuizSources sources={question.sources} /> : question.order ? <>
      {question.tray ? <OrderTray question={question} given={typeof answer === "string" ? answer : ""} ar={ar} />
        : <OrderRows question={question} given={typeof answer === "string" ? answer : ""} ar={ar} />}
      <ChoiceAfter question={question} given={typeof answer === "string" && answer ? answer : undefined} ar={ar} />
    </> : <>
      <div>{typeof answer === "string" && answer ? choiceText(answer) : ar ? "بدون إجابة" : "No answer"}</div>
      {!correct && <div>{ar ? "الصحيح: " : "Correct: "}{choiceText(question.correctAnswer ?? "")}</div>}
      <ChoiceAfter question={question} given={typeof answer === "string" && answer ? answer : undefined} ar={ar} surahName={value => question.choices.find(item => item.value === value)?.labelArabic} />
      {canLook(question.look) && <LookView look={question.look} shown />}
    </>}
    <nav className="flex justify-between gap-2" aria-label={ar ? "التنقل في المراجعة" : "Review navigation"}>
      <Button disabled={index === 0} onClick={() => setIndex(index - 1)}><Back size={16} aria-hidden />{ar ? "السابق" : "Previous"}</Button>
      <Button disabled={index === entries.length - 1} onClick={() => setIndex(index + 1)}>{ar ? "التالي" : "Next"}<Forward size={16} aria-hidden /></Button>
    </nav>
  </section>;
}
