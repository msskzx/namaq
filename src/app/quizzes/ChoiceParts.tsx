"use client";

import { BookOpen, Eye } from "lucide-react";
import Button from "@/components/common/Button";
import { ayahHref } from "@shared/ayahMarks";
import { alikeDiff, BOX_ASKED, FORGOT, RECITED, type ChoiceQuestion } from "@shared/quiz/choiceKinds";
import QuizPage from "./QuizPage";
import type { WriteAsk } from "@shared/quiz/score";
import type { PenRule } from "@shared/quran/writeAyah";
import { num } from "@shared/quran/arabicNumber";
import Card from '@/components/common/Card';
import QuranWords from '@/components/quran/text/QuranWords';
import BookRuns from '@/components/quran/text/BookRuns';
import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';
import QuizSources from "@/components/quiz/QuizSources";
import Chip from "@/components/common/Chip";

export type ChoiceParts = Partial<Pick<ChoiceQuestion, "quran" | "number" | "reveal" | "page" | "ayahKey" | "alike" | "note" | "sources" | "marked" | "explains" | "passage" | "boxes" | "quranChoices" | "whereOf">> & { correctAnswer?: string; family?: string; write?: WriteAsk };

function Words({ words, marked }: { words: string[]; marked?: number[] }) {
  // A run of ayat carries each ayah's number between them, drawn as the end mark after the last one is.
  return <>{words.map((word, at) => <AyahWords key={at} className={marked?.includes(at) || AYAH_NUMBER.test(word) ? "text-[var(--home-accent)]" : undefined}>{`${word}${at < words.length - 1 ? " " : ""}`}</AyahWords>)}</>;
}

const AYAH_NUMBER = /^[٠-٩]+$/;

/**
 * A choice as the question draws it: Quran words (whole ayat, a reading) in the mushaf's font, and once answered what it is
 * (an ayah's place, a reading's readers). Solo, party and the review all draw a choice with it.
 */
export function ChoiceLabel({ question, value, label, answered }: { question: ChoiceParts; value: string; label: string; answered: boolean }) {
  const where = answered ? question.whereOf?.[value] : undefined;
  const text = question.quranChoices ? <AyahFlow><AyahWords>{label}</AyahWords></AyahFlow> : label;
  return where ? <span className="flex w-full flex-col items-start"><span className="w-full">{text}</span><span className="text-xs text-[var(--home-muted)]">{where}</span></span> : <>{text}</>;
}

/** A book's text the question asks about («لأي آية هذا التفسير؟»), its quotes of the ayah hidden. */
function ChoicePassage({ text }: { text: string }) {
  return <p className="mb-4 text-lg leading-loose text-[var(--home-ink)]"><BookRuns text={text} /></p>;
}

/**
 * A chain drawn as boxes («أكمل النسب», the app's QuizChoice): each name a chip, «؟» the box asked (framed in the accent),
 * «…» another blank; once answered the asked box holds the right name.
 */
function ChoiceBoxes({ boxes, answer }: { boxes: string[]; answer?: string }) {
  return <ol className="mb-4 flex flex-wrap items-center gap-1.5" dir="rtl" lang="ar" aria-label="النسب">
    {boxes.map((box, i) => <li key={i} className="flex items-center gap-1.5">
      {i > 0 && <span aria-hidden className="text-[var(--home-muted)]">←</span>}
      {box === BOX_ASKED ? <Chip label={answer ?? box} on={answer !== undefined} lit dashed={answer === undefined} /> : <Chip label={box} />}
    </li>)}
  </ol>;
}

/**
 * The ayah a choice question asks about, and a recited snippet's hidden rest until it is shown. A question asked on the page
 * draws it as its whole mushaf page (QuizPage, as the app's QuizChoice), where what it asks is written in boxes and its grade
 * answers حفظتها or نسيتها.
 */
export function ChoiceQuran({ question, given, revealed, onReveal, onAnswer, ar, pen, onWrite, written }: { question: ChoiceParts; given?: string; revealed: boolean; onReveal?: () => void;
  /** A party's recited ayah (`question.write`): the host's pen rule, what was written sent with `onWrite`, and once revealed, what was `written` (null for nothing). */
  pen?: PenRule; onWrite?: (answer: string[], done: boolean) => void; written?: string[] | null;
  /** A recited ayah's written rest, graded: حفظتها when every word is right, نسيتها otherwise. */
  onAnswer?: (value: string) => void; ar: boolean }) {
  if (question.ayahKey && question.page) {
    return <div dir="rtl" lang="ar">
      <QuizPage key={`${question.family}:${question.ayahKey}`} ayah={question.ayahKey} ask={question.page} shown={question.write ? written !== undefined : revealed}
        party={question.write ? { pen: pen ?? "whole", asked: question.write.asked, words: question.write.words, answer: written, onWrite: onWrite ?? (() => {}) } : undefined}
        onShown={onReveal} ar={ar} onWritten={given === undefined && onAnswer ? graded => onAnswer(graded.wrong.length ? FORGOT : RECITED) : undefined} />
    </div>;
  }
  if (question.passage) return <div dir="rtl" lang="ar"><ChoicePassage text={question.passage} /></div>;
  if (question.boxes) return <ChoiceBoxes boxes={question.boxes} answer={given !== undefined ? question.correctAnswer : undefined} />;
  if (!question.quran) return null;
  // After a wrong pick with a look-alike, the words where the two part are marked in both.
  const alike = given !== undefined && given !== question.correctAnswer ? question.alike?.[given] : undefined;
  const marked = alike ? alikeDiff(question.quran, alike.words).a : question.marked;
  return <div className="mb-4" dir="rtl" lang="ar">
    <Card className="p-4 text-[var(--home-ink)]">
      <AyahFlow>
        <Words words={question.quran} marked={marked} />
        {question.number !== undefined && <span className="text-[var(--home-accent)]"> {num(question.number)}</span>}
        {question.reveal && (revealed ? <span className="text-[var(--home-accent)]"> <Words words={question.reveal} /></span> : " …")}
      </AyahFlow>
    </Card>
    {question.reveal && !revealed && onReveal && <Button className="mt-3" variant="primary" onClick={onReveal}><Eye size={16} aria-hidden />{ar ? "أظهر الآية" : "Show the ayah"}</Button>}
  </div>;
}

/** After answering: the look-alike in the surah picked, a note, where the answer comes from, and the ayah in the mushaf. */
export function ChoiceAfter({ question, given, surahName, ar, mushaf = true }: { question: ChoiceParts; given?: string; surahName?: (value: string) => string | undefined; ar: boolean;
  /** The mushaf button. A home card leaves it out and puts it in its own button row (owner, 2026-11-15). */
  mushaf?: boolean }) {
  const alike = given !== undefined && given !== question.correctAnswer ? question.alike?.[given] : undefined;
  return <div className="mt-4 flex flex-col gap-3" dir="rtl" lang="ar">
    {alike && question.quran && <div className="border-t border-dashed border-[var(--home-rule)] pt-3">
      <p className="text-sm text-[var(--home-muted)]">{`آية ${surahName?.(given!) ?? ""} التي تشبهها، ${num(Number(alike.key.split(":")[1]))}`}</p>
      <AyahFlow><Words words={alike.words} marked={alikeDiff(question.quran, alike.words).b} /></AyahFlow>
    </div>}
    {/* What each wrong choice is («معنى «فراتا»، المرسلات ٢٧»): solo, party and the review all draw this. */}
    {question.explains && <ul className="flex flex-col gap-1 text-sm text-[var(--home-muted)]">
      {Object.entries(question.explains).map(([value, { quote, where }]) => (
        <li key={value}>{surahName?.(value) ? `${surahName(value)}: ` : ""}معنى «<QuranWords>{quote}</QuranWords>»، {where}</li>
      ))}
    </ul>}
    {question.note && <div><p className="text-sm text-[var(--home-muted)]">{question.note.label}</p><p className="leading-loose">{question.note.text}</p></div>}
    {/* Where the answer comes from, each book collapsed to its name (owner, 2026-11-19); solo, party and the review all draw this. */}
    <QuizSources sources={question.sources} />
    {mushaf && question.ayahKey && <Button className="self-start" size="sm" href={ayahHref(question.ayahKey)}><BookOpen size={16} aria-hidden />{ar ? "في المصحف" : "In the mushaf"}</Button>}
  </div>;
}
