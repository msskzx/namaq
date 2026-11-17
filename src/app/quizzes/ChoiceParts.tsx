"use client";

import { BookOpen, Eye } from "lucide-react";
import Button from "@/components/common/Button";
import { ayahHref } from "@shared/ayahMarks";
import { alikeDiff, FORGOT, RECITE_SNIPPET, RECITED, type ChoiceQuestion } from "@shared/quiz/choiceKinds";
import { WHICH_SURAH } from "@shared/quiz/whichSurah";
import QuizPage from "./QuizPage";
import { mushafText } from "@shared/quran/mushafText";
import { num } from "@shared/quran/arabicNumber";

export type ChoiceParts = Partial<Pick<ChoiceQuestion, "quran" | "number" | "reveal" | "ayahKey" | "alike" | "note">> & { correctAnswer?: string; family?: string };

/** The kinds asked on the ayah's own mushaf page (owner, 2026-11-17), in its place and shape, as in the app's QuizChoice. */
const ON_PAGE = new Set<string>([RECITE_SNIPPET, WHICH_SURAH]);

function Words({ words, marked }: { words: string[]; marked?: number[] }) {
  return <>{words.map((word, at) => <span key={at} className={marked?.includes(at) ? "text-[var(--home-accent)]" : undefined}>{mushafText(word)}{at < words.length - 1 ? " " : ""}</span>)}</>;
}

/**
 * The ayah a choice question asks about, and a recited snippet's hidden rest until it is shown. Recite and «في أي سورة؟» draw
 * it as its whole mushaf page (QuizPage), where the rest of a recited ayah is written in boxes and its grade answers حفظتها or نسيتها.
 */
export function ChoiceQuran({ question, given, revealed, onReveal, onAnswer, ar }: { question: ChoiceParts; given?: string; revealed: boolean; onReveal?: () => void;
  /** A recited ayah's written rest, graded: حفظتها when every word is right, نسيتها otherwise. */
  onAnswer?: (value: string) => void; ar: boolean }) {
  if (question.ayahKey && question.family && ON_PAGE.has(question.family)) {
    const recite = question.family === RECITE_SNIPPET;
    return <div dir="rtl" lang="ar">
      <QuizPage key={question.ayahKey} ayah={question.ayahKey} shown={revealed} opening={recite ? question.quran?.length ?? 0 : undefined} nameless={!recite}
        onGraded={recite && given === undefined && onAnswer ? graded => onAnswer(graded.wrong.length ? FORGOT : RECITED) : undefined} />
      {question.reveal && !revealed && onReveal && <Button className="mb-4" variant="primary" onClick={onReveal}><Eye size={16} aria-hidden />{ar ? "أظهر الآية" : "Show the ayah"}</Button>}
    </div>;
  }
  if (!question.quran) return null;
  // After a wrong pick with a look-alike, the words where the two part are marked in both.
  const alike = given !== undefined && given !== question.correctAnswer ? question.alike?.[given] : undefined;
  const marked = alike ? alikeDiff(question.quran, alike.words).a : undefined;
  return <div className="mb-4" dir="rtl" lang="ar">
    <p className="rounded-[14px] border border-[var(--home-rule)] bg-[var(--home-card)] p-4 text-justify font-quran text-2xl leading-loose text-[var(--home-ink)] [text-align-last:right]">
      <Words words={question.quran} marked={marked} />
      {question.number !== undefined && <span className="text-[var(--home-accent)]"> {num(question.number)}</span>}
      {question.reveal && (revealed ? <span className="text-[var(--home-accent)]"> <Words words={question.reveal} /></span> : " …")}
    </p>
    {question.reveal && !revealed && onReveal && <Button className="mt-3" variant="primary" onClick={onReveal}><Eye size={16} aria-hidden />{ar ? "أظهر الآية" : "Show the ayah"}</Button>}
  </div>;
}

/** After answering: the look-alike in the surah picked, a note, and the ayah in the mushaf. */
export function ChoiceAfter({ question, given, surahName, ar, mushaf = true }: { question: ChoiceParts; given?: string; surahName?: (value: string) => string | undefined; ar: boolean;
  /** The mushaf button. A home card leaves it out and puts it in its own button row (owner, 2026-11-15). */
  mushaf?: boolean }) {
  const alike = given !== undefined && given !== question.correctAnswer ? question.alike?.[given] : undefined;
  return <div className="mt-4 flex flex-col gap-3" dir="rtl" lang="ar">
    {alike && question.quran && <div className="border-t border-dashed border-[var(--home-rule)] pt-3">
      <p className="text-sm text-[var(--home-muted)]">{`آية ${surahName?.(given!) ?? ""} التي تشبهها، ${num(Number(alike.key.split(":")[1]))}`}</p>
      <p className="text-justify font-quran text-xl leading-loose [text-align-last:right]"><Words words={alike.words} marked={alikeDiff(question.quran, alike.words).b} /></p>
    </div>}
    {question.note && <div><p className="text-sm text-[var(--home-muted)]">{question.note.label}</p><p className="leading-loose">{question.note.text}</p></div>}
    {mushaf && question.ayahKey && <Button className="self-start" size="sm" href={ayahHref(question.ayahKey)}><BookOpen size={16} aria-hidden />{ar ? "في المصحف" : "In the mushaf"}</Button>}
  </div>;
}
