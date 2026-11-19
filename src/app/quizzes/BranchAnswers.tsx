"use client";

import { UnderCard, useCardRow } from "@/components/common/UnderCard";
import React from "react";
import { Eraser, Lightbulb } from "lucide-react";
import AyahCards from "@/app/quran/branches/AyahCards";
import { CardActions } from "@/app/quran/branches/Filters";
import { AroundButton } from "@/app/quran/branches/Surroundings";
import { NavButtons } from "@/components/common/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/common/Button";
import AyahFlow, { AyahWords } from "@/components/quran/text/AyahFlow";
import { askedNodes, branchNodes, givenAnswer, leadingSigns } from "@shared/quiz/branchAnswers";
import { correctionOf, gradedTree, verdict, type Correction } from "@shared/quiz/feedback";
import { emptyBranchAnswers, isAsked, type ScoredQuestion } from "@shared/quiz/score";
import { addHint, hintsOf, type Hints } from "@shared/quiz/hints";
import { ayatLabel, branchesHref, keys, shownAyat, type Branch, type Variant } from "@shared/quran/branches";
import { num } from "@shared/quran/arabicNumber";
import example from "@shared/data/quiz/example.json";
import Card from '@/components/common/Card';
import { BlankBoxes } from "@/app/quran/read/MushafPage";
import { useWriteBlanks, type WriteBlanks } from "@/components/recite/useRecite";
import { writeBlank, type WriteBlank } from "@shared/quiz/writeBlanks";

type Question = ScoredQuestion;
type Names = Record<number, string>;

/** The ayah signs an asked node opens with (﴿١٧﴾ where its ayah reads on): given before its boxes, never typed. */
function LeadingSigns({ node }: { node: Branch }) {
  const signs = leadingSigns(node.words);
  return signs.length ? <AyahWords className="text-[var(--home-muted)]">{signs.join(" ")}</AyahWords> : null;
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

/** The asked nodes as blanks to write: a leaf's first two words, or all the words of a node above leaves (the app's treeBlanks). */
function treeBlanks(question: Question): WriteBlank[] {
  return branchNodes(question.tree!).flatMap((node, index) => isAsked(question, index) ? [writeBlank(index, node.words, node.children.length > 0)] : []);
}

/**
 * The matrix view of a question: one card per ayah, the shared start in colour, each asked node's words as recite mode's boxes
 * (BlankBoxes). Without `write` (the explainer's example) the boxes show where you write, without taking typing.
 */
function MatrixInputs({ question, values, hints, write, names, ar }: { question: Question; values: string[]; hints: string[]; write?: WriteBlanks; names: Names; ar: boolean }) {
  const tree = question.tree!;
  const nodes = branchNodes(tree);
  const blanks = treeBlanks(question);
  return <div className="flex flex-col gap-2.5" dir="rtl" data-quiz-matrix>
    {matrixRows(tree, question.prefixes ?? []).map(({ leaf, path, words, before, ayahKeys }) => {
      const spans = shownAyat(leaf, words);
      return <Card key={`${path.join("-")}:${ayahKeys[0]}`} className="p-2.5">
        <p className="text-xs text-[var(--home-muted)]">{ayahKeys.map(key => ayatLabel(spans[key], names)).join(" · ")}</p>
        <AyahFlow row className="text-[var(--home-ink)]">
          {before.length > 0 && <AyahWords>{before.join(" ")}</AyahWords>}
          <AyahWords className="font-bold text-[var(--home-accent)]">{givenAnswer(tree)}</AyahWords>
          {path.map(index => {
            const at = blanks.findIndex(blank => blank.id === index);
            return at < 0
              ? <AyahWords key={index}>{values[index]}</AyahWords>
              : <React.Fragment key={index}><LeadingSigns node={nodes[index]} /><BlankBoxes blank={blanks[at]} index={at} write={write} hint={hints[index] || undefined} name={ar ? `العقدة ${num(index + 1)}` : `Node ${index + 1}`} /></React.Fragment>;
          })}
        </AyahFlow>
      </Card>;
    })}
  </div>;
}

function Badge({ row, ar }: { row: Correction; ar: boolean }) {
  return <span aria-hidden className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${row.correct ? "bg-[color-mix(in_srgb,var(--home-green)_15%,var(--home-paper))] text-[var(--home-green)]" : "bg-[var(--home-action,var(--home-accent))] text-[var(--home-on-action,var(--home-paper))]"}`}>{ar ? num(row.number) : row.number}</span>;
}

function TypedWords({ row, ar }: { row: Correction; ar: boolean }) {
  if (!row.typed) return <span className="text-[var(--home-muted)]">{ar ? "لم تكتب شيئًا" : "Nothing typed"}</span>;
  return <span className="text-base">{row.typed.split(/\s+/).map((word, at) => <React.Fragment key={at}>
    {at > 0 && " "}
    {row.marks[at] ? <span className="text-[var(--home-green)]">{word}</span> : <del className="text-[var(--home-accent)]">{word}</del>}
  </React.Fragment>)}</span>;
}

/**
 * The graded answer as the ayah cards (the matrix): each ayah's card with how its asked node was graded. Quizzes draw the
 * matrix only and leave the tree to the rest of the site (owner, 2026-11-17).
 */
export function BranchFeedback({ question: givenQuestion, typed: givenTyped, names, ar, controls = true, hints }: { question: Question; typed: string[]; names: Names; ar: boolean; controls?: boolean;
  /** The hints used on this question, marked with a small bulb. */
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
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--home-ink)]"><Badge row={row} ar={ar} />{verdict(row, ar)}{hints?.[row.index] ? <Lightbulb size={15} className="text-[var(--home-muted)]" aria-label={ar ? "بتلميح" : "With a hint"} /> : null}</p>
            {!row.correct && <p className="text-sm"><span className="text-[var(--home-muted)]">{ar ? "كتبتَ: " : "You typed: "}</span><TypedWords row={row} ar={ar} /></p>}
          </div>;
        }} />
      </div>
      {controls && <UnderCard><CardActions id={id} text={question.tree!.words.join(' ')} href={branchesHref(id)} toggles={<AroundButton card={id} />} /></UnderCard>}
    </div>
  );
}

export function BranchInputs({ question, typed, onChange, onCheck, ar, sendEmpty = false, names, hints: kept, onHints }: { question: Question; typed: string[]; onChange: (typed: string[]) => void; onCheck: () => void; ar: boolean; names?: Names;
  /** The hints shown so far, when the quiz keeps them (solo, so the review can mark them); otherwise they live here. */
  hints?: Hints; onHints?: (hints: Hints) => void;
  /** A party may send it empty (owner, 2026-11-19): a player who does not know need not wait out the clock. */
  sendEmpty?: boolean }) {
  const inRow = useCardRow();
  const formId = React.useId();
  const [own, setOwn] = React.useState<Hints>({});
  const values = question.tree ? emptyBranchAnswers(question).map((value, index) => isAsked(question, index) ? typed[index] ?? "" : value) : [];
  const blanks = React.useMemo(() => question.tree ? treeBlanks(question) : [], [question]);
  const write = useWriteBlanks({ id: question.tree ? JSON.stringify(question.asked) + givenAnswer(question.tree) : "", blanks, texts: values,
    onType: (node, text) => onChange(values.map((value, at) => at === node ? text : value)),
    // Enter on the last box checks, as Enter in a field did.
    onEnd: () => { if (values.some((value, index) => isAsked(question, index) && value.trim())) onCheck(); } });
  if (!question.tree) return null;
  const hints = kept ?? own;
  const shown = hintsOf(question, hints);
  const hintLabel = ar ? "تلميح: حرف آخر من كل طرف فارغ" : "Hint: one more letter in each empty leaf";
  const started = values.some((value, index) => isAsked(question, index) && value.trim());
  return (
    <form id={formId} className="flex flex-col gap-3" onSubmit={(event) => {
      event.preventDefault();
      if (started || sendEmpty) onCheck();
    }}>
      {!question.asked && <p className="text-sm text-[var(--home-muted)]">{ar ? "أكمل كل عقدة. وفي نهاية كل فرع تكفي كلمتاه الأوليان، على أن تصح كل كلمة تكتبها. يمكن تبديل الفروع المتشابهة في الشكل." : "Complete every node. For a leaf, its first two words are enough, and every word you type must be right. Branches with the same shape can be entered in either order."}</p>}
      <div dir="rtl">
        {inRow
          ? <UnderCard><Button size="lg" variant="muted" aria-label={hintLabel} title={hintLabel} onClick={() => (onHints ?? setOwn)(addHint(question, values, hints))}><Lightbulb aria-hidden /></Button></UnderCard>
          : <NavButtons>
            <Button size="lg" variant="muted" aria-label={hintLabel} title={hintLabel} onClick={() => (onHints ?? setOwn)(addHint(question, values, hints))}><Lightbulb aria-hidden /></Button>
          </NavButtons>}
        {write.field({ "aria-label": ar ? "اكتب الكلمة" : "Write the word" })}
        <MatrixInputs question={question} values={values} hints={shown} write={write} names={names ?? {}} ar={ar} />
      </div>
      {/* In a feed card they join the row of icons under the card (owner: no buttons in a card); `form` keeps «تحقق» submitting. */}
      <UnderCard><div className={inRow ? "contents" : "flex flex-wrap gap-2"}>
      <Button variant={inRow ? "muted" : "primary"} size={inRow ? "lg" : undefined} type="submit" form={formId} disabled={!started && !sendEmpty} aria-label={inRow ? (ar ? "تحقق" : "Check") : undefined} title={inRow ? (ar ? "تحقق" : "Check") : undefined}>
        <FontAwesomeIcon icon={faCheckDouble} />
        {!inRow && (ar ? "تحقق" : "Check")}
      </Button>
      <Button variant={inRow ? "muted" : undefined} size={inRow ? "lg" : undefined} disabled={!started} onClick={() => onChange(emptyBranchAnswers(question))} aria-label={inRow ? (ar ? "مسح الإجابات" : "Clear answers") : undefined} title={inRow ? (ar ? "مسح الإجابات" : "Clear answers") : undefined}><Eraser size={16} aria-hidden />{!inRow && (ar ? "مسح الإجابات" : "Clear answers")}</Button>
      </div></UnderCard>
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
  return <div dir="rtl"><MatrixInputs question={question} values={values} hints={[]} names={{}} ar={ar} /></div>;
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
