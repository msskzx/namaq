"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch, faSpellCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/common/Button";
import BranchTree, { AyahRefs, Marked } from "@/app/quran/branches/BranchTree";
import { PathButton } from "@/app/quran/branches/Paths";
import { askedNodes, branchNodes, givenAnswer, LEAF_WORDS, matchTreeAnswers, rightWords, spoken } from "@/lib/quiz/branchAnswers";
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

export function branchPoints(question: Question, typed: string[]) {
  if (!question.tree) return { earned: 0, total: 0 };
  const matches = matchTreeAnswers(question.tree, typed, given(question));
  const asked = branchNodes(question.tree).flatMap((_, index) => isAsked(question, index) ? [index] : []);
  return { earned: asked.filter(index => matches[index]?.correct).length, total: asked.length };
}

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

const ORDINALS = ["الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة", "السادسة", "السابعة", "الثامنة", "التاسعة", "العاشرة"];
const ordinal = (n: number, ar: boolean) => ar ? (ORDINALS[n - 1] ?? num(n)) : String(n);

type Correction = { index: number; number: number; node: Branch; typed: string; correct: boolean; right: number; needed: number };

/** One row per asked node: what was typed, word by word, against the node it was graded with. */
function corrections(question: Question, typed: string[], matches: ReturnType<typeof matchTreeAnswers>): Correction[] {
  const nodes = branchNodes(question.tree!);
  return nodes.flatMap((node, index) => isAsked(question, index) ? [index] : []).map((index, at) => {
    const answer = matches[index]?.node ?? nodes[index];
    const words = spoken(answer.words);
    const text = typed[index]?.trim() ?? "";
    return { index, number: at + 1, node: answer, typed: text, correct: Boolean(matches[index]?.correct), right: rightWords(text, words), needed: answer.children.length === 0 ? Math.min(LEAF_WORDS, words.length) : words.length };
  });
}

function Badge({ row, ar }: { row: Correction; ar: boolean }) {
  return <span aria-hidden className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[var(--home-paper)] ${row.correct ? "bg-[var(--home-green)]" : "bg-[var(--home-accent)]"}`}>{ar ? num(row.number) : row.number}</span>;
}

/** The node's words with the ones that are enough to type underlined. */
function NeededWords({ words, needed }: { words: string[]; needed: number }) {
  let seen = 0;
  const cut = words.findIndex(word => spoken([word]).length > 0 && ++seen === needed) + 1;
  return <span className="font-arabic text-lg leading-loose text-[var(--home-ink)]">
    <span className="underline decoration-2 underline-offset-8">{words.slice(0, cut).join(" ")}</span>
    {cut < words.length ? ` ${words.slice(cut).join(" ")}` : ""}
  </span>;
}

function TypedWords({ row, ar }: { row: Correction; ar: boolean }) {
  if (!row.typed) return <span className="text-[var(--home-muted)]">{ar ? "لم تكتب شيئًا" : "Nothing typed"}</span>;
  return <span className="font-arabic text-lg">{row.typed.split(/\s+/).map((word, at) => <React.Fragment key={at}>
    {at > 0 && " "}
    {at < row.right ? <span className="text-[var(--home-green)]">{word}</span> : <del className="text-[var(--home-accent)]">{word}</del>}
  </React.Fragment>)}</span>;
}

const verdict = (row: Correction, ar: boolean) => {
  if (row.correct) return ar ? "صحيح" : "Correct";
  if (!row.typed) return ar ? "بدون إجابة" : "No answer";
  if (row.right < row.typed.split(/\s+/).length) return ar ? `خطأ في الكلمة ${ordinal(row.right + 1, ar)}` : `Wrong at word ${row.right + 1}`;
  return row.needed === 1 || row.node.children.length > 0
    ? (ar ? "ناقص: اكتب كل كلماتها" : "Incomplete: type all its words")
    : (ar ? `ناقص: اكتب كلماته الـ${num(row.needed)} الأولى` : `Incomplete: type its first ${row.needed} words`);
};

export function BranchFeedback({ question, typed, names, juz, ar }: { question: Question; typed: string[]; names: Names; juz: JuzRange | null; ar: boolean }) {
  if (!question.tree) return null;
  const matches = matchTreeAnswers(question.tree, typed, given(question));
  const { offsets, parents } = nodeOffsets(question.tree);
  const rows = corrections(question, typed, matches);
  const byIndex = new Map(rows.map(row => [row.index, row]));
  const tags = Object.fromEntries((question.variants ?? []).flatMap(variant => variant.keys.map(key => [key, variant])));
  return (
    <div className="flex flex-col gap-3" dir="rtl">
      <BranchTree tree={question.tree} variants={question.variants} names={names} label={ar ? "شجرة الإجابة" : "Answer tree"}
        nodeTone={(index) => byIndex.has(index) ? (byIndex.get(index)!.correct ? "border-[var(--home-green)]" : "border-[var(--home-accent)]") : undefined}
        renderNode={(node, index, tags) => {
          const answer = matches[index]?.node ?? node;
          const context = { subject: answer.words.join(" "), siblings: answer.children.length === 0 && parents.has(answer) ? keys(parents.get(answer)!) : undefined };
          const row = byIndex.get(index);
          const marked = (text: React.ReactNode, references: React.ReactNode) => <Marked node={answer} ayahKeys={keys(answer)} {...context} names={names} offset={offsets.get(answer)} before={<PathButton id={`n${index}`} keys={keys(node)} subject={context.subject} />} references={references}>{text}</Marked>;
          if (!row) return marked(<span className="font-arabic text-lg leading-loose">{answer.words.join(" ")}</span>, answer.ayat.length > 0 && <AyahRefs keys={answer.ayat} names={names} tags={tags} />);
          // The full leaf is in the correction list, so the tree keeps it short enough for a phone.
          const short = answer.children.length === 0 && answer.words.length > LEAF_WORDS;
          return (
            <div className="flex items-start gap-2" data-answer={row.correct ? "correct" : "incorrect"}>
              <span className="mt-2"><Badge row={row} ar={ar} /></span>
              <span className="sr-only">{verdict(row, ar)}</span>
              <div className="flex flex-col">{marked(<span className="font-arabic text-lg leading-loose">{answer.words.slice(0, short ? LEAF_WORDS : undefined).join(" ")}{short ? " …" : ""}</span>, null)}</div>
            </div>
          );
        }} />
      <ol className="flex flex-col gap-2" aria-label={ar ? "تصحيح الأطراف" : "Leaf corrections"}>
        {[...rows].sort((a, b) => Number(a.correct) - Number(b.correct) || a.number - b.number).map(row => (
          <li key={row.index} data-correction={row.correct ? "correct" : "incorrect"} className="rounded-md border border-[var(--home-rule)] bg-[var(--home-paper-deep)] px-3 py-2">
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-[var(--home-ink)]"><Badge row={row} ar={ar} /><span className="sr-only">{ar ? `الطرف ${num(row.number)}: ` : `Leaf ${row.number}: `}</span>{verdict(row, ar)}</p>
            <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1">
              <dt className="text-sm text-[var(--home-muted)]">{ar ? "كتبتَ" : "You typed"}</dt>
              <dd><TypedWords row={row} ar={ar} /></dd>
              <dt className="text-sm text-[var(--home-muted)]">{row.correct ? (ar ? "الطرف" : "Leaf") : (ar ? "الصواب" : "Answer")}</dt>
              <dd><NeededWords words={row.node.words} needed={row.needed} /></dd>
            </dl>
            {row.node.ayat.length > 0 && <AyahRefs keys={row.node.ayat} names={names} tags={tags} />}
          </li>
        ))}
      </ol>
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
        <BranchTree tree={question.tree} variants={question.variants} names={{}} showSpellings={false} label={ar ? "أكمل الشجرة" : "Complete the tree"} renderNode={(node, index) => !isAsked(question, index) ? (
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
      <BranchTree tree={tree} variants={example.variants as Variant[]} names={{}} showSpellings={false} label={ar ? "مثال على الشجرة" : "Example tree"} renderNode={(node, index) => {
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
