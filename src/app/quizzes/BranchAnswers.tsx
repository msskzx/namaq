"use client";

import React from "react";
import { Eraser, Lightbulb } from "lucide-react";
import AyahCards from "@/app/quran/branches/AyahCards";
import { CardActions } from "@/app/quran/branches/Filters";
import { AroundButton } from "@/app/quran/branches/Surroundings";
import { NavButtons } from "@/components/common/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpellCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/common/Button";
import MushafText from "@/components/common/MushafText";
import { askedNodes, branchNodes, givenAnswer, leadingSigns } from "@shared/quiz/branchAnswers";
import { correctionOf, gradedTree, verdict, type Correction } from "@shared/quiz/feedback";
import { emptyBranchAnswers, isAsked, type ScoredQuestion } from "@shared/quiz/score";
import { addHint, hintsOf, type Hints } from "@shared/quiz/hints";
import { ayatLabel, branchesHref, keys, shownAyat, type Branch, type Variant } from "@shared/quran/branches";
import { num } from "@shared/quran/arabicNumber";
import example from "@shared/data/quiz/example.json";

type Question = ScoredQuestion;
type Names = Record<number, string>;

/** An asked node: the ayah sign it opens with (﴿١٧﴾ where its ayah reads on) given, then the box to type in. */
function AskedBox({ node, children }: { node: Branch; children: React.ReactNode }) {
  const signs = leadingSigns(node.words);
  if (!signs.length) return <>{children}</>;
  return <span className="flex items-center gap-1.5"><span className="font-quran text-lg text-[var(--home-muted)]"><MushafText>{signs.join(" ")}</MushafText></span>{children}</span>;
}

type MatrixRow = { leaf: Branch; path: number[]; words: string[]; before: string[]; ayahKeys: string[] };

/** One row per ayah ending, split where its ayat open with different words before the tree (يطوف / ويطوف), as the app's quiz matrix. */
function matrixRows(tree: Branch, prefixes: Variant[]): MatrixRow[] {
  const rows: MatrixRow[] = [];
  let next = 0;
  const walk = (node: Branch, path: number[], words: string[]) => node.children.forEach(child => {
    const index = next++;
    const here = [...path, index];
    if (!child.children.length) {
      const byBefore = new Map<string, { before: string[]; ayahKeys: string[] }>();
      for (const key of child.ayat.length ? child.ayat : keys(child)) {
        const prefix = prefixes.find(item => item.keys.includes(key));
        const before = prefix?.words ?? (prefix?.word ? prefix.word.split(" ") : []);
        const id = before.join(" ");
        byBefore.set(id, { before, ayahKeys: [...byBefore.get(id)?.ayahKeys ?? [], key] });
      }
      for (const { before, ayahKeys } of byBefore.values()) rows.push({ leaf: child, path: here, words, before, ayahKeys });
    }
    walk(child, here, [...words, ...child.words]);
  });
  walk(tree, [], tree.words);
  return rows;
}

/** The matrix view of a question: one card per ayah, the shared start in colour, a box where a node is asked. */
function MatrixInputs({ question, values, input, names }: { question: Question; values: string[]; input: (index: number) => React.ReactNode; names: Names }) {
  const tree = question.tree!;
  const nodes = branchNodes(tree);
  return <div className="flex flex-col gap-2.5" dir="rtl" data-quiz-matrix>
    {matrixRows(tree, question.prefixes ?? []).map(({ leaf, path, words, before, ayahKeys }) => {
      const spans = shownAyat(leaf, words);
      return <div key={`${path.join("-")}:${ayahKeys[0]}`} className="rounded-[14px] border border-[var(--home-rule)] bg-[var(--home-card)] p-2.5">
        <p className="text-xs text-[var(--home-muted)]">{ayahKeys.map(key => ayatLabel(spans[key], names)).join(" · ")}</p>
        <p className="flex flex-wrap items-center gap-x-2 font-quran text-lg leading-loose text-[var(--home-ink)]">
          {before.length > 0 && <MushafText>{before.join(" ")}</MushafText>}
          <span className="font-bold text-[var(--home-accent)]"><MushafText>{givenAnswer(tree)}</MushafText></span>
          {path.map(index => isAsked(question, index)
            ? <AskedBox key={index} node={nodes[index]}>{input(index)}</AskedBox>
            : <MushafText key={index}>{values[index]}</MushafText>)}
        </p>
      </div>;
    })}
  </div>;
}

function Badge({ row, ar }: { row: Correction; ar: boolean }) {
  return <span aria-hidden className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${row.correct ? "bg-[color-mix(in_srgb,var(--home-green)_15%,var(--home-paper))] text-[var(--home-green)]" : "bg-[var(--home-action,var(--home-accent))] text-[var(--home-on-action,var(--home-paper))]"}`}>{ar ? num(row.number) : row.number}</span>;
}

function TypedWords({ row, ar }: { row: Correction; ar: boolean }) {
  if (!row.typed) return <span className="text-[var(--home-muted)]">{ar ? "لم تكتب شيئًا" : "Nothing typed"}</span>;
  return <span className="font-quran text-lg">{row.typed.split(/\s+/).map((word, at) => <React.Fragment key={at}>
    {at > 0 && " "}
    {at < row.right ? <span className="text-[var(--home-green)]">{word}</span> : <del className="text-[var(--home-accent)]">{word}</del>}
  </React.Fragment>)}</span>;
}

/**
 * The graded answer as the ayah cards (the matrix): each ayah's card with how its asked node was graded. Quizzes draw the
 * matrix only and leave the tree to the rest of the site (owner, 2026-11-17).
 */
export function BranchFeedback({ question: givenQuestion, typed: givenTyped, names, ar, controls = true }: { question: Question; typed: string[]; names: Names; ar: boolean; controls?: boolean;
  /** The hints used on this question. */
  hints?: Hints }) {
  const snapshot = JSON.stringify({ question: givenQuestion, typed: givenTyped });
  const feedback = React.useMemo(() => {
    const { question, typed } = JSON.parse(snapshot) as { question: Question; typed: string[] };
    if (!question.tree) return null;
    const graded = gradedTree(question, typed);
    return { question, rows: graded.rows, solutionTree: graded.tree };
  }, [snapshot]);
  if (!feedback?.question.tree) return null;
  const { question, rows, solutionTree } = feedback;
  const id = question.phrase ?? question.tree!.words.join(' ');
  return (
    <div className="flex flex-col gap-3" dir="rtl" data-share-card>
      <div data-share-image>
        <AyahCards card={id} ayahKeys={keys(solutionTree)} names={names} note={key => {
          const row = correctionOf(rows, key);
          return row && <div className="flex flex-col gap-1 border-t border-[var(--home-rule)] pt-2" data-answer={row.correct ? "correct" : "incorrect"}>
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--home-ink)]"><Badge row={row} ar={ar} />{verdict(row, ar)}</p>
            {!row.correct && <p className="text-sm"><span className="text-[var(--home-muted)]">{ar ? "كتبتَ: " : "You typed: "}</span><TypedWords row={row} ar={ar} /></p>}
          </div>;
        }} />
      </div>
      {controls && <CardActions id={id} text={question.tree!.words.join(' ')} href={branchesHref(id)} toggles={<AroundButton card={id} />} />}
    </div>
  );
}

export function BranchInputs({ question, typed, onChange, onCheck, ar, names, hints: kept, onHints }: { question: Question; typed: string[]; onChange: (typed: string[]) => void; onCheck: () => void; ar: boolean; names?: Names;
  /** The hints shown so far, when the quiz keeps them (solo, so the review can mark them); otherwise they live here. */
  hints?: Hints; onHints?: (hints: Hints) => void }) {
  const [own, setOwn] = React.useState<Hints>({});
  if (!question.tree) return null;
  const values = emptyBranchAnswers(question).map((value, index) => isAsked(question, index) ? typed[index] ?? "" : value);
  const hints = kept ?? own;
  const shown = hintsOf(question, hints);
  const hintLabel = ar ? "تلميح: حرف آخر من كل طرف فارغ" : "Hint: one more letter in each empty leaf";
  const started = values.some((value, index) => isAsked(question, index) && value.trim());
  const box = (index: number, width: string) => (
    <label className={`flex ${width} max-w-full flex-col gap-1`}>
      <span className="sr-only">{ar ? `العقدة ${num(index + 1)}` : `Node ${index + 1}`}</span>
      <input type="text" dir="rtl" lang="ar" autoComplete="off" spellCheck={false} value={values[index]} placeholder={shown[index] || undefined}
        onChange={(event) => onChange(values.map((value, at) => at === index ? event.target.value : value))}
        className="w-full rounded-sm border border-[var(--home-rule)] bg-transparent px-3 py-2 font-quran text-lg text-[var(--home-ink)] focus:border-[var(--home-accent)]" />
    </label>
  );
  return (
    <form className="flex flex-col gap-3" onSubmit={(event) => {
      event.preventDefault();
      if (started) onCheck();
    }}>
      {!question.asked && <p className="text-sm text-[var(--home-muted)]">{ar ? "أكمل كل عقدة. وفي نهاية كل فرع تكفي كلمتاه الأوليان، على أن تصح كل كلمة تكتبها. يمكن تبديل الفروع المتشابهة في الشكل." : "Complete every node. For a leaf, its first two words are enough, and every word you type must be right. Branches with the same shape can be entered in either order."}</p>}
      <div dir="rtl">
        <NavButtons>
          <Button size="lg" variant="muted" aria-label={hintLabel} title={hintLabel} onClick={() => (onHints ?? setOwn)(addHint(question, values, hints))}><Lightbulb aria-hidden /></Button>
        </NavButtons>
        <MatrixInputs question={question} values={values} input={index => box(index, "w-32")} names={names ?? {}} />
      </div>
      <div className="flex flex-wrap gap-2">
      <Button variant="primary" type="submit" disabled={!started}>
        <FontAwesomeIcon icon={faSpellCheck} />
        {ar ? "تحقق" : "Check"}
      </Button>
      <Button disabled={!started} onClick={() => onChange(emptyBranchAnswers(question))}><Eraser size={16} aria-hidden />{ar ? "مسح الإجابات" : "Clear answers"}</Button>
      </div>
    </form>
  );
}

// docs/quiz-ayah-branches.md
/**
 * The example question as the quiz draws it, the matrix: the إن المتقين في tree, built by the same builder as every quiz tree
 * (shared/quiz/branchQuestions.test.ts keeps example.json equal to it).
 */
export function BranchPreview({ leaves, ar }: { leaves: number; ar: boolean }) {
  const tree = example.tree as Branch;
  const question: Question = { tree, prefixes: example.prefixes as Variant[], asked: askedNodes(tree, leaves, () => 0.5) };
  const values = branchNodes(tree).map((node, index) => isAsked(question, index) ? "" : node.words.join(" "));
  const empty = <span data-asked className="block h-8 w-24 rounded-sm border border-dashed border-[var(--home-accent)]"><span className="sr-only">{ar ? "تكتبه أنت" : "You type this"}</span></span>;
  return <div dir="rtl"><MatrixInputs question={question} values={values} input={() => empty} names={{}} /></div>;
}

/** How a متشابهات question works: what you type, the example, and how it is graded. */
export function BranchExplainer({ leaves, ar }: { leaves: number; ar: boolean }) {
  return (
    <>
      <p className="mb-4 text-sm leading-relaxed text-[var(--home-muted)]">{ar
        ? `تكمل ${num(leaves)} من الآيات المتشابهة، ويُعرض باقيها مكتوبًا. فإن كانت أقل طُلبت كلها.`
        : `You complete ${leaves} of the similar ayat, and the rest are shown. With fewer, all of them are asked.`}</p>
      <BranchPreview leaves={leaves} ar={ar} />
      <dl className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--home-ink)]">
        <div><dt className="inline font-semibold">{ar ? "التصحيح: " : "Grading: "}</dt><dd className="inline">{ar
          ? "تكفي من كل طرف كلمتاه الأوليان، ويجب أن تصح كل كلمة تكتبها وبترتيبها. اكتب بالإملاء المعتاد لا برسم المصحف، والهمزة على أي كرسي. لكل طرف صحيح نقطة، والأطراف المتشابهة في الشكل تقبل أي ترتيب."
          : "A leaf's first two words are enough, and every word you type must be right and in order. Type ordinary spelling, not the mushaf script; a hamza may sit on any seat. Each correct leaf scores a point, and leaves of the same shape can go in either order."}</dd></div>
        <div><dt className="inline font-semibold">{ar ? "الكلمة الملوّنة: " : "Coloured word: "}</dt><dd className="inline">{ar
          ? "بعد التحقق، كلمة تكتبها الآيات بضبط مختلف، مثل «إِن» و«إِنْ»، تُرسم باللون الكهرماني كما في متشابهات القرآن. اضغط الآية لتراها في سياقها."
          : "After checking, a word the ayat write with different marks, like «إِن» and «إِنْ», is drawn amber as on the branches page. Press an ayah to see it in context."}</dd></div>
        <div><dt className="inline font-semibold">{ar ? "الكلمة الأولى: " : "First word: "}</dt><dd className="inline">{ar
          ? "إذا بدأت بعض الآيات بالواو أو الفاء جاءت كل صيغة في صفها."
          : "When some ayat open with و or ف, each spelling gets its own rows."}</dd></div>
      </dl>
    </>
  );
}
