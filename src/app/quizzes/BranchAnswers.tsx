"use client";

import React from "react";
import { Eraser, GalleryHorizontal, Lightbulb } from "lucide-react";
import TreeIcon from "@/components/common/TreeIcon";
import AyahCards from "@/app/quran/branches/AyahCards";
import { CardActions } from "@/app/quran/branches/Filters";
import { AroundButton, RotateButton } from "@/app/quran/branches/Surroundings";
import { NavButtons } from "@/components/common/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpellCheck } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/common/Button";
import MushafText from "@/components/common/MushafText";
import BranchTree, { AyahRefs, Marked, TreeWords } from "@/app/quran/branches/BranchTree";
import { PathButton } from "@/app/quran/branches/Paths";
import { askedNodes, givenAnswer, LEAF_WORDS } from "@shared/quiz/branchAnswers";
import { correctionOf, gradedTree, neededCut, verdict, type Correction } from "@shared/quiz/feedback";
import { emptyBranchAnswers, isAsked, type ScoredQuestion } from "@shared/quiz/score";
import { addHint, hintsOf, type Hints } from "@shared/quiz/hints";
import { branchesHref, keys, type Branch, type Variant } from "@shared/quran/branches";
import { num } from "@shared/quran/arabicNumber";
import example from "@shared/data/quiz/example.json";

type Question = ScoredQuestion;
type Names = Record<number, string>;

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

function Badge({ row, ar }: { row: Correction; ar: boolean }) {
  return <span aria-hidden className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${row.correct ? "bg-[color-mix(in_srgb,var(--home-green)_15%,var(--home-paper))] text-[var(--home-green)]" : "bg-[var(--home-action,var(--home-accent))] text-[var(--home-on-action,var(--home-paper))]"}`}>{ar ? num(row.number) : row.number}</span>;
}

/** The node's words with the ones that are enough to type underlined. */
function NeededWords({ words, needed, ayahKeys, at }: { words: string[]; needed: number; ayahKeys: string[]; at: number }) {
  const cut = neededCut(words, needed);
  return <span className="font-quran text-lg leading-loose text-[var(--home-ink)]">
    <span className="underline decoration-2 underline-offset-8"><TreeWords words={words.slice(0, cut)} ayahKeys={ayahKeys} at={at} /></span>
    {cut < words.length && <>{" "}<TreeWords words={words.slice(cut)} ayahKeys={ayahKeys} at={at + cut} /></>}
  </span>;
}

function TypedWords({ row, ar }: { row: Correction; ar: boolean }) {
  if (!row.typed) return <span className="text-[var(--home-muted)]">{ar ? "لم تكتب شيئًا" : "Nothing typed"}</span>;
  return <span className="font-quran text-lg">{row.typed.split(/\s+/).map((word, at) => <React.Fragment key={at}>
    {at > 0 && " "}
    {at < row.right ? <span className="text-[var(--home-green)]">{word}</span> : <del className="text-[var(--home-accent)]">{word}</del>}
  </React.Fragment>)}</span>;
}

export function BranchFeedback({ question: givenQuestion, typed: givenTyped, names, ar, controls = true, hints }: { question: Question; typed: string[]; names: Names; ar: boolean; controls?: boolean;
  /** The hints used on this question, marked with a small bulb. */
  hints?: Hints }) {
  const [matrix, setMatrix] = React.useState(false);
  const snapshot = JSON.stringify({ question: givenQuestion, typed: givenTyped });
  const feedback = React.useMemo(() => {
    const { question, typed } = JSON.parse(snapshot) as { question: Question; typed: string[] };
    if (!question.tree) return null;
    const graded = gradedTree(question, typed);
    return { question, typed, matches: graded.matches, rows: graded.rows, solutionTree: graded.tree };
  }, [snapshot]);
  if (!feedback) return null;
  const { question, matches, rows, solutionTree } = feedback;
  if (!question.tree) return null;
  const { offsets, parents } = nodeOffsets(question.tree);
  const byIndex = new Map(rows.map(row => [row.index, row]));
  const id = question.phrase ?? question.tree.words.join(' ');
  const label = matrix ? (ar ? 'اعرض الشجرة' : 'Show tree') : (ar ? 'اعرض بطاقات الآيات' : 'Show ayah cards');
  return (
    <div className="flex flex-col gap-3" dir="rtl">
      {controls && <NavButtons>
        <Button size="lg" variant="muted" onClick={() => setMatrix(value => !value)} aria-label={label} title={label}>
          {matrix ? <TreeIcon aria-hidden /> : <GalleryHorizontal aria-hidden />}
        </Button>
        {!matrix && <RotateButton />}
        <AroundButton />
      </NavButtons>}
      {matrix && controls ? <AyahCards ayahKeys={keys(solutionTree)} names={names} note={key => {
        const row = correctionOf(rows, key);
        return row && <div className="flex flex-col gap-1 border-t border-[var(--home-rule)] pt-2" data-answer={row.correct ? "correct" : "incorrect"}>
          <p className="flex items-center gap-2 text-sm font-semibold text-[var(--home-ink)]"><Badge row={row} ar={ar} />{verdict(row, ar)}</p>
          {!row.correct && <p className="text-sm"><span className="text-[var(--home-muted)]">{ar ? "كتبتَ: " : "You typed: "}</span><TypedWords row={row} ar={ar} /></p>}
        </div>;
      }} /> : <BranchTree organic tree={solutionTree} variants={question.variants} prefixes={question.prefixes} names={names} surround={{ on: false, sync: controls }} label={ar ? "شجرة الإجابة" : "Answer tree"} direction="auto" rotatable={controls} growable={controls}
        renderNode={(node, index, tags) => {
          const answer = matches[index]?.node ?? node;
          const context = { subject: answer.words.join(" "), siblings: answer.children.length === 0 && parents.has(answer) ? keys(parents.get(answer)!) : undefined };
          const row = byIndex.get(index);
          const marked = (text: React.ReactNode, references: React.ReactNode) => <Marked node={answer} ayahKeys={keys(answer)} {...context} names={names} offset={offsets.get(answer)} before={<PathButton id={`n${index}`} keys={keys(node)} subject={context.subject} />} references={references}>{text}</Marked>;
          if (!row) return marked(<span className="font-quran text-lg leading-loose"><TreeWords words={answer.words} ayahKeys={keys(answer)} at={offsets.get(answer) ?? 0} /></span>, answer.ayat.length > 0 && <AyahRefs keys={answer.ayat} names={names} tags={tags} />);
          return (
            <div className="flex max-w-60 flex-col gap-1" data-answer={row.correct ? "correct" : "incorrect"}>
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--home-ink)]"><Badge row={row} ar={ar} />{verdict(row, ar)}{hints?.[index] ? <Lightbulb size={15} className="text-[var(--home-muted)]" aria-label={ar ? "بتلميح" : "With a hint"} /> : null}</p>
              {marked(<NeededWords words={answer.words} needed={row.needed} ayahKeys={keys(answer)} at={offsets.get(answer) ?? 0} />, answer.ayat.length > 0 && <AyahRefs keys={answer.ayat} names={names} tags={tags} />)}
              {!row.correct && <p className="text-sm"><span className="text-[var(--home-muted)]">{ar ? "كتبتَ: " : "You typed: "}</span><TypedWords row={row} ar={ar} /></p>}
            </div>
          );
        }} />}
      {controls && <CardActions id={id} text={question.tree.words.join(' ')} href={branchesHref(id)} />}
    </div>
  );
}

export function BranchInputs({ question, typed, onChange, onCheck, ar, hints: kept, onHints }: { question: Question; typed: string[]; onChange: (typed: string[]) => void; onCheck: () => void; ar: boolean;
  /** The hints shown so far, when the quiz keeps them (solo, so the review can mark them); otherwise they live here. */
  hints?: Hints; onHints?: (hints: Hints) => void }) {
  const [own, setOwn] = React.useState<Hints>({});
  if (!question.tree) return null;
  const values = emptyBranchAnswers(question).map((value, index) => isAsked(question, index) ? typed[index] ?? "" : value);
  const hints = kept ?? own;
  const shown = hintsOf(question, hints);
  const hintLabel = ar ? "تلميح: حرف آخر من كل طرف فارغ" : "Hint: one more letter in each empty leaf";
  const started = values.some((value, index) => isAsked(question, index) && value.trim());
  return (
    <form className="flex flex-col gap-3" onSubmit={(event) => {
      event.preventDefault();
      if (started) onCheck();
    }}>
      {!question.asked && <p className="text-sm text-[var(--home-muted)]">{ar ? "أكمل كل عقدة. وفي نهاية كل فرع تكفي كلمتاه الأوليان، على أن تصح كل كلمة تكتبها. يمكن تبديل الفروع المتشابهة في الشكل." : "Complete every node. For a leaf, its first two words are enough, and every word you type must be right. Branches with the same shape can be entered in either order."}</p>}
      <div dir="rtl">
        <NavButtons>
          <Button size="lg" variant="muted" aria-label={hintLabel} title={hintLabel} onClick={() => (onHints ?? setOwn)(addHint(question, values, hints))}><Lightbulb aria-hidden /></Button>
          <RotateButton />
        </NavButtons>
        <BranchTree organic tree={question.tree} variants={question.variants} prefixes={question.prefixes} names={{}} showSpellings={false} direction="auto" rotatable label={ar ? "أكمل الشجرة" : "Complete the tree"} renderNode={(node, index) => !isAsked(question, index) ? (
          <span className="font-quran text-lg leading-loose text-[var(--home-muted)]"><MushafText>{givenAnswer(node)}</MushafText></span>
        ) : (
          <label className="flex w-36 max-w-full flex-col gap-1">
            <span className="sr-only">{ar ? `العقدة ${num(index + 1)}` : `Node ${index + 1}`}</span>
            <input type="text" dir="rtl" lang="ar" autoComplete="off" spellCheck={false} value={values[index]} placeholder={shown[index] || undefined}
              onChange={(event) => onChange(values.map((value, at) => at === index ? event.target.value : value))}
              className="w-full rounded-sm border border-[var(--home-rule)] bg-transparent px-3 py-2 font-quran text-lg text-[var(--home-ink)] focus:border-[var(--home-accent)]" />
          </label>
        )} />
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
export function BranchPreview({ leaves, ar }: { leaves: number; ar: boolean }) {
  const tree = example.tree as Branch;
  const asked = askedNodes(tree, leaves, () => 0.5);
  return (
    <div dir="rtl">
      <BranchTree organic tree={tree} variants={example.variants as Variant[]} names={{}} showSpellings={false} label={ar ? "مثال على الشجرة" : "Example tree"} renderNode={(node, index) => {
        if (node.children.length > 0) return <span className="flex flex-col items-start">
          <span className="font-quran leading-loose"><MushafText>{node.words.join(" ")}</MushafText></span>
        </span>;
        const shown = node.words.slice(0, LEAF_WORDS + 1);
        const empty = asked.includes(index);
        return <span className="relative block min-h-8 font-quran leading-loose text-[var(--home-muted)]">
          <span aria-hidden={empty || undefined} className={empty ? "invisible" : undefined}><MushafText>{shown.join(" ")}</MushafText>{shown.length < node.words.length ? " …" : ""}</span>
          {empty && <span data-asked className="absolute inset-0 rounded-sm border border-dashed border-[var(--home-accent)]"><span className="sr-only">{ar ? "تكتبه أنت" : "You type this"}</span></span>}
        </span>;
      }} />
    </div>
  );
}

/** How a tree question works: what you type, an example tree, and how it is graded. */
export function BranchExplainer({ leaves, ar }: { leaves: number; ar: boolean }) {
  return (
    <>
      <p className="mb-4 text-sm leading-relaxed text-[var(--home-muted)]">{ar
        ? `تكتب ${num(leaves)} من أطراف الشجرة، ويُعرض باقيها مكتوبًا. الشجرة التي أطرافها أقل تُطلب كل أطرافها.`
        : `You type ${leaves} of the tree's leaves, and the rest of the tree is shown. A tree with fewer leaves asks for all of them.`}</p>
      <BranchPreview leaves={leaves} ar={ar} />
      <dl className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--home-ink)]">
        <div><dt className="inline font-semibold">{ar ? "التصحيح: " : "Grading: "}</dt><dd className="inline">{ar
          ? "تكفي من كل طرف كلمتاه الأوليان، ويجب أن تصح كل كلمة تكتبها وبترتيبها. اكتب بالإملاء المعتاد لا برسم المصحف، والهمزة على أي كرسي. لكل طرف صحيح نقطة، والأطراف المتشابهة في الشكل تقبل أي ترتيب."
          : "A leaf's first two words are enough, and every word you type must be right and in order. Type ordinary spelling, not the mushaf script; a hamza may sit on any seat. Each correct leaf scores a point, and leaves of the same shape can go in either order."}</dd></div>
        <div><dt className="inline font-semibold">{ar ? "الزر الملوّن: " : "Coloured button: "}</dt><dd className="inline">{ar
          ? "يظهر بعد التحقق على عقدة تجمع آيات تختلف كلماتها في علامات الضبط، مثل «إِن» و«إِنْ» أعلاه. اضغطه لترى كل آية في سياقها والكلمات المختلفة بارزة."
          : "After checking, it marks a node whose ayat differ in the marks of its words, like «إِن» and «إِنْ» above. Press it to see each ayah in context with the differing words highlighted."}</dd></div>
        <div><dt className="inline font-semibold">{ar ? "الكلمة الأولى: " : "First word: "}</dt><dd className="inline">{ar
          ? "إذا بدأت بعض الآيات بالواو أو الفاء رُسمت كل صيغة وحدها، الخضراء بالواو والبنفسجية بالفاء."
          : "When some ayat open with و or ف, each spelling is drawn on its own: green with و, purple with ف."}</dd></div>
      </dl>
    </>
  );
}
