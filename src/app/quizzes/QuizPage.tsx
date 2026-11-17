"use client";

import { useMemo, useState } from "react";
import surahRows from "@shared/data/quran/surahs.json";
import { pageModel, reciteView } from "@shared/quran/recitePage";
import { maxLetters } from "@shared/quran/writeAyah";
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
 * on, the ayat before it written. `opening` spoken words of the asked ayah show; `shown` shows all of it. With `onGraded`,
 * the rest is written in boxes in its places and graded once the last box is written.
 */
export default function QuizPage({ ayah, opening, shown, nameless = false, onGraded }: { ayah: string;
  /** How many of the ayah's spoken words show (the mushaf's ۞ is no word); all of them when left out. */
  opening?: number; shown: boolean;
  /** The surah is the answer («في أي سورة؟»): no surah title or name shows, even with the ayat before written. */
  nameless?: boolean;
  onGraded?: (graded: Graded) => void }) {
  const { pages, words } = useAyahPage(ayah);
  const before = useQuizPageBefore();
  const [graded, setGraded] = useState<Graded | null>(null);
  const parts = useMemo(() => {
    if (!pages || !words) return null;
    const model = pageModel(pages.data, pages.top);
    const spoken = words.flatMap((word, at) => (maxLetters(word) ? [at] : []));
    const cut = opening === undefined ? words.length : spoken[opening] ?? words.length;
    return { model, cut, asked: spoken.filter(at => at >= cut) };
  }, [pages, words, opening]);
  const writing = !!onGraded && !shown && !graded;
  const boxes = useWriteBoxes({ ayah: onGraded ? ayah : null, words: words ?? [], asked: onGraded ? parts?.asked ?? [] : [], onDone: result => {
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
        if (key === ayah) return word < steps || (!open && word - steps >= parts.cut);
        const place = order.indexOf(key);
        if (!before || place < 0 || place > at) return true;
        return nameless && word < title;
      },
    };
  }, [parts, ayah, open, before, nameless]);
  if (!pages || !parts || !view) return <div className="aspect-[2/3] w-full animate-pulse rounded-[14px] bg-[var(--home-paper-deep)]" />;
  return <div lang="ar" dir="rtl" className="mb-4" onClick={writing ? boxes.focus : undefined}>
    <MushafPage page={pages.page} data={pages.data} top={pages.top} names={NAMES} hidden={view.hidden} titled={view.titled} next={view.next} anonymous={!before || nameless}
      write={writing ? { key: ayah, targets: parts.asked, typed: boxes.typed, current: boxes.current, before: 0, onBox: boxes.pick } : null}
      checked={graded ? { key: ayah, ...graded, before: 0 } : null} />
    {writing && boxes.field({ "aria-label": "اكتب الكلمة" })}
  </div>;
}
