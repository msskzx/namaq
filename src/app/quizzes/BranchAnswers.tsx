"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faCodeBranch, faSpellCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/common/Button";
import BranchTree, { AyahRefs, Marked } from "@/app/quran/branches/BranchTree";
import { branchNodes, matchTreeAnswers } from "@/lib/quiz/branchAnswers";
import type { BranchAnswer } from "@/lib/quiz/branchQuestions";
import { branchesHref, type Branch, type Variant } from "@/lib/quran/branches";
import type { JuzRange } from "@/lib/quran/juz";
import { num } from "@/lib/quran/arabicNumber";

type Question = { phrase?: string; branches?: BranchAnswer[]; tree?: Branch; variants?: Variant[] };
type Names = Record<number, string>;

export const emptyBranchAnswers = (question: Question) => question.tree ? branchNodes(question.tree).map(() => "") : [];

export const branchesCorrect = (question: Question, typed: string[]) => Boolean(question.tree &&
  typed.length === branchNodes(question.tree).length && typed.length > 0 && matchTreeAnswers(question.tree, typed).every(hit => hit?.correct));

export function BranchFeedback({ question, typed, names, juz, ar }: { question: Question; typed: string[]; names: Names; juz: JuzRange | null; ar: boolean }) {
  if (!question.tree) return null;
  const matches = matchTreeAnswers(question.tree, typed);
  const pages = Object.fromEntries((question.branches ?? []).flatMap(branch => branch.ayat.map(ayah => [ayah.key, ayah.page])));
  return (
    <div className="flex flex-col gap-3" dir="rtl">
      <BranchTree tree={question.tree} variants={question.variants} names={names} pages={pages} label={ar ? "شجرة الإجابة" : "Answer tree"} renderNode={(node, index, tags) => {
        const match = matches[index];
        const hit = match?.correct;
        const answer = match?.node ?? node;
        return (
          <div className="flex flex-col gap-1" data-answer={hit ? "correct" : "incorrect"}>
            <span className="flex items-center gap-2 text-sm text-[var(--home-muted)]">
              <FontAwesomeIcon icon={hit ? faCircleCheck : faCircleXmark} className={hit ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"} />
              <span className="sr-only">{hit ? (ar ? "صحيح" : "Correct") : (ar ? "غير صحيح" : "Incorrect")}</span>
              {typed[index]?.trim() || (ar ? "بدون إجابة" : "No answer")}
            </span>
            <Marked node={answer} names={names} pages={pages}><span className="font-arabic text-lg leading-loose">{answer.words.join(" ")}</span></Marked>
            <AyahRefs keys={answer.ayat} names={names} pages={pages} tags={tags} className="" />
          </div>
        );
      }} />
      {question.phrase && (
        <Button className="self-start" size="sm" variant="outline" href={branchesHref(question.phrase, juz ?? undefined)}>
          <FontAwesomeIcon icon={faCodeBranch} />
          {ar ? "شجرة الفواتح" : "Openings tree"}
        </Button>
      )}
    </div>
  );
}

export function BranchInputs({ question, typed, onChange, onCheck, ar }: { question: Question; typed: string[]; onChange: (typed: string[]) => void; onCheck: () => void; ar: boolean }) {
  if (!question.tree) return null;
  const values = emptyBranchAnswers(question).map((_, index) => typed[index] ?? "");
  const started = values.some(value => value.trim());
  return (
    <form className="flex flex-col gap-3" onSubmit={(event) => {
      event.preventDefault();
      if (started) onCheck();
    }}>
      <p className="text-sm text-[var(--home-muted)]">{ar ? "أكمل كل عقدة. وفي نهاية كل فرع تكفي كلمتاه الأوليان، على أن تصح كل كلمة تكتبها. يمكن تبديل الفروع المتشابهة في الشكل." : "Complete every node. For a leaf, its first two words are enough, and every word you type must be right. Branches with the same shape can be entered in either order."}</p>
      <div dir="rtl">
        <BranchTree tree={question.tree} variants={question.variants} names={{}} pages={{}} showSpellings={false} label={ar ? "أكمل الشجرة" : "Complete the tree"} renderNode={(_, index) => (
          <label className="flex w-56 flex-col gap-1">
            <span className="sr-only">{ar ? `العقدة ${num(index + 1)}` : `Node ${index + 1}`}</span>
            <input type="text" dir="rtl" lang="ar" autoComplete="off" spellCheck={false} value={values[index]}
              onChange={(event) => onChange(values.map((value, at) => at === index ? event.target.value : value))}
              className="w-full rounded-sm border border-[var(--home-rule)] bg-transparent px-3 py-2 font-arabic text-lg text-[var(--home-ink)] focus:border-[var(--home-accent)]" />
          </label>
        )} />
      </div>
      <Button className="self-start" variant="primary" type="submit" disabled={!started}>
        <FontAwesomeIcon icon={faSpellCheck} />
        {ar ? "تحقق" : "Check"}
      </Button>
    </form>
  );
}
