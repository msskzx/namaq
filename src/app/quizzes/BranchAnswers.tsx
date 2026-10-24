"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faCodeBranch, faSpellCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/common/Button";
import BranchTree, { AyahRefs, Marked } from "@/app/quran/branches/BranchTree";
import { askedNodes, branchNodes, givenAnswer, LEAF_WORDS, matchTreeAnswers } from "@/lib/quiz/branchAnswers";
import type { BranchAnswer } from "@/lib/quiz/branchQuestions";
import { branchesHref, keys, type Branch, type Variant } from "@/lib/quran/branches";
import type { JuzRange } from "@/lib/quran/juz";
import { num } from "@/lib/quran/arabicNumber";
import { TextSearch } from "lucide-react";
import example from "./example.json";

const differs = (node: Branch) => {
  const forms = Object.values(node.forms ?? {});
  return (forms[0] ?? []).some((_, i) => new Set(forms.map(words => words[i])).size > 1);
};

type Question = { phrase?: string; partition?: string; branches?: BranchAnswer[]; tree?: Branch; variants?: Variant[]; asked?: number[] };
type Names = Record<number, string>;

const isAsked = (question: Question, index: number) => !question.asked || question.asked.includes(index);
const given = (question: Question) => new Set(question.tree ? branchNodes(question.tree).flatMap((_, index) => isAsked(question, index) ? [] : [index]) : []);

export const emptyBranchAnswers = (question: Question) => question.tree ? branchNodes(question.tree).map((node, index) => isAsked(question, index) ? "" : givenAnswer(node)) : [];

export const branchesCorrect = (question: Question, typed: string[]) => Boolean(question.tree &&
  typed.length === branchNodes(question.tree).length && typed.length > 0 && matchTreeAnswers(question.tree, typed, given(question)).every(hit => hit?.correct));

function nodeOffsets(tree: Branch) {
  const offsets = new Map<Branch, number>();
  const parents = new Map<Branch, Branch>();
  const visit = (node: Branch, offset: number) => {
    offsets.set(node, offset);
    node.children.forEach(child => {
      parents.set(child, node);
      visit(child, offset + node.words.length);
    });
  };
  visit(tree, 0);
  return { offsets, parents };
}

export function BranchFeedback({ question, typed, names, juz, ar }: { question: Question; typed: string[]; names: Names; juz: JuzRange | null; ar: boolean }) {
  if (!question.tree) return null;
  const matches = matchTreeAnswers(question.tree, typed, given(question));
  const { offsets, parents } = nodeOffsets(question.tree);
  const pages = Object.fromEntries((question.branches ?? []).flatMap(branch => branch.ayat.map(ayah => [ayah.key, ayah.page])));
  return (
    <div className="flex flex-col gap-3" dir="rtl">
      <BranchTree tree={question.tree} variants={question.variants} names={names} pages={pages} label={ar ? "شجرة الإجابة" : "Answer tree"} renderNode={(node, index, tags) => {
        const match = matches[index];
        const hit = match?.correct;
        const answer = match?.node ?? node;
        const context = { subject: answer.words.join(" "), siblings: answer.children.length === 0 && parents.has(answer) ? keys(parents.get(answer)!) : undefined };
        if (!isAsked(question, index)) return <Marked node={answer} ayahKeys={keys(answer)} {...context} names={names} offset={offsets.get(answer)} leaf={answer.children.length === 0} references={answer.ayat.length > 0 && <AyahRefs keys={answer.ayat} names={names} pages={pages} tags={tags} linked={answer.children.length > 0} className="" />}><span className="font-arabic text-lg leading-loose">{answer.words.join(" ")}</span></Marked>;
        return (
          <div className="flex flex-col gap-1" data-answer={hit ? "correct" : "incorrect"}>
            <span className="flex items-center gap-2 text-sm text-[var(--home-muted)]">
              <FontAwesomeIcon icon={hit ? faCircleCheck : faCircleXmark} className={hit ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"} />
              <span className="sr-only">{hit ? (ar ? "صحيح" : "Correct") : (ar ? "غير صحيح" : "Incorrect")}</span>
              {typed[index]?.trim() || (ar ? "بدون إجابة" : "No answer")}
            </span>
            <Marked node={answer} ayahKeys={keys(answer)} {...context} names={names} offset={offsets.get(answer)} leaf={answer.children.length === 0} references={<AyahRefs keys={answer.ayat} names={names} pages={pages} tags={tags} linked={answer.children.length > 0} className="" />}><span className="font-arabic text-lg leading-loose">{answer.words.join(" ")}</span></Marked>
          </div>
        );
      }} />
      {question.phrase && (
        <Button className="self-start" size="sm" variant="outline" href={branchesHref(question.phrase, juz ?? undefined, { partition: question.partition })}>
          <FontAwesomeIcon icon={faCodeBranch} />
          {ar ? "شجرة الفواتح" : "Openings tree"}
        </Button>
      )}
    </div>
  );
}

export function BranchInputs({ question, typed, onChange, onCheck, ar }: { question: Question; typed: string[]; onChange: (typed: string[]) => void; onCheck: () => void; ar: boolean }) {
  if (!question.tree) return null;
  const values = emptyBranchAnswers(question).map((value, index) => isAsked(question, index) ? typed[index] ?? "" : value);
  const started = values.some((value, index) => isAsked(question, index) && value.trim());
  return (
    <form className="flex flex-col gap-3" onSubmit={(event) => {
      event.preventDefault();
      if (started) onCheck();
    }}>
      <p className="text-sm text-[var(--home-muted)]">{question.asked
        ? (ar ? "اكتب كل طرف فارغ. تكفي كلمتاه الأوليان، على أن تصح كل كلمة تكتبها وبترتيبها." : "Type each empty leaf. Its first two words are enough, and every word you type must be right and in order.")
        : (ar ? "أكمل كل عقدة. وفي نهاية كل فرع تكفي كلمتاه الأوليان، على أن تصح كل كلمة تكتبها. يمكن تبديل الفروع المتشابهة في الشكل." : "Complete every node. For a leaf, its first two words are enough, and every word you type must be right. Branches with the same shape can be entered in either order.")}</p>
      <div dir="rtl">
        <BranchTree tree={question.tree} variants={question.variants} names={{}} pages={{}} showSpellings={false} label={ar ? "أكمل الشجرة" : "Complete the tree"} renderNode={(node, index) => !isAsked(question, index) ? (
          <span className="font-arabic text-lg leading-loose text-[var(--home-muted)]">{givenAnswer(node)}</span>
        ) : (
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

// docs/quiz-ayah-branches.md
export function BranchPreview({ leaves, ar }: { leaves: number; ar: boolean }) {
  const tree = example.tree as Branch;
  const asked = askedNodes(tree, leaves, () => 0.5);
  return (
    <div dir="rtl">
      <BranchTree tree={tree} variants={example.variants as Variant[]} names={{}} pages={{}} showSpellings={false} label={ar ? "مثال على الشجرة" : "Example tree"} renderNode={(node, index) => {
        if (asked.includes(index)) return <span data-asked className="block h-8 w-28 rounded-sm border border-dashed border-[var(--home-accent)]"><span className="sr-only">{ar ? "تكتبه أنت" : "You type this"}</span></span>;
        if (node.children.length > 0) return <span className="flex flex-col items-start">
          <span className="font-arabic leading-loose">{node.words.join(" ")}</span>
          {differs(node) && <span data-differing className="mt-1 inline-flex items-center rounded border border-[var(--home-highlight-border)] bg-[var(--home-highlight)] px-2.5 py-1 text-[var(--home-on-highlight)]"><TextSearch size={16} aria-hidden /><span className="sr-only">{ar ? "زر اختلافات الضبط، يظهر بعد التحقق" : "Spelling differences button, shown after checking"}</span></span>}
        </span>;
        const shown = node.words.slice(0, LEAF_WORDS + 1);
        return <span className="font-arabic leading-loose text-[var(--home-muted)]">{shown.join(" ")}{shown.length < node.words.length ? " …" : ""}</span>;
      }} />
    </div>
  );
}
