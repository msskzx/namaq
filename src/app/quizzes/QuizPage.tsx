"use client";

import { useEffect, useMemo, useState } from "react";
import surahRows from "@shared/data/quran/surahs.json";
import type { RecitePosition } from "@shared/quran/recite";
import { pageModel } from "@shared/quran/recitePage";
import { shownCut, type PageAsk } from "@shared/quran/writeAyah";
import MushafPage from "@/app/quran/read/MushafPage";
import type { Graded } from "@/app/quran/read/useWriteBoxes";
import { useAyahPage } from "@/components/homepage/AyahLines";
import RecitePill from "@/components/recite/RecitePill";
import { useRecite } from "@/components/recite/useRecite";
import { useQuizPageBefore } from "@/lib/quizPageBefore";
import { useQuizPen } from "@/lib/penRule";
import { writtenGrade } from "@shared/quiz/score";
import type { PenRule } from "@shared/quran/writeAyah";

/** A recited ayah in a party (QuizPage's `party`). */
export type PartyWrite = { pen: PenRule; asked: number[]; onSubmit: (answer: string[]) => void; words?: string[]; answer?: string[] | null };

const NAMES: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.title]));
/** MushafPage asks for an ayah's end sign with this word. */
const END = Number.MAX_SAFE_INTEGER;
/** Whether the quiz's recite bar starts with the pen on (writing) or off (revealing). */
const WRITE = "quiz-write";

/**
 * A quiz question about one ayah drawn as its whole mushaf page, as the app's QuizPage (owner, 2026-11-17): every other word
 * an empty box of its shape with only the ayah numbers left, and nothing around the page says where it is; with the setting
 * on, the ayat before it written. `ask` (the question's PageAsk) says how much of the asked ayah shows and whether its surah
 * title shows. A recited question (`ask.recite`) is recited with recite mode's own bar (components/recite), as in the mushaf,
 * stopping at the ayah's end: `onWritten` gets the grade when the pen wrote it, `onShown` runs once it shows. `shown` shows all of it.
 */
export default function QuizPage({ ayah, ask, shown, onWritten, onShown, party, ar = true }: { ayah: string; ask: PageAsk; shown: boolean;
  onWritten?: (graded: Graded) => void; onShown?: () => void;
  /** In a party: the pen on with the host's rule, what is written handed over, and once revealed, the words marked by what was sent. */
  party?: PartyWrite; ar?: boolean }) {
  const { pages, words } = useAyahPage(ayah);
  const before = useQuizPageBefore();
  const quizPen = useQuizPen();
  const pen = party?.pen ?? quizPen;
  const [sent, setSent] = useState(false);
  const parts = useMemo(() => (pages && words ? { model: pageModel(pages.data, pages.top), cut: shownCut(ayah, words, ask.shows) } : null), [pages, words, ayah, ask.shows]);
  const [position, setPosition] = useState<RecitePosition | null>(null);
  // The page comes from the server: the recitation starts once it is here, with the words the question shows.
  useEffect(() => { if (parts && !position) setPosition({ start: ayah, shown: null, words: parts.cut }); }, [parts, position, ayah]);
  const [writing, setWriting] = useState(true);
  useEffect(() => { try { setWriting(localStorage.getItem(WRITE) !== "false"); } catch {} }, []);
  const toggleWriting = () => setWriting(on => { try { localStorage.setItem(WRITE, String(!on)); } catch {} return !on; });
  const recite = useRecite({ model: ask.recite ? parts?.model ?? null : null, position, setPosition, writing: (writing || !!party) && !shown && !sent, pen, until: ayah, floor: parts?.cut ?? 0,
    onWritten: (_key, graded) => onWritten?.(graded),
    onSubmit: party ? (_key, typed) => { setSent(true); party.onSubmit(party.asked.map(at => typed[at] ?? "")); } : undefined });
  // Revealed in a party: the words marked by what this player sent, as the party graded them.
  const marked = shown && party?.words && party.answer ? { key: ayah, ...writtenGrade({ asked: party.asked, words: party.words }, party.answer) } : null;
  const open = shown || !ask.recite || recite.done;
  useEffect(() => { if (recite.done) onShown?.(); }, [recite.done]); // eslint-disable-line react-hooks/exhaustive-deps
  const nameless = ask.title === "hidden";
  const view = useMemo(() => {
    if (!parts || !position) return null;
    const { titles: titled, order } = parts.model;
    const steps = ayah.endsWith(":1") ? titled.get(Number(ayah.split(":")[0])) ?? 0 : 0;
    const at = order.indexOf(ayah);
    const base = recite.view;
    return {
      titled,
      // The quiz stops at its ayah: nothing after it is the next one.
      next: recite.done || open ? null : base?.upcoming ?? ayah,
      hidden: (key: string, word: number) => {
        // Ayah numbers stay, so the page keeps the shape of its ayat.
        if (word === END) return false;
        const title = key.endsWith(":1") ? titled.get(Number(key.split(":")[0])) ?? 0 : 0;
        // The asked ayah's surah title shows when it is the question, and else stays hidden until it is answered (always
        // when the surah is the answer); its words are recite mode's, or the question's cut when it is not recited.
        if (key === ayah) return word < steps ? ask.title !== "shown" && (nameless || !open || !before) : !open && (base ? base.hidden(ayah, word - steps) : word - steps >= parts.cut);
        const place = order.indexOf(key);
        if (!before || place < 0 || place > at) return true;
        return nameless && word < title;
      },
    };
  }, [parts, position, ayah, open, before, nameless, ask.title, recite.view, recite.done]);
  if (!pages || !parts || !view) return <div className="aspect-[2/3] w-full animate-pulse rounded-[14px] bg-[var(--home-paper-deep)]" />;
  const write = shown ? null : recite.write;
  // The page sizes itself by its container (Mushaf.module.css .page), so the box it sits in is one page's shape.
  return <div className="mb-4 flex flex-col gap-3">
    <div lang="ar" dir="rtl" className="aspect-[0.66] w-full [container-type:size]" onClick={write ? recite.boxes.focus : undefined}>
      <MushafPage page={pages.page} data={pages.data} top={pages.top} names={NAMES} hidden={view.hidden} titled={view.titled} next={view.next} anonymous={!before || nameless}
        write={write ? { ...write, before: 0 } : null} checked={marked ? { ...marked, before: 0 } : recite.checked ? { ...recite.checked, before: 0 } : null} />
    </div>
    {ask.recite && !shown && !sent && <RecitePill recite={recite} writing={writing} onWriting={toggleWriting} ar={ar} className="self-center" />}
    {write && recite.boxes.field({ "aria-label": ar ? "اكتب الكلمة" : "Write the word" })}
  </div>;
}
