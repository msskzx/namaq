"use client";

import { useMemo, useState } from "react";
import surahRows from "@shared/data/quran/surahs.json";
import { pageModel, reciteView } from "@shared/quran/recitePage";
import { pageAsk, type PageAsk } from "@shared/quran/writeAyah";
import MushafPage from "@/app/quran/read/MushafPage";
import { useWriteBoxes, type Graded } from "@/app/quran/read/useWriteBoxes";
import { useAyahPage } from "@/components/homepage/AyahLines";
import { useQuizPageBefore } from "@/lib/quizPageBefore";

const NAMES: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.title]));
/** MushafPage asks for an ayah's end sign with this word. */
const END = Number.MAX_SAFE_INTEGER;

/**
 * A quiz question about one ayah drawn as its whole mushaf page, as the app's QuizPage (owner, 2026-11-17): every other word
 * an empty box of its shape with only the ayah numbers left, and nothing around the page says where it is; with the setting
 * on, the ayat before it written. `ask` (the question's PageAsk) says how much of it shows, what is written and whether its
 * surah title shows; `shown` shows all of it. With `onGraded`, the words asked are written in boxes in their places and graded
 * once the last box is written.
 */
export default function QuizPage({ ayah, ask, shown, onGraded }: { ayah: string; ask: PageAsk; shown: boolean;
  onGraded?: (graded: Graded) => void }) {
  const { pages, words } = useAyahPage(ayah);
  const before = useQuizPageBefore();
  const [graded, setGraded] = useState<Graded | null>(null);
  const parts = useMemo(() => {
    if (!pages || !words) return null;
    const model = pageModel(pages.data, pages.top);
    return { model, ...pageAsk(ayah, words, ask) };
  }, [pages, words, ayah, ask]);
  const nameless = ask.title === "hidden";
  const writing = !!onGraded && !shown && !graded;
  // The boxes start once the page is here, so the first asked word is the box being written.
  const boxes = useWriteBoxes({ ayah: onGraded && parts ? ayah : null, words: words ?? [], asked: onGraded ? parts?.asked ?? [] : [], onDone: result => {
    setGraded(result);
    onGraded?.(result);
  } });
  const open = shown || !!graded;
  const view = useMemo(() => {
    if (!parts) return null;
    const { titles: titled, order } = parts.model;
    const steps = ayah.endsWith(":1") ? titled.get(Number(ayah.split(":")[0])) ?? 0 : 0;
    const at = order.indexOf(ayah);
    return {
      titled,
      next: reciteView(parts.model, { start: ayah, shown: null, words: 0 }).upcoming,
      hidden: (key: string, word: number) => {
        // Ayah numbers stay, so the page keeps the shape of its ayat.
        if (word === END) return false;
        const title = key.endsWith(":1") ? titled.get(Number(key.split(":")[0])) ?? 0 : 0;
        // The asked ayah's surah title shows when it is the question, and else stays hidden until it is answered (always
        // when the surah is the answer).
        if (key === ayah) return word < steps ? ask.title !== "shown" && (nameless || !open || !before) : !open && word - steps >= parts.cut;
        const place = order.indexOf(key);
        if (!before || place < 0 || place > at) return true;
        return nameless && word < title;
      },
    };
  }, [parts, ayah, open, before, nameless, ask.title]);
  if (!pages || !parts || !view) return <div className="aspect-[2/3] w-full animate-pulse rounded-[14px] bg-[var(--home-paper-deep)]" />;
  // The page sizes itself by its container (Mushaf.module.css .page), so the box it sits in is one page's shape.
  return <div lang="ar" dir="rtl" className="mb-4 aspect-[0.66] w-full [container-type:size]" onClick={writing ? boxes.focus : undefined}>
    <MushafPage page={pages.page} data={pages.data} top={pages.top} names={NAMES} hidden={view.hidden} titled={view.titled} next={view.next} anonymous={!before || nameless}
      write={writing ? { key: ayah, targets: parts.asked, typed: boxes.typed, current: boxes.current, before: 0, onBox: boxes.pick } : null}
      checked={graded ? { key: ayah, ...graded, before: 0 } : null} />
    {writing && boxes.field({ "aria-label": "اكتب الكلمة" })}
  </div>;
}
