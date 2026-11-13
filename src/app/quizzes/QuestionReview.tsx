"use client";

import type { Hints } from "@shared/quiz/hints";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, X } from "lucide-react";
import Button from "@/components/common/Button";
import QuizReferenceDialog from "@/components/common/QuizReferenceDialog";
import type { QuizReference } from "@/lib/quiz/quizReference";
import type { QuestionChoice } from "@/lib/quiz/types";
import { emptyBranchAnswers, type QuestionAnswer, type ScoredQuestion } from "@shared/quiz/score";
import { num } from "@shared/quran/arabicNumber";
import { BranchFeedback } from "./BranchAnswers";
import { mushafText } from '@shared/quran/mushafText';
import { ChoiceAfter, ChoiceQuran, type ChoiceParts } from "./ChoiceParts";

type ReviewQuestion = ScoredQuestion & ChoiceParts & {
  key: string;
  promptArabic: string;
  choices: QuestionChoice[];
  choiceDetails?: Record<string, { text: string; reference: string }>;
  ayah?: { text: string; reference: string } | null;
  evidence?: { reference: QuizReference | null };
};

export type ReviewEntry = { question: ReviewQuestion; answer: QuestionAnswer | null; result: { earned: number; total: number }; hints?: Hints };

export default function QuestionReview({ entries, names, ar }: { entries: ReviewEntry[]; names: Record<number, string>; ar: boolean }) {
  const [index, setIndex] = useState(0);
  const [source, setSource] = useState(false);
  const entry = entries[index];
  if (!entry) return null;
  const { question, answer, result } = entry;
  const choiceText = (value: string) => {
    const choice = question.choices.find(item => item.value === value);
    const detail = question.choiceDetails?.[value];
    return detail ? <span><span className="font-quran">{mushafText(detail.text)}</span><span className="block text-sm text-[var(--home-muted)]">{detail.reference}</span></span> : choice?.labelArabic;
  };
  const correct = result.earned === result.total;
  const Back = ar ? ArrowRight : ArrowLeft;
  const Forward = ar ? ArrowLeft : ArrowRight;
  return <section className="flex flex-col gap-3" aria-label={ar ? "مراجعة الأسئلة" : "Question review"}>
    <nav className="flex flex-wrap gap-2" aria-label={ar ? "أسئلة المراجعة" : "Review questions"}>
      {entries.map((item, at) => <Button key={item.question.key} size="sm" active={at === index} aria-current={at === index ? "step" : undefined}
        aria-label={ar ? `مراجعة السؤال ${num(at + 1)}` : `Review question ${at + 1}`} onClick={() => { setIndex(at); setSource(false); }}>
        {item.result.earned === item.result.total ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}{ar ? num(at + 1) : at + 1}
      </Button>)}
    </nav>
    <p className="text-sm text-[var(--home-muted)]" aria-live="polite">{ar ? `السؤال ${num(index + 1)} من ${num(entries.length)}` : `Question ${index + 1} of ${entries.length}`}</p>
    <p dir="rtl" lang="ar">{question.promptArabic}</p>
    <p>{question.tree
      ? (ar ? `${num(result.earned)} من ${num(result.total)} أطراف` : `${result.earned} of ${result.total} leaves`)
      : (ar ? (correct ? "صحيح" : "خطأ") : correct ? "Correct" : "Incorrect")}</p>
    {question.ayah && <blockquote dir="rtl" lang="ar"><p className="font-quran text-xl leading-loose">{mushafText(question.ayah.text)}</p><p className="text-sm text-[var(--home-muted)]">{question.ayah.reference}</p></blockquote>}
    <ChoiceQuran question={question} given={typeof answer === "string" ? answer : undefined} revealed ar={ar} />
    {question.tree ? <BranchFeedback key={question.key} question={question} typed={Array.isArray(answer) ? answer : emptyBranchAnswers(question)} names={names} ar={ar} hints={entries[index].hints} /> : <>
      <div>{typeof answer === "string" && answer ? choiceText(answer) : ar ? "بدون إجابة" : "No answer"}</div>
      {!correct && <div>{ar ? "الصحيح: " : "Correct: "}{choiceText(question.correctAnswer ?? "")}</div>}
      <ChoiceAfter question={question} given={typeof answer === "string" && answer ? answer : undefined} ar={ar} surahName={value => question.choices.find(item => item.value === value)?.labelArabic} />
    </>}
    {question.evidence?.reference && <Button className="self-start" size="sm" onClick={() => setSource(true)}><BookOpen size={16} aria-hidden />{ar ? "المصدر" : "Source"}</Button>}
    <nav className="flex justify-between gap-2" aria-label={ar ? "التنقل في المراجعة" : "Review navigation"}>
      <Button disabled={index === 0} onClick={() => { setIndex(index - 1); setSource(false); }}><Back size={16} aria-hidden />{ar ? "السابق" : "Previous"}</Button>
      <Button disabled={index === entries.length - 1} onClick={() => { setIndex(index + 1); setSource(false); }}>{ar ? "التالي" : "Next"}<Forward size={16} aria-hidden /></Button>
    </nav>
    <QuizReferenceDialog reference={source ? question.evidence?.reference ?? null : null} onClose={() => setSource(false)} />
  </section>;
}
