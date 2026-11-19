"use client";

// The compare quiz (shared/quiz/compareQuiz.ts) as the app draws it (mobile QuizCompare.tsx): matrix only, no trees (owner, 2026-11-17).
import React from "react";
import { Eraser, Lightbulb, SquareArrowOutUpLeft } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/common/Button";
import MushafText from "@/components/common/MushafText";
import { NavButtons } from "@/components/common/NavBar";
import { num } from "@shared/quran/arabicNumber";
import { compareAnchor } from "@shared/compareBookmarks";
import { surahPairHref } from "@shared/quran/curatedComparisons";
import { addCompareHint, blankWords, compareCorrections, compareHintsOf, compareLabel, comparePieces, emptyCompareAnswers, type CompareAsk, type CompareLine, type Tone } from "@shared/quiz/compareAnswers";
import { neededCut, typedMarks, verdict, type Correction } from "@shared/quiz/feedback";
import type { Hints } from "@shared/quiz/hints";
import Card from '@/components/common/Card';
import { BlankBoxes } from "@/app/quran/read/MushafPage";
import { useWriteBlanks } from "@/components/recite/useRecite";
import { writeBlank } from "@shared/quiz/writeBlanks";

type Question = { compare?: CompareAsk };

/** The app-wide word-match colours: same words terracotta, written differently amber, same root purple. */
const TONES: Record<NonNullable<Tone>, string> = {
  exact: "text-[var(--home-accent)]",
  written: "text-[var(--home-amber)]",
  root: "text-[var(--home-root)]",
  related: "text-[color-mix(in_srgb,var(--home-root)_55%,var(--home-muted))]",
};

const Words = ({ line, at }: { line: CompareLine; at: number[] }) =>
  <>{at.map(i => <span key={i} className={line.tones[i] ? TONES[line.tones[i]!] : undefined}><MushafText>{line.words[i]}</MushafText></span>)}</>;

function Line({ line, ar, children, after }: { line: CompareLine; ar: boolean; children: React.ReactNode; after?: React.ReactNode }) {
  return <Card className="p-2.5">
    <p className="text-xs text-[var(--home-muted)]">{compareLabel(line.key)}</p>
    <p className="flex flex-wrap items-center gap-x-2 font-quran text-lg leading-loose text-[var(--home-ink)]">
      {children}
      <span className="text-[var(--home-muted)]">{ar ? num(Number(line.key.split(":")[1])) : line.key.split(":")[1]}</span>
    </p>
    {after}
  </Card>;
}

const Whole = ({ line, ar }: { line: CompareLine; ar: boolean }) => <Line line={line} ar={ar}><Words line={line} at={line.words.map((_, i) => i)} /></Line>;

export function CompareInputs({ question, typed, onChange, onCheck, ar, hints: kept, onHints }: { question: Question; typed: string[]; onChange: (typed: string[]) => void; onCheck: () => void; ar: boolean;
  /** The hints shown so far, when the quiz keeps them (solo, so the review can mark them); otherwise they live here. */
  hints?: Hints; onHints?: (hints: Hints) => void }) {
  const [own, setOwn] = React.useState<Hints>({});
  const ask = question.compare;
  // Each blank in recite mode's boxes (owner, 2026-11-19): its first two words to write, the rest faint.
  const blanks = React.useMemo(() => ask ? ask.blanks.map((_, blank) => writeBlank(blank, blankWords(ask, blank))) : [], [ask]);
  const values = ask ? ask.blanks.map((_, index) => typed[index] ?? "") : [];
  const write = useWriteBlanks({ id: ask ? `${ask.card}:${ask.asked.key}` : "", blanks, texts: values, onType: (blank, text) => onChange(values.map((value, at) => at === blank ? text : value)),
    // Enter on the last box checks, as Enter in a field did.
    onEnd: () => { if (values.some(value => value.trim())) onCheck(); } });
  if (!ask) return null;
  const hints = kept ?? own;
  const shown = compareHintsOf(ask, hints);
  const started = values.some(value => value.trim());
  const hintLabel = ar ? "تلميح: حرف آخر من كل فراغ" : "Hint: one more letter in each empty blank";
  return (
    <form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); if (started) onCheck(); }}>
      {write.field({ "aria-label": ar ? "اكتب الكلمة" : "Write the word" })}
      <div dir="rtl" className="flex flex-col gap-2.5" data-quiz-compare>
        <NavButtons>
          <Button size="lg" variant="muted" aria-label={hintLabel} title={hintLabel} onClick={() => (onHints ?? setOwn)(addCompareHint(ask, values, hints))}><Lightbulb aria-hidden /></Button>
        </NavButtons>
        <Whole line={ask.shown} ar={ar} />
        <Line line={ask.asked} ar={ar}>
          {comparePieces(ask).map((piece, i) => "given" in piece
            ? <Words key={i} line={ask.asked} at={piece.given} />
            : <BlankBoxes key={i} blank={blanks[piece.blank]} index={piece.blank} write={write} hint={shown[piece.blank] || undefined} name={ar ? `الفراغ ${num(piece.blank + 1)}` : `Blank ${piece.blank + 1}`} />)}
        </Line>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" type="submit" disabled={!started}><FontAwesomeIcon icon={faCheckDouble} />{ar ? "تحقق" : "Check"}</Button>
        <Button disabled={!started} onClick={() => onChange(emptyCompareAnswers(question))}><Eraser size={16} aria-hidden />{ar ? "مسح الإجابات" : "Clear answers"}</Button>
      </div>
    </form>
  );
}

function Badge({ row, ar }: { row: Correction; ar: boolean }) {
  return <span aria-hidden className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full font-sans text-sm font-bold ${row.correct ? "bg-[color-mix(in_srgb,var(--home-green)_15%,var(--home-paper))] text-[var(--home-green)]" : "bg-[var(--home-action,var(--home-accent))] text-[var(--home-on-action,var(--home-paper))]"}`}>{ar ? num(row.number) : row.number}</span>;
}

function Mark({ row, ar, hinted }: { row: Correction; ar: boolean; hinted: boolean }) {
  return <li className="flex flex-col gap-0.5">
    <span className="flex items-center gap-2"><Badge row={row} ar={ar} /><span className="font-semibold">{verdict(row, ar)}</span>
      {hinted && <Lightbulb size={15} className="text-[var(--home-muted)]" aria-label={ar ? "بتلميح" : "With a hint"} />}</span>
    {!row.correct && <span className="text-sm text-[var(--home-muted)]">{ar ? "كتبتَ: " : "You typed: "}
      {row.typed ? <span className="font-quran text-lg">{typedMarks(row).map(({ word, right }, at) => <React.Fragment key={at}>
        {at > 0 && " "}{right ? <span className="text-[var(--home-green)]">{word}</span> : <del className="text-[var(--home-accent)]">{word}</del>}
      </React.Fragment>)}</span> : (ar ? "لا شيء" : "nothing")}</span>}
  </li>;
}

/** The checked question: each blank's words after its numbered badge, the ones enough to type underlined; the verdicts under the ayah. */
export function CompareFeedback({ question, typed, ar, hints }: { question: Question; typed: string[]; ar: boolean; hints?: Hints }) {
  const ask = question.compare;
  if (!ask) return null;
  const rows = compareCorrections(ask, typed);
  const [a, b] = ask.card.split("|").map(key => { const [surah, ayah] = key.split(":").map(Number); return { surah, ayah }; });
  const label = ar ? "افتح في مقارنة السور" : "Open in compare";
  return (
    <div dir="rtl" className="flex flex-col gap-2.5" data-quiz-compare>
      <NavButtons>
        <Button size="lg" variant="muted" aria-label={label} title={label} href={`${surahPairHref(a.surah, b.surah)}#${compareAnchor(a, b)}`}><SquareArrowOutUpLeft aria-hidden /></Button>
      </NavButtons>
      <Whole line={ask.shown} ar={ar} />
      <Line line={ask.asked} ar={ar} after={<ul className="mt-2 flex flex-col gap-2 border-t border-[var(--home-rule)] pt-2 text-[var(--home-ink)]">
        {rows.map(row => <Mark key={row.index} row={row} ar={ar} hinted={!!hints?.[row.index]} />)}
      </ul>}>
        {comparePieces(ask).map((piece, i) => {
          if ("given" in piece) return <Words key={i} line={ask.asked} at={piece.given} />;
          const words = blankWords(ask, piece.blank);
          const cut = neededCut(words, rows[piece.blank].needed);
          return <span key={i} className="inline-flex items-center gap-1.5" data-blank>
            <Badge row={rows[piece.blank]} ar={ar} />
            <span className="underline decoration-2 underline-offset-8"><MushafText>{words.slice(0, cut).join(" ")}</MushafText></span>
            {cut < words.length && <MushafText>{words.slice(cut).join(" ")}</MushafText>}
          </span>;
        })}
      </Line>
    </div>
  );
}
